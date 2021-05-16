const db = require("../models");
const bcrypt = require("bcryptjs");
const Locataire = db.locataire;

// La creation d'un locataire (lors de l'inscription)
const createLocataire = async (req, res) => {
    // Validate request
    if (!req.body.nom || !req.body.prenom || !req.body.email || !req.body.motdepasse) {
        res.status(400).send({
            success: false,
            message: "Content can not be empty!"
        });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const mdp = await bcrypt.hash(req.body.motdepasse, salt);

    const locataire = {

        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        motDePasse: mdp

    };


    // Enregistrer le locataire dans la BDD
    try {
        const data = await Locataire.create(locataire)
        res.send({ success: true });

    } catch (err) {
        res.status(500).send({
            error: err.message || "Some error occurred while creating the locataire."
        });
    }

};

//Retourner tout les locataires
const findAll = (req, res) => {
    var condition = 1 === 1

    Locataire.findAll({ where: condition })
        .then(data => {
            if (data.length == 0) {
                return res.status(400).send({
                    success: false,
                    message: "No locataires were found"
                });
            }
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving locataire."
            });
        });
};

const findOne = async (req, res) => {

    Locataire.findOne({ where: { idLocataire: req.params.id } })
        .then(data => {
            if (!data) {
                return res.status(400).send({
                    message: "Locataire not found"
                });
            }
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while retrieving locataire."
            });
        });
};
const updateLocataire = async (req, res) => {
    if (req.body.motdepasse) {
        const salt = await bcrypt.genSalt(10);
        req.body.motDePasse = await bcrypt.hash(req.body.motdepasse, salt);
    }

    Locataire.update(req.body, { where: { idLocataire: req.params.id } })
        .then(result => {
            res.status(200).send({
                success: true,
                message: `Locataire  updated successfully`
            })
        }).catch(err => {
            res.status(400).send({
                success: false,
                message: err.message
            })
        })
}
const deleteLocataire = async (req, res) => {
    Locataire.destroy({ where: { idLocataire: req.params.id } }).then(result => {
        res.status(200).send({
            success: true,
            message: `Locataire deleted successfully`
        })
    }).catch(err => {
        res.status(400).send({
            success: false,
            message: err.message
        })
    })
}
export default {
    createLocataire,
    findAll,
    findOne,
    updateLocataire,
    deleteLocataire
}