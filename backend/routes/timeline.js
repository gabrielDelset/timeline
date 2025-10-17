const express = require('express');
const router = express.Router();
const { getinfos  , puttimelineArc , deleteEvenement , alterTimeArc , alterNameArc , alterColorArc , getJsonLinks , getList} = require('../controllers/timeline'); // Correctement importé

// Définir les routes
// Route GET au lieu de PUT
router.get('/getinfos', getinfos);
router.get('/getJsonLinks', getJsonLinks);
router.get('/getList', getList);
router.put('/postarc', puttimelineArc); 
//router.put('/postevenement', puttimelineEvenement); 
router.put('/deleteEvent', deleteEvenement); 
router.put('/modifTime', alterTimeArc); 
router.put('/modifName', alterNameArc); 
router.put('/modifColor', alterColorArc); 

router.get('/', (req, res) => {
  res.status(200).send({ message: "Bienvenue sur la page timeline" }); // Placeholder pour la route GET
});

module.exports = router;
