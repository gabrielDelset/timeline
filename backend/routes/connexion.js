const express = require('express');
const router = express.Router();
const { postidentifiant } = require('../controllers/connexion'); // Correctement importé

// Définir les routes
router.put('/sendid', postidentifiant); // Route PUT associée à la fonction postidentifiant

router.get('/', (req, res) => {
  res.status(200).send({ message: "Bienvenue sur la page connexion" }); // Placeholder pour la route GET
});

module.exports = router;
