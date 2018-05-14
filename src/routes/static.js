const express = require('express');
const router = express.Router();
const staticController = require("../controllers/static.controller");

router.get("/", staticController.index);

module.exports = router;