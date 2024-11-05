const express = require("express");
const { loginController, registerController } = require("../controllers/userController");

// Router object
const router = express.Router();

// Routes
// POST || LOGIN 
router.post('/login', loginController);

// POST || REGISTER
router.post('/register', registerController);

module.exports = router;
