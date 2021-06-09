const express = require("express");
const router = express.Router();

const MillingController = require('../controllers/milling.controller');
const auth = require('../middleware/check-auth');


router.get("/", auth, MillingController.get);
router.get("/date", auth, MillingController.searchByDate);
router.post("/", auth, MillingController.add);
router.put("/:_id", auth, MillingController.update);
router.delete("/:_id", auth, MillingController.delete);
router.post("/deletemultiple", auth, MillingController.deleteMultiple);


module.exports = router;