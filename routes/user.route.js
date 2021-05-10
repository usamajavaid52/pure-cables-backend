const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user.controller');
const auth = require('../middleware/check-auth');


// // router.get("/",UserController.sampleUser);
// router.get("/", UserController.getAll);
router.post("/register", auth, UserController.registerUser);
router.post("/login", UserController.signIn);
router.get("/", auth, UserController.getUsers);
// // router.post("/",UserController.addUser);
router.put("/:_id", auth, UserController.updateUser);
router.delete("/:_id", UserController.deleteUser);


module.exports = router;