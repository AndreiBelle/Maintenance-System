const categoryService = require('../services/categoryService');

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        return res.json(categories);
    } catch (err) {
        console.error("Erro ao buscar categorias: ", err);
        return res.status(500).json({ message: "Erro ao buscar categorias." });
    }
};

const createCategory = async (req, res) => {
    try {
        await categoryService.createCategory(req.body);
        return res.status(201).json({ message: "Categoria cadastrada com sucesso!" });
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error("Erro ao cadastrar categoria: ", err);
        return res.status(500).json({ message: "Erro ao cadastrar categoria." });
    }
};

const editCategory = async (req, res) => {
    try {
        await categoryService.updateCategory(req.params.id, req.body);
        return res.status(204).send();
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error("Erro ao editar categoria: ", err);
        return res.status(400).json({ message: "Erro ao editar categoria." });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        return res.status(204).send();
    } catch (err) {
        console.error("Erro ao excluir categoria: ", err);
        return res.status(500).json({ message: "Não foi possível excluir a categoria." });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Categoria não encontrada." });
        }

        return res.json(category);
    } catch (err) {
        console.error("Erro ao buscar categoria: ", err);
        return res.status(500).json({ message: "Erro ao buscar categoria." });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    editCategory,
    deleteCategory,
    getCategoryById
};
