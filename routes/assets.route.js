const express = require("express");
const router = express.Router();

const AssetsController = require('../controllers/assets.controller');
const auth = require('../middleware/check-auth');


// // router.get("/",UserController.sampleUser);
// router.get("/", UserController.getAll);
router.get("/", auth, AssetsController.getAssets);
router.get("/date", auth, AssetsController.searchByDate);
router.post("/", auth, AssetsController.addAsset);
router.put("/:_id", auth, AssetsController.updateAsset);
router.delete("/:_id", auth, AssetsController.deleteAsset);
router.post("/deletemultiple", auth, AssetsController.deleteMultipleAssets);


module.exports = router;