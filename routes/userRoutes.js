const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// router.post("/checkEmail", (req, res) => {
// 	userController.checkEmailExists(req.body).then(resultFromController => res.send(
// 		resultFromController));
// });

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);


module.exports = router;