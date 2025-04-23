const express = require('express');
const router = express.Router();
const { postPersonne, getPersonnes, modifyPersonne, deletePersonne, getLink, postLink } = require('../controllers/personnes');

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


router.post('/postPersonne', upload.single("photo"), postPersonne);
router.post('/modifyPersonne', upload.single("photo"), modifyPersonne);
router.post('/deletePersonne', deletePersonne);
router.put("/Getpersonnes", getPersonnes);
router.put('/getLink', getLink); 
router.put('/postLink', postLink); 


router.get('/', (req, res) => {
  res.status(200).send({ message: "Bienvenue sur la page personnes" }); // Placeholder pour la route GET
});

module.exports = router;
