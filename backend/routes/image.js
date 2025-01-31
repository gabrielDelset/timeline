const express = require('express');
const router = express.Router();
const { insertImage, getImage} = require('../controllers/image'); // Correctement importé


router.put('/putimage', insertImage); 
router.get('/getImage', getImage); 


router.get('/', (req, res) => {
  res.status(200).send({ message: "Bienvenue sur la page image" }); // Placeholder pour la route GET
});

module.exports = router;
