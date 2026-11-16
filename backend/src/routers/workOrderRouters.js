const express = require('express');
const router = express.Router();
const { getAllWorkOrders, createWorkOrder, editWorkOrder, updateWorkOrderStatus, getWorkOrderById } = require("../controllers/workOrderController");
const { authenticateToken } = require("../middlewares/authenticateToken");

router.get('/', authenticateToken, getAllWorkOrders);
router.post('/', authenticateToken, createWorkOrder);
router.put('/:id', authenticateToken, editWorkOrder);
router.patch('/:id/status', authenticateToken, updateWorkOrderStatus);
router.get('/:id', authenticateToken, getWorkOrderById);

module.exports = router;
