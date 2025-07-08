const express = require("express");
const router = express.Router();
const vaultController = require("../controllers/vaultController");
const authMiddleware = require("../middleware/authMiddleware");

// All vault routes require authentication
router.use(authMiddleware);

router.post("/add", vaultController.addCredential);
router.get("/list", vaultController.listCredentials);
router.put("/edit/:id", vaultController.editCredential);
router.delete("/delete/:id", vaultController.deleteCredential);
router.get("/export/csv", vaultController.exportCSV);
router.get("/export/pdf", vaultController.exportPDF);

module.exports = router;
