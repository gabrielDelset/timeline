const { createHmac } = require('node:crypto');
const { Pool } = require('pg');
const { dbConfig } = require('../bddinfo/info'); // Importation du fichier de configuration

const pool = new Pool(dbConfig);

// Configuration de la connexion à PostgreSQL
const insertJson = async (req, res) => {
    const table = req.body.table;
    const column = req.body.column;
    const id = req.body.id;
    const json = req.body.json; 

    console.log(table);
    console.log(column);
    console.log(id);
    console.log(json);

    // Valider que les noms de table et de colonne sont sûrs
    const tablePattern = /^timeline/; // Regex pour vérifier les tables commençant par "timeline_"
    const allowedColumns = ['description', 'relation','liens']; // Colonne(s) autorisée(s)

    if (!tablePattern.test(table)) {
        return res.status(400).send({ error: 'Nom de table non autorisé' });
    }

    if (!allowedColumns.includes(column)) {
        return res.status(400).send({ error: 'Nom de colonne non autorisé' });
    }

    try {
        // Construire la requête avec des noms d'entités dynamiques
        const query = `
            UPDATE ${table}  
            SET ${column} = $1
            WHERE id = $2;
        `;

        // Exécuter la requête avec les paramètres sécurisés
        const result = await pool.query(query, [json, id]);

        return res.status(200).send({ message: 'Mise à jour réussie' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour', error);
        res.status(500).send({ error: 'Erreur lors de la mise à jour' });
    }
};



const getJson = async (req, res) => {
    try {
      const table = req.query.table;
      const column = req.query.column;
      const id = req.query.id;
  
      const query = `SELECT ${column} FROM ${table} WHERE id = $1;`;
      const result = await pool.query(query, [id]);
  
      res.send(result.rows[0]?.[column]);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      res.status(500).send({ error: 'Erreur serveur' });
    }
  };
  






// Exporter les fonctions
module.exports = {
    insertJson,
    getJson,
};
