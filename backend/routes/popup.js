const express = require('express');
const router = express.Router();
const { insertJson, getJson} = require('../controllers/popup'); // Correctement importé


router.put('/insertJson', insertJson); 
router.get('/getJson', getJson);
//router.put('/postevenement', puttimelineEvenement); 
//router.put('/deleteEvent', deleteEvenement); 

router.get('/', (req, res) => {
  res.status(200).send({ message: "Bienvenue sur la page timeline" }); // Placeholder pour la route GET
});

module.exports = router;
