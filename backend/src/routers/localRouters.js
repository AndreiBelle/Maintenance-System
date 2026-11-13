const express = require('express');
const router = express.Router();
const { getAllLocals, createLocal, deleteLocal, editLocal, getLocalById } = require("../controllers/localController");
const { authenticateToken } = require("../middlewares/authenticateToken");

router.get('/', authenticateToken, getAllLocals);
router.post('/', authenticateToken ,createLocal);
router.delete('/:id', authenticateToken, deleteLocal);
router.put('/:id', authenticateToken, editLocal);
router.get('/:id', authenticateToken, getLocalById);

module.exports = router;
