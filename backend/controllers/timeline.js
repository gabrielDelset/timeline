const { createHmac } = require('node:crypto');
const { Pool } = require('pg');
const { dbConfig } = require('../bddinfo/info'); // Importation du fichier de configuration

// Configuration de la connexion à PostgreSQL
const pool = new Pool(dbConfig);


//****************************** GET INFOS *********************************************** */

const getinfos = async (req, res) => {    
    const user = req.query.user;
    const table = req.query.table;
  console.log(1);
    try {  
      const query = `
        SELECT 
          id, 
          content, 
          TO_CHAR("start", 'YYYY-MM-DD HH24:MI') AS start, 
          TO_CHAR("end", 'YYYY-MM-DD HH24:MI') AS end, 
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

  const getJsonLinks = async (req, res) => {    
    const user = req.query.user;
    const table = req.query.table;
    try {  
      const query = `
        SELECT 
          id, 
          personnes, 
          liens 
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




//****************************** INSERT INTO TABLE *********************************************** */

const puttimelineArc = async (req, res) => {
    const { name, start, end, email, table, color } = req.body;
    const tabemail = [email];
  
    console.log("gab is here");
    console.log(req.body);
  
    // Forcer start à 00:01
    const formattedStart = new Date(start);
    formattedStart.setHours(0, 1, 0, 0); // 00:01:00.000
  
    // Forcer end à 23:59 si fourni, sinon mettre à null
    let formattedEnd = null;
    if (end) {
      formattedEnd = new Date(end);
      formattedEnd.setHours(23, 59, 0, 0); // 23:59:00.000
    }
  
    try {
      const result = await pool.query(
        `INSERT INTO timeline (content, start, "end", color, "users", timeline_name)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [name, formattedStart, formattedEnd, color, tabemail, table]
      );
  
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



//****************************** UPDATES *********************************************** */




const alterTimeArc = async (req, res) => {
    const id = req.body.id;
    const start = req.body.start;
    const end = req.body.end;
    const email = req.body.email;

    try {
        // Exécuter la requête pour insérer les données
        const result = await pool.query(
            `UPDATE timeline
                SET start = $1,
                    "end" = $2
                WHERE id = $3 AND  $4 = ANY(users);`,
            [ start, end, id,email]
        );

        // Envoyer les données insérées comme réponse
        res.send({ data: result.rows });
    } catch (error) {
        console.error('Erreur lors de l’insertion dans timeline', error);
        res.status(500).send({ error: 'Erreur lors de l’insertion' });
    }
};

const alterNameArc = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    console.log(req.body);


    try {
        // Exécuter la requête pour insérer les données
        const result = await pool.query(
            `UPDATE timeline
                SET content = $1
                WHERE id = $2 AND  $3 = ANY(users);`,
            [ name, id, email]
        );

        // Envoyer les données insérées comme réponse
        res.send({ data: result.rows });
    } catch (error) {
        console.error('Erreur lors de l’insertion dans timeline', error);
        res.status(500).send({ error: 'Erreur lors de l’insertion' });
    }
};

const alterColorArc = async (req, res) => {
    const { id, color, email } = req.body;
    console.log(req.body);

    try {
        const result = await pool.query(
            `UPDATE timeline
             SET color = $1
             WHERE id = $2 AND $3 = ANY(users);`,
            [color, id, email]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({ error: 'Aucune ligne mise à jour. Vérifie l\'id ou l\'email.' });
        }

        res.send({ data: result.rows });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la couleur', error);
        res.status(500).send({ error: 'Erreur lors de la mise à jour' });
    }
};



//****************************** EXPORT *********************************************** */

// Exporter les fonctions
module.exports = {
    getinfos,
    puttimelineArc,
    deleteEvenement,
    alterTimeArc,
    alterColorArc,
    alterNameArc,
    getJsonLinks,
};




/* commande pour calculer la taille cela sera utile pour les utilisateurs 

SELECT 
    SUM(pg_column_size(t)) AS total_size_bytes
FROM timeline t
WHERE image IS NULL;

*/