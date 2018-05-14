const express = require('express');
const router = express.Router();
const Wiki = require('../models').Wiki;
const wikiController = require("../controllers/wiki.controller");
const userController = require("../controllers/user.controller");

router.get("/wikis", userController.authenticate, wikiController.index);
router.get("/wikis/new", userController.authenticate, wikiController.new);
router.post("/wikis/create", userController.authenticate, wikiController.create);
router.get("/wikis/:id", userController.authenticate, wikiController.show);
router.post("/wikis/:id/update", userController.authenticate, wikiController.update);
router.post("/wikis/:id/destroy", userController.authenticate, wikiController.destroy);
router.get("/wikis/:id/edit", userController.authenticate, wikiController.edit);

module.exports = router;