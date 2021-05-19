const db = require('../models');
const Vehicule = db.vehicules;

const cloudinary = require('cloudinary').v2
require('dotenv').config()

// cloudinary configuration
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET
  });

// Create and Save a new Vehicule
const createVehicule = async (req, res) => {
	// Validate request
	if (!req.body.numChassis) {
		res.status(400).send({
			message: 'Content can not be empty!',
		});
		return;
	}
console.log("Hiii");
	// Create a Vehicule
	const vehicule = {
		numChassis: req.body.numChassis,
		numImmatriculation: req.body.numImmatriculation,
		modele: req.body.modele,
		marque: req.body.marque,
		couleur: req.body.couleur,
		etat: req.body.etat,
		tempsDeRefroidissement: req.body.tempsDeRefroidissement,
		pressionHuileMoteur: req.body.pressionHuileMoteur,
		chargeBatterie: req.body.chargeBatterie,
		anomalieCircuit: req.body.anomalieCircuit,
		pressionPneus: req.body.pressionPneus,
		niveauMinimumHuile: req.body.niveauMinimumHuile,
		regulateurVitesse: req.body.regulateurVitesse,
		limiteurVitesse: req.body.limiteurVitesse,
		cloudinary_id: "" , 
		secure_url: ""
	};

	// upload image here to cloudinary here
	if (req.body.image) {
		const image = req.body.image;
		console.log("I'm innn"); 
		cloudinary.uploader.upload(req.body.image)
		.then((result) => {
		response.status(200).send({
			message: "success",
			result,
		});
		data.cloudinary_id=response.public_id; 
		data.secure_url= response.secure_url;

		}).catch((error) => {
		response.status(500).send({
			message: "failure",
			error,
		});
		});
	}
	// Ajout d'un véhicule à la base de données
	try {
		console.log("HEEEEY ADD");
		data = await Vehicule.create(vehicule).then((data) => {
			res.send(data);
		});
	} catch (err) {
		res.status(500).send({
			error: err.message || 'Some error occurred while creating the Vehicule.',
		});
	}

};

// Suppresion d'un véhicule
const deleteVehicule = async (req, res) => {
	const id = req.params.id;

	console.log(id);

	Vehicule.destroy({
		where: { numChassis: id },
	})
		.then((num) => {
			if (num == 1) {
				res.send({
					message: 'Vehicule was deleted successfully!',
				});
			} else {
				res.send({
					message: `Cannot delete Vehicule with id=${id}. Maybe Vehicule was not found!`,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Could not delete Vehicule with id=' + id,
			});
		});
};

// Mise à jour d'un véhicule
const updateVehicule = async (req, res) => {
	const id = req.params.id;

	Vehicule.update(req.body, {
		where: { numChassis: id },
	})
		.then((num) => {
			if (num == 1) {
				res.send({
					message: 'Vehicule was updated successfully.',
				});
			} else {
				res.send({
					message: `Cannot update Vehicule with id=${id}. Maybe Vehicule was not found or req.body is empty!`,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error updating Vehicule with id=' + id,
			});
		});
};

// Afficher les détails de tous les véhicules Get all from database

const getAllVehicule = async (req, res) => {
	Vehicule.findAll()
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error retrieving Vehicule with id=' + id,
			});
		});
};

const getVehiculeDetails = async (req, res, next) => {
	try {
		if (parseInt(req.params.numChassis, 10)) {
			const vehicule = await Vehicule.findAll({
				where: {
					numChassis: +req.params.numChassis,
				},
			});
			if (vehicule.length === 0) {
				// No content with that numChassis
				res.status(404).send({
					error: 'not_found',
					message: `No vehicule with such numero chassis: ${+req.params
						.numChassis}`,
					status: 404,
				});
			} else {
				res.status(200).send(vehicule[0]);
			}
		} else next();
	} catch (err) {
		res.status(500).send({
			error:
				err.message || 'Some error occured while retreiving vehicule,s details',
		});
	}
};

const selectVehicuesOfAGivenAgent = async (req, res) => {
	try {
		const vehicules = await Vehicule.findAll({
			where: {
				idAgentMaintenance: +req.params.id,
			},
		});
		if (vehicules.length === 0) {
			// No content with that id
			res.status(404).send({
				error: 'not_found',
				message: `No content with such id: ${+req.params.id}`,
				status: 404,
			});
		} else {
			res.status(200).send(vehicules);
		}
		res.status(200).send(vehicules);
	} catch (err) {
		res.status(500).send({
			error:
				err.message ||
				'Some error occured while retreiving vehicules agent id: ' +
					req.params.id,
		});
	}
};

const setEtatVehicule = async (req, res) => {
	try {
		let state = req.body.etat;
		if (state) {
			state = state.toLowerCase();
			if (state === 'en service' || state === 'hors service') {
				const response = await Vehicule.update(
					{ etat: state },
					{
						returning: true,
						where: {
							numChassis: +req.params.numChassis,
						},
					}
				);

				const UpdatedRows = response[0];
				const UpdatedVehicule = response[1];

				if (UpdatedVehicule.length === 0) {
					// No content with that numChassis
					res.status(404).send({
						error: 'not_found',
						message: `No vehicule with such numero chassis: ${+req.params
							.numChassis}`,
						status: 404,
					});
				} else {
					res.status(200).send({ UpdatedRows, UpdatedVehicule });
				}
			} else {
				res.status(400).send({
					message:
						"Attribute 'etat' must be either 'en service' or 'hors service'",
				});
				return;
			}
		} else {
			res.status(400).send({
				message: "params 'etat' can not be empty!",
			});
			return;
		}
	} catch (err) {
		res.status(500).send({
			error:
				err.message ||
				'Some error occured while attemping to set state of vehicule id ' +
					req.params.numChassis,
		});
	}
};

const getVehiculesEnService = async (req, res) => {
	try {
		const vehiculesEnService = await Vehicule.findAll({
			where: {
				etat: 'en service',
			},
		});
		if (vehiculesEnService.length === 0) {
			// No content
			res.status(404).send({
				error: 'not_found',
				message: `No vehicules are 'en service'`,
				status: 404,
			});
		} else {
			res.status(200).send(vehiculesEnService);
		}
	} catch (err) {
		res.status(500).send({
			error:
				err.message ||
				"Some error occured while retreiving vehicules 'en service'",
		});
	}
};

const getVehiculesHorsService = async (req, res) => {
	try {
		const vehiculesHorsService = await Vehicule.findAll({
			where: {
				etat: 'hors service',
			},
		});
		if (vehiculesHorsService.length === 0) {
			// No content
			res.status(404).send({
				error: 'not_found',
				message: `No vehicules are 'hors service'`,
				status: 404,
			});
		} else {
			res.status(200).send(vehiculesHorsService);
		}
	} catch (err) {
		res.status(500).send({
			error:
				err.message ||
				"Some error occured while retreiving vehicules 'hors service'",
		});
	}
};

export default {
	setEtatVehicule,
	getVehiculeDetails,
	selectVehicuesOfAGivenAgent,
	getVehiculesEnService,
	getVehiculesHorsService,

	createVehicule,
	deleteVehicule,
	updateVehicule,
	// Ca existe déja.. C'est : getVehiculeDetails
	// getOneVehicule,
	getAllVehicule,
	//getVehiculeByCondition
};
