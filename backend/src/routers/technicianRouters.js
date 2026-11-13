const express = require('express');
const router = express.Router();
const {
    getAllTechnicians,
    createTechnician,
    deleteTechnician,
    editTechnician,
    getTechnicianById
} = require("../controllers/technicianController");
const { authenticateToken } = require("../middlewares/authenticateToken");

router.get('/', authenticateToken, getAllTechnicians);
router.post('/', authenticateToken, createTechnician);
router.delete('/:id', authenticateToken, deleteTechnician);
router.put('/:id', authenticateToken, editTechnician);
router.get('/:id', authenticateToken, getTechnicianById);

module.exports = router;
