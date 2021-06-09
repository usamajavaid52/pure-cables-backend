const express = require("express");
const router = express.Router();

const BaryController = require('../controllers/bary.controller');
const auth = require('../middleware/check-auth');


router.get("/", auth, BaryController.get);
router.get("/date", auth, BaryController.searchByDate);
router.post("/", auth, BaryController.add);
router.put("/:_id", auth, BaryController.update);
router.delete("/:_id", auth, BaryController.delete);
router.post("/deletemultiple", auth, BaryController.deleteMultiple);


module.exports = router;