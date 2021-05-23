const express = require("express");
const router = express.Router();

const LedgerController = require('../controllers/ledger.controller');
const auth = require('../middleware/check-auth');


// // router.get("/",UserController.sampleUser);
// router.get("/", UserController.getAll);
router.get("/", auth, LedgerController.getAssets);
router.get("/date", auth, LedgerController.searchByDate);
router.post("/", auth, LedgerController.addAsset);
router.put("/:_id", auth, LedgerController.updateAsset);
router.delete("/:_id", auth, LedgerController.deleteAsset);
router.post("/deletemultiple", auth, LedgerController.deleteMultipleAssets);


module.exports = router;