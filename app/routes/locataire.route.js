import locataireController from "../controllers/locataire.controller";

var router = require("express").Router();

//Router pour la creation normal
router.post("/createLocataire", locataireController.createLocataire);
//Router pour la creation d'un locataire via gmail
router.post("/createLocataireGmail", locataireController.createLocataireGmail);
//Router pour retourner all locataire
router.get("/getLocataires", locataireController.findAll);
//Get one locataire
router.get("/:id", locataireController.findOne);
//Update locataire
router.put("/:id", locataireController.update);
// Delete a Locataire with id
router.delete("/:id", locataireController.deleteLocataire);
//Block or Unblock Locataire with id
router.put('/block/:id', locataireController.block);


export default router;