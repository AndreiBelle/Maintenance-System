const express = require('express');
const router = express.Router();
const { getAllEquipments, createEquipment } = require("../controllers/equipmentController");


router.get('/', getAllEquipments);
router.post('/cadastro', createEquipment)

module.exports = router;