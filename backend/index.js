// backend/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const ConnexionScreen = require('./routes/connexion');
const TimelineScreen = require('./routes/timeline');
const PopupScreen = require('./routes/popup');
const PersonnesTable = require('./routes/personnes');



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/connexion', ConnexionScreen);
app.use('/timeline', TimelineScreen);
app.use('/popup', PopupScreen);
app.use('/personnes', PersonnesTable);


app.get('/', (req, res) => {
  res.send({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
