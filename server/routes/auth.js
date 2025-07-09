const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-2fa", authController.verify2FA);
router.post("/request-reset", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
