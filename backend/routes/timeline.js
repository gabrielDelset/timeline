const express = require('express');
const router = express.Router();
const { getinfos , puttimelineEvenement , puttimelineArc } = require('../controllers/timeline'); // Correctement importé

// Définir les routes
router.get('/getinfos', getinfos); // Route PUT associée à la fonction postidentifiant

router.put('/postarc', puttimelineArc); 
router.put('/postevenement', puttimelineEvenement); 

router.get('/', (req, res) => {
  res.status(200).send({ message: "Bienvenue sur la page timeline" }); // Placeholder pour la route GET
});

module.exports = router;
