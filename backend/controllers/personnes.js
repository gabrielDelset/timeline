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

const modifyPersonne = async (req, res) => {
    const id = req.body.id;
    const user = req.body.user;
    const timelineName = req.body.timeline_name;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const naissance = req.body.naissance;
    const description = req.body.description;

    console.log(req.body);
    console.log(req.body.id);

    try {
        let photoPath = null; // Chemin de l'image à mettre à jour (optionnel)

        // Si une image est envoyée, on la traite
        if (req.file) {
            const fileName = `${Date.now()}_${req.file.originalname}`;
            const uploadUrl = `${VS3_BASE_URL}${fileName}`;

            // Envoi de l’image à VS3
            await axios.put(uploadUrl, req.file.buffer, {
                headers: { "Content-Type": req.file.mimetype }
            });

            // Mise à jour du chemin de la photo
            photoPath = `/timeline-photo/${fileName}`;
        }

        // Conversion de la liste d’utilisateurs en tableau PostgreSQL
        const usersArray = JSON.parse(user);

        // Requête SQL dynamique pour modifier uniquement les champs non nuls
        const updateFields = [];
        const values = [];
        let paramIndex = 1;

        if (nom) {
            updateFields.push(`nom = $${paramIndex++}`);
            values.push(nom);
        }
        if (timelineName) {
            updateFields.push(`timeline_name = $${paramIndex++}`);
            values.push(timelineName);
        }
        if (photoPath) {
            updateFields.push(`photo = $${paramIndex++}`);
            values.push(photoPath);
        }
        if (usersArray) {
            updateFields.push(`users = $${paramIndex++}::TEXT[]`);
            values.push(usersArray);
        }
        if (prenom) {
            updateFields.push(`prenom = $${paramIndex++}`);
            values.push(prenom);
        }
        if (description) {
            updateFields.push(`description = $${paramIndex++}`);
            values.push(description);
        }
        if (naissance) {
            updateFields.push(`naissance = $${paramIndex++}`);
            values.push(naissance);
        }

        // Ajout de l'ID en dernier paramètre pour la condition WHERE
        values.push(id);
        
        if (updateFields.length === 0) {
            return res.status(400).json({ error: "Aucune donnée à mettre à jour" });
        }

        // Construction de la requête SQL
        const updateQuery = `
            UPDATE personne
            SET ${updateFields.join(", ")}
            WHERE id = $${paramIndex}
            RETURNING *;
        `;

        const result = await pool.query(updateQuery, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Aucune personne trouvée avec cet ID" });
        }

        res.json({ message: "Personne mise à jour avec succès", data: result.rows[0] });

    } catch (error) {
        console.error("Erreur lors de la modification :", error);
        res.status(500).json({ error: "Erreur lors de la modification" });
    }
};



const getPersonnes = async (req, res) => {
    const timelineName = req.query.table;
    const user = req.query.email;

    try {
        const insertQuery = `SELECT * FROM personne WHERE $1 = ANY("users") and timeline_name = $2 ORDER BY prenom`;
        const result = await pool.query(insertQuery, [user, timelineName]);
        const personnes = result.rows.map(personne => ({
            id: personne.id,
            photo: `${VS3_BASE_URL}${personne.photo.replace('/timeline-photo/', '')}`,
            firstName: personne.prenom,
            lastName: personne.nom,
            description: personne.description,
            naissance: personne.naissance
        }));
        res.json(personnes);
    } catch (error) {
        console.error("Erreur lors de la récupération des personnes :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};



const deletePersonne = async (req, res) => {
    const { id, user, timeline_name: timelineName } = req.body;

    console.log("gab");
    console.log(req.body);
    console.log(id);
    console.log(user);
    console.log(timelineName);

    try {
        // Vérification des paramètres obligatoires
        if (!id || !user || !timelineName) {
            return res.status(400).json({ error: "ID, user et timeline_name sont requis" });
        }

        // Si user est un tableau, on prend le premier élément
        const userName = Array.isArray(user) ? user[0] : user;

        // Requête SQL corrigée
        const deleteQuery = `
            DELETE FROM personne
            WHERE id = $1 AND timeline_name = $2 AND $3 = ANY(users)
            RETURNING *;
        `;

        const result = await pool.query(deleteQuery, [id, timelineName, userName]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Aucune personne trouvée avec ces critères" });
        }

        res.json({ message: "Personne supprimée avec succès", deleted: result.rows[0] });

    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
};



const getLink = async (req, res) => {
    const user = req.query.user;
    const table = req.query.table;

    try {
        const query = `
            SELECT id, name, color, length
            FROM json_link
            WHERE $1 = ANY("users")
            AND timeline_name = $2;
        `;
        const result = await pool.query(query, [user, table]);
        console.log(result.rows);
        res.send({ data: result.rows });
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        res.status(500).send({ error: 'Erreur serveur' });
    }
};


  const deleteLink = async (req, res) => {    // on utilise une async car on fait torner le code en arriére plan 

    const user = req.body.user;
    const timeline = req.body.table;
    const id = req.body.id;

    const tabemail = [user]

    console.log(req.body);


    try {
        const query = `
      DELETE FROM json_link
      WHERE id = $1
        AND "users" = $2
        AND timeline_name = $3
      RETURNING *;
    `
        const result = await pool.query(query, [id, tabemail, timeline]);
    console.log(result.rows);
      res.send({ data: result.rows });
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      res.status(500).send({ error: 'Erreur serveur' });
    }
  };


  const postLink = async (req, res) => {    // on utilise une async car on fait torner le code en arriére plan 

    const name = req.body.name;
    const color = req.body.color;
    const length = req.body.length;
    const user = req.body.user;
    const timeline = req.body.table;

    const tabemail = [user]

    console.log(req.body);


    try {
        const query = `INSERT INTO json_link (name, color, length ,users,timeline_name) VALUES ($1, $2, $3 ,$4 , $5) RETURNING *`
        const result = await pool.query(query, [name, color, length, tabemail, timeline]);
    console.log(result.rows);
      res.send({ data: result.rows });
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      res.status(500).send({ error: 'Erreur serveur' });
    }
  };


const saveTree = async (req, res) => {    // on utilise une async car on fait torner le code en arriére plan 
  const { json, user, id } = req.body;



  try {
    const query = `
      UPDATE timeline 
      SET liens = $1
      WHERE id = $3
      AND $2 = ANY(users)
      RETURNING *;
    `;

    const result = await pool.query(query, [json, user, id]); // on passe user directement pour le ANY()
    
    console.log(result.rows);
    res.send({ data: result.rows });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données :', error);
    res.status(500).send({ error: 'Erreur serveur' });
  }
};



const savenodes = async (req, res) => {
  const { json, user, id } = req.body;

  try {
    const query = `
      UPDATE timeline 
      SET personnes = $1
      WHERE id = $2
      AND $3 = ANY(users)
      RETURNING *;
    `;

    const result = await pool.query(query, [json, id, user]);
    res.send({ data: result.rows });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données :', error);
    res.status(500).send({ error: 'Erreur serveur' });
  }
};



// Exporter les fonctions
module.exports = {
    postPersonne,
    getPersonnes,
    modifyPersonne,
    deletePersonne,
    getLink,
    postLink,
    deleteLink,
    saveTree,
    savenodes
};
