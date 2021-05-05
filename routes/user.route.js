const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user.controller');


// // router.get("/",UserController.sampleUser);
// router.get("/", UserController.getAll);
router.post("/register", UserController.registerUser);
router.post("/login", UserController.signIn);
// router.get("/:_id", UserController.getSingleUser);
// // router.post("/",UserController.addUser);
// router.put("/:_id", UserController.updateUser);
// router.delete("/:_id", UserController.deleteUser);


module.exports = router;