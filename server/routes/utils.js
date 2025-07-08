const express = require("express");
const router = express.Router();
const utilsController = require("../controllers/utilsController");

router.post("/generate-password", utilsController.generatePassword);

module.exports = router;
