const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
const { Pool } = require("pg");
const { dbConfig } = require('../bddinfo/info'); // Importation du fichier de configuration


const app = express();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const VS3_BASE_URL = "https://cxaqrw8hka.execute-api.eu-north-1.amazonaws.com/dev/timeline-photo/";

const port = 3000;

// Initialisation de la connexion PostgreSQL
const pool = new Pool(dbConfig);

const postPersonne = async (req, res) => {

    const user = req.body.user;
    const timelineName = req.body.timeline_name;
    const nom = req.body.nom;
    const prenom = req.body.prenom; 
    const naissance = req.body.naissance; 
    const description = req.body.description; 


    console.log(req.body)
    console.log(req.body.user)
    console.log(req.body.timeline_name)
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucune image fournie" });
        }

        const fileName = `${Date.now()}_${req.file.originalname}`;
        const uploadUrl = `${VS3_BASE_URL}${fileName}`;

        // Envoi de l’image à VS3
        await axios.put(uploadUrl, req.file.buffer, {
            headers: { "Content-Type": req.file.mimetype }
        });

        // Enregistrement du chemin en BDD
       // const { timeline_name, nom, user } = req.body;
        const photoPath = `/timeline-photo/${fileName}`;
        const usersArray = JSON.parse(user); // Convertir JSON string en tableau JS

        const insertQuery = `
        INSERT INTO personne (nom, timeline_name, photo, users, prenom, description, naissance) 
        VALUES ($1, $2, $3, $4::TEXT[],$5,$6,$7) RETURNING id;
    `;
    const result = await pool.query(insertQuery, [nom, timelineName, photoPath, usersArray,prenom,description,naissance]);
    
    
    

        res.json({ message: "Image uploadée avec succès", photoPath, id: result.rows[0].id });

    } catch (error) {
        console.error("Erreur lors de l'upload :", error);
        res.status(500).json({ error: "Erreur lors de l'upload" });
    }
};


//router.post("/upload", upload.single("photo"), async (req, res) => {


// Exporter les fonctions
module.exports = {
    postPersonne,
};
