const express = require('express');
const router = express.Router();
const { postPersonne, getPersonnes} = require('../controllers/personnes'); // Correctement importé
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


router.post('/postPersonne', upload.single("photo"), postPersonne);
router.put("/Getpersonnes", getPersonnes);


router.get('/', (req, res) => {
  res.status(200).send({ message: "Bienvenue sur la page personnes" }); // Placeholder pour la route GET
});

module.exports = router;
