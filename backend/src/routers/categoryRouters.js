const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory, deleteCategory, editCategory, getCategoryById } = require("../controllers/categoryController");
const { authenticateToken } = require("../middlewares/authenticateToken");

router.get('/', authenticateToken, getAllCategories);
router.post('/', authenticateToken, createCategory);
router.delete('/:id', authenticateToken, deleteCategory);
router.put('/:id', authenticateToken, editCategory);
router.get('/:id', authenticateToken, getCategoryById);

module.exports = router;
