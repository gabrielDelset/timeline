const express = require('express');
const router = express.Router();
const { getinfos , puttimelineEvenement , puttimelineArc , deleteEvenement } = require('../controllers/timeline'); // Correctement importé

// Définir les routes
router.put('/getinfos', getinfos); // Route PUT associée à la fonction postidentifiant

router.put('/postarc', puttimelineArc); 
router.put('/postevenement', puttimelineEvenement); 
router.put('/deleteEvent', deleteEvenement); 

router.get('/', (req, res) => {
  res.status(200).send({ message: "Bienvenue sur la page timeline" }); // Placeholder pour la route GET
});

module.exports = router;
