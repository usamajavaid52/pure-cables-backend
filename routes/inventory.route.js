const express = require("express");
const router = express.Router();

const InventoryController = require('../controllers/inventory.controller');
const auth = require('../middleware/check-auth');


router.get("/", auth, InventoryController.getInventories);
router.post("/", auth, InventoryController.addInventory);
router.put("/:_id", auth, InventoryController.updateInventory);
router.delete("/:_id", auth, InventoryController.deleteInventory);
router.post("/deletemultiple", auth, InventoryController.deleteMultipleInventories);


module.exports = router;