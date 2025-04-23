const { createHmac } = require('node:crypto');
const { Pool } = require('pg');
const { dbConfig } = require('../bddinfo/info'); // Importation du fichier de configuration

// Configuration de la connexion à PostgreSQL
const pool = new Pool(dbConfig);

const getinfos = async (req, res) => {    
    const user = req.body.user;
    const table = req.body.table;

    try {  
        const query = `
            SELECT 
                id, 
                content, 
                TO_CHAR("start", 'YYYY-MM-DD') AS start, 
                TO_CHAR("end", 'YYYY-MM-DD') AS end, 
                CONCAT('background-color: ', color) AS style
            FROM timeline 
            WHERE $1 = ANY("users") 
            AND timeline_name = $2;
        `;

        const result = await pool.query(query, [user, table]);

        res.send({ data: result.rows });
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        res.status(500).send({ error: 'Erreur serveur' });
    }
};



  const puttimelineEvenement = async (req, res) => {     //! bon bah apparament j'ai jamais eu besoin de l'utiliser celle la a voir ce que j'en fait 
    const name = req.body.name;
    const start = req.body.start;
    const email = req.body.email;
    const table = req.body.table;

    try {
        // Exécuter la requête pour insérer les données
        const result = await pool.query(
            `INSERT INTO timeline (content, start, users, timeline_name) VALUES ($1, $2, $3, $4) RETURNING *;`,
            [name, start, email,table ]
        );

        // Envoyer les données insérées comme réponse
        res.send({ data: result.rows });
    } catch (error) {
        console.error('Erreur lors de l’insertion dans timeline', error);
        res.status(500).send({ error: 'Erreur lors de l’insertion' });
    }
  };

  const puttimelineArc = async (req, res) => {
    const name = req.body.name;
    const start = req.body.start;
    const end = req.body.end;
    const email = req.body.email;
    const tabemail = [email]
    const table = req.body.table;
    const color = req.body.color;
    try {
        // Exécuter la requête pour insérer les données
        const result = await pool.query(
            `INSERT INTO timeline (content, start, "end" ,color, "users", timeline_name) VALUES ($1, $2, $3 ,$4 , $5, $6) RETURNING *;`,
            [name, start, end,color, tabemail,table  ]
        );

        // Envoyer les données insérées comme réponse
        res.send({ data: result.rows });
    } catch (error) {
        console.error('Erreur lors de l’insertion dans timeline', error);
        res.status(500).send({ error: 'Erreur lors de l’insertion' });
    }
};


const deleteEvenement = async (req, res) => {
    const id = req.body.id;
    console.log(req.body);
    console.log(id);
    try {
        // Exécuter la requête pour insérer les données
        const result = await pool.query(
            `DELETE FROM timeline WHERE id = $1;`,
            [id]
        );
        return res.status(200).send({ message: 'Événement supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la supression dans timeline', error);
        res.status(500).send({ error: 'Erreur lors de la supression' });
    }
};



// Exporter les fonctions
module.exports = {
    getinfos,
    puttimelineArc,
    puttimelineEvenement,
    deleteEvenement,
};




/* commande pour calculer la taille cela sera utile pour les utilisateurs 

SELECT 
    SUM(pg_column_size(t)) AS total_size_bytes
FROM timeline t
WHERE image IS NULL;

*/