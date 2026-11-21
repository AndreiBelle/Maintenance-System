const express = require('express');
const router = express.Router();
const { uploadEquipmentPhoto } = require("../middlewares/configMulter.js");
const { getAllEquipments, createEquipment, deleteEquipment, editEquipment, getEquipmentById } = require("../controllers/equipmentController");
const { authenticateToken } = require("../middlewares/authenticateToken");

router.get('/', authenticateToken, getAllEquipments);
router.post('/', authenticateToken, uploadEquipmentPhoto.single("photo"), createEquipment);
router.delete(`/:id`, authenticateToken, deleteEquipment);
router.put('/:id', authenticateToken, editEquipment);
router.get('/:id', authenticateToken, getEquipmentById)

module.exports = router;