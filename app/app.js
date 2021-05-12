import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import db from './models/index'
import router from './routes/tutorial.route'
import abonnement from './routes/abonnement.route'
import router from './routes/locataire.route'
// Vehicule Router
import vehiculesRouter from './routes/vehicule.route';

dotenv.config();
const app = express();

// Cross Origin Resources Sharing, Initially all whitelisted
app.use(cors());

// Parse data in JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db.sequelize.sync();


app.use('/api/tutorials', router);
app.use('/api/abonnement', abonnement);
app.use('/api/locataire', router);

// Vehicule Route
app.use('/api/vehicules', vehiculesRouter);

// Vehicule Route Of A Given Agent
app.use('/api/vehicules/agaents/:id', vehiculesRouter);


//Home
app.use((req, res) => {

    res.send('<h1>Welcome to AutolibDZ REST API</h1>');
});

module.exports = app;