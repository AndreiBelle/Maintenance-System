const express = require('express');
const router = express.Router();
const { getAllEquipments } = require("../controllers/equipmentController");


router.get('/', getAllEquipments);

module.exports = router;