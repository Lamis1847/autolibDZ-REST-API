import { where } from 'sequelize';
import vehiculeModel from '../models/vehicule.model';

const db = require('../models');
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
const Trajet = db.trajet;
const Vehicule = db.vehicules;
const Reservation = db.reservation;
const Borne = db.borne;


var sequelize = require("sequelize");

const createTrajet = async(req, res) => {
    /*const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]



    if (token == null) {

        res.status(403).send({
            message: "Access Forbidden,invalide token",
        });
        return;
    }

    if (!req.body.dateDebut || !req.body.dateFin || !req.body.tempsEstime || !req.body.kmParcourue || !req.body.prixAPayer || !req.body.idReservation) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const trajet = {
        idTrajet: req.body.idTrajet,
        dateDebut: req.body.dateDebut,
        dateFin: req.body.dateFin,
        tempsEstime: req.body.tempsEstime,
        kmParcourue: req.body.kmParcourue,
        prixAPayer: req.body.prixAPayer,
        idReservation: req.body.idReservation,
    };


    try {

        const user = jwt.verify(token, process.env.JWT_SECRET);

        if (user != undefined) {

            const role = user.role



            if (role != "administrateur") {

                res.status(403).send({
                    message: "Access Forbidden,you can't do this operation",
                });

                return;
            }
        }

    } catch (err) {

        res.status(403).send({
            message: "Access Forbidden,invalide token",
        });

        return;

    }
*/




    if (!req.body.dateDebut || !req.body.tempsEstime || !req.body.idReservation) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const trajet = {


        dateDebut: req.body.dateDebut,
        dateFin: req.body.dateFin,
        tempsEstime: req.body.tempsEstime,
        kmParcourue: req.body.kmParcourue,
        prixAPayer: req.body.prixAPayer,
        idReservation: req.body.idReservation,
    };

    try {

        let data;
        data = await Trajet.create(trajet)
        res.send(data)

    } catch (err) {
        res.status(500).send({
            error: err.message || "Some error occurred while creating the Trajet."
        });
    }

};

const createDebutTrajet = async(req, res) => {

    if (!req.body.dateDebut || !req.body.reservation) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const trajet = {
        dateDebut: req.body.dateDebut,
        dateFin: null,
        tempsEstime: req.body.reservation.tempsEstime,
        kmParcourue: req.body.reservation.kmParcourue,
        prixAPayer: req.body.reservation.prixEstime,
        idReservation: req.body.reservation.idReservation,
    };
    await Trajet.create(trajet)
        .then(data => {
            //Création reussite
            res.status(200).send({
                idTrajet: data.idTrajet
            });
        })
        .catch(err => {
            //Création non reussite
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Trajet"
            });
        });
};

const updateFinTrajet = async(req, res) => {

    if (!req.body.dateFin || !req.body.idTrajet || !req.body.prixEstime) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    try {

        const trajet = await Trajet.findOne({
            where: {
                idTrajet: req.body.idTrajet
            },
        });

        const resv = await Reservation.findOne({
            where: {
                idReservation: trajet.idReservation
            },
        });

        await Vehicule.update({
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            idBorne: resv.idBorneDestination

        }, {
            where: {
                numChassis: req.body.idVehicule
            }
        })

        await Borne.decrement({
            nbPlaces: 1

        }, {
            where: {
                idBorne: resv.idBorneDestination
            }
        })

        const debut = Date.parse(req.body.dateDebut);
        const fin = Date.parse(req.body.dateFin);
        var tmp = fin - debut;




        tmp = Math.floor(tmp / 1000); // Nombre de secondes entre les 2 dates
        var sec = tmp % 60; // Extraction du nombre de secondes
        tmp = Math.floor((tmp - sec) / 60); // Nombre de minutes (partie entière)
        var min = tmp % 60; // Extraction du nombre de minutes
        var plusPrix
        if (min > req.body.tempsEstime) {
            plusPrix = (min - req.body.tempsEstime)

        } else {
            plusPrix = 0
        }

        await Trajet.update({
            dateFin: req.body.dateFin,
            tempsEstime: min,
            prixAPayer: (req.body.prixEstime + (plusPrix * 80 / 60))
        }, {
            where: {
                idTrajet: req.body.idTrajet
            }
        })
        res.send({ message: "Trajet updated" })

    } catch (err) {
        res.status(500).send({
            error: err.message || "Some error occurred while updating the Trajet."
        });
    }

};

const getTrajetByResrvation = async(req, res) => {
    try {
        const trajet = await Trajet.findOne({
            where: {
                idReservation: req.params.id,
            },
        });
        res.status(200).send(trajet);
    } catch (err) {
        res.status(500).send({
            error: err.message ||
                'Some error occured while retreiving the trajet'

        });
    }
}



const listAllTrajets = (req, res) => {
    var condition = 1 === 1

    Trajet.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving trajet."
            });
        });
};

const findTrajetById = async(req, res) => {
    try {
        const trajet = await Trajet.findAll({
            where: {
                idTrajet: +req.params.id,
            },
        });
        res.status(200).send(trajet);
    } catch (err) {
        res.status(500).send({
            error: err.message ||
                'Some error occured while retreiving the trajet' +
                req.params.id,
        });
    }
};



const updateTrajetById = async(req, res) => {
    const id = req.params.id;

    Trajet.update(req.body, {
            where: { idTrajet: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Trajet was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Trajet with id=${id}. Maybe Trajet was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Trajet with id=" + id
            });
        });
};

const deleteTrajetById = async(req, res) => {
    const id = req.params.id;

    console.log(id);

    Trajet.destroy({
            where: { idTrajet: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Trajet was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Trajet with id=${id}. Maybe Trajet was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};
const countTrajetsByMonth = async(req, res) => {

    // verify access
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        res.status(403).send({
            message: "Access Forbidden,invalide token",
        });
        return;
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (user != undefined) {
            const role = user.role
                // Only admin can create Vehicule

            if (role != "administrateur") {
                res.status(403).send({
                    message: "Access Forbidden,you can't do this operation",
                });

                return;
            }
        }

    } catch (err) {
        res.status(403).send({
            message: "Access Forbidden,invalide token",
        });

        return;

    }

    // Validate request
    if (!req.params.year) {
        res.status(400).send({
            message: "params 'year' can not be empty!",
        });
        return;
    }

    try {
        let year = req.params.year;
        const trajets_par_mois = await Trajet.findAll({
            attributes: [
                [sequelize.fn('date_part', 'month', sequelize.col('dateDebut')), 'month'],
                [sequelize.fn('COUNT', sequelize.col('idTrajet')), 'countTrajets'],
            ],
            where: sequelize.where(sequelize.fn('date_part', 'year', sequelize.col('dateDebut')), year),
            group: [sequelize.fn('date_part', 'month', sequelize.col('dateDebut'))],
            order: [sequelize.fn('date_part', 'month', sequelize.col('dateDebut'))],
        });
        if (trajets_par_mois.length != 0) {
            res.send(trajets_par_mois);
        } else {
            res.status(404).send({
                error: 'not_found',
                message: 'No content',
                status: 404,
            });
        }
    } catch (err) {
        res.status(500).send({
            error: err.message || 'Some error occured while counting trajets'
        });
    }
};

const getYears = async(req, res) => {

    // verify access
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        res.status(403).send({
            message: "Access Forbidden,invalide token",
        });
        return;
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (user != undefined) {
            const role = user.role
                // Only admin can create Vehicule

            if (role != "administrateur") {
                res.status(403).send({
                    message: "Access Forbidden,you can't do this operation",
                });

                return;
            }
        }

    } catch (err) {
        res.status(403).send({
            message: "Access Forbidden,invalide token",
        });

        return;

    }

    //const maxYearsToGet=5
    try {
        const years = await Trajet.findAll({
            attributes: [
                [sequelize.fn('date_part', 'year', sequelize.col('dateDebut')), 'year'],
            ],
            //order: [[sequelize.literal('"dateDebut"'), 'DESC']],
            group: [sequelize.fn('date_part', 'year', sequelize.col('dateDebut'))],
            order: [sequelize.fn('date_part', 'year', sequelize.col('dateDebut'))],
            //limit :maxYearsToGet
        });
        if (years.length != 0) {
            res.send(years);
        } else {
            res.status(404).send({
                error: 'not_found',
                message: 'No content',
                status: 404,
            });
        }
    } catch (err) {
        res.status(500).send({
            error: err.message || 'Some error occured while getting years'
        });
    }
};

export default {
    getYears,
    createTrajet,
    listAllTrajets,
    findTrajetById,
    deleteTrajetById,
    updateTrajetById,
    countTrajetsByMonth,
    updateFinTrajet,
    createDebutTrajet,
    getTrajetByResrvation
}