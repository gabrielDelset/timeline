const { createHmac } = require('node:crypto');
const { Pool } = require('pg');
const { dbConfig } = require('../bddinfo/info'); // Importation du fichier de configuration

// Configuration de la connexion à PostgreSQL
const pool = new Pool(dbConfig);



const postidentifiant = async (req, res) => {
    const id = req.body.id;
    const mdp = req.body.mdp;

    if (!id || !mdp) {
        return res.status(400).json({ message: "L'identifiant et le mot de passe sont requis." });
    }

    try {
        // Calcul du hash du mot de passe
        const hash = createHmac('sha256', mdp)
            .update('I love cupcakes') // Salt fixe
            .digest('hex');

        console.log('ID:', id);
        console.log('Hash du mot de passe:', hash);

        // Vérification de l'identifiant et du mot de passe dans la base de données
        const query = 'SELECT * FROM identifiant WHERE identifiant = $1 AND mot_de_passe = $2';
        const result = await pool.query(query, [id, hash]);

        if (result.rowCount > 0) {
            console.log("connexion autorisé");
            return res.status(200).json({ code: 200, message: "Connexion réussie." });
        } else {
            return res.status(401).json({ message: "Identifiant ou mot de passe incorrect." });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification des identifiants :', error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

// Exporter les fonctions
module.exports = {
    postidentifiant,
};
