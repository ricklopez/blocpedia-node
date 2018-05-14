const express = require('express');
const router = express.Router();
const collaboratorController = require("../controllers/collaborator.controller");
const userController = require("../controllers/user.controller");

router.post("/wikis/:id/collaborators", userController.authenticate, collaboratorController.collaborators);
router.post("/wikis/:id/collaborators/:collabId/destroy", userController.authenticate, collaboratorController.destroy);

module.exports = router;