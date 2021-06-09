const express = require("express");
const router = express.Router();

const FinanceController = require('../controllers/finance.controller');
const auth = require('../middleware/check-auth');


router.get("/", auth, FinanceController.get);
router.get("/stat", auth, FinanceController.getStat);
router.get("/date", auth, FinanceController.searchByDate);
router.post("/", auth, FinanceController.add);
router.put("/:_id", auth, FinanceController.update);
router.delete("/:_id", auth, FinanceController.delete);
router.post("/deletemultiple", auth, FinanceController.deleteMultiple);


module.exports = router;