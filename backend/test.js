const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
const { Pool } = require("pg");
const { dbConfig } = require("./bddinfo/info"); // Importation du fichier de configuration

const app = express();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const VS3_BASE_URL = "https://cxaqrw8hka.execute-api.eu-north-1.amazonaws.com/dev/timeline-photo/";

const port = 3000;

// Initialisation de la connexion PostgreSQL
const pool = new Pool(dbConfig);

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

router.get("/", (req, res) => {
    res.status(200).send({ message: "Bienvenue sur la page test" });
});

router.post("/upload", upload.single("photo"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucune image fournie" });
        }

        console.log(req.body)
        console.log(req.body.user)
        console.log(req.body.timeline_name)
        console.log(req.file.mimetype);




        const fileName = `${Date.now()}_${req.file.originalname}`;
        const uploadUrl = `${VS3_BASE_URL}${fileName}`;

        // Envoi de l’image à VS3
        await axios.put(uploadUrl, req.file.buffer, {
            headers: { "Content-Type": req.file.mimetype }
        });

        // Enregistrement du chemin en BDD
        const { timeline_name, nom, user } = req.body;
        const photoPath = `/timeline-photo/${fileName}`;
        const usersArray = JSON.parse(user); // Convertir JSON string en tableau JS

        const insertQuery = `
        INSERT INTO personne (nom, timeline_name, photo, users) 
        VALUES ($1, $2, $3, $4::TEXT[]) RETURNING id;
    `;
    const result = await pool.query(insertQuery, [nom, timeline_name, photoPath, usersArray]);
    
    
    

        res.json({ message: "Image uploadée avec succès", photoPath, id: result.rows[0].id });

    } catch (error) {
        console.error("Erreur lors de l'upload :", error);
        res.status(500).json({ error: "Erreur lors de l'upload" });
    }
});

// Ajout du router à l'application Express
app.use("/", router);

module.exports = app;
