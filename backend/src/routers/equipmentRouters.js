const express = require('express');
const router = express.Router();
const { getAllEquipments, createEquipment, deleteEquipment, editEquipment } = require("../controllers/equipmentController");
const { authenticateToken } = require("../middlewares/authenticateToken");

router.get('/', authenticateToken, getAllEquipments);
router.post('/', createEquipment);
router.delete(`/:id`, authenticateToken, deleteEquipment);
router.put('/:id', authenticateToken, editEquipment);

module.exports = router;