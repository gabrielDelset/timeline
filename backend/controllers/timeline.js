const { createHmac } = require('node:crypto');
const { Pool } = require('pg');
const { dbConfig } = require('../bddinfo/info'); // Importation du fichier de configuration

// Configuration de la connexion à PostgreSQL
const pool = new Pool(dbConfig);

const getinfos = async (req, res) => {    // on utilise une async car on fait torner le code en arriére plan 
    try {
      // Attente du résultat de la requête
      const result = await pool.query(`SELECT 
                                        id, 
                                        content, 
                                        TO_CHAR("start", 'YYYY-MM-DD') AS start, 
                                        TO_CHAR("end", 'YYYY-MM-DD') AS end
                                    FROM timeline;
                                    `);            // le await permet d'attendre la réponse
      console.log(result.rows); 
      res.send({ data: result.rows });
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      res.status(500).send({ error: 'Erreur serveur' });
    }
  };

  const puttimelineEvenement = async (req, res) => {
    const name = req.body.name;
    const start = req.body.start;


    console.log(name);
    console.log(start);

    try {
        // Exécuter la requête pour insérer les données
        const result = await pool.query(
            `INSERT INTO timeline (content, start) VALUES ($1, $2) RETURNING *;`,
            [name, start]
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

    console.log(name);
    console.log(start);
    console.log(end);

    try {
        // Exécuter la requête pour insérer les données
        const result = await pool.query(
            `INSERT INTO timeline (content, start, "end") VALUES ($1, $2, $3) RETURNING *;`,
            [name, start, end]
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
