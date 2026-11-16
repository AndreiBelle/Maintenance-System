const prisma = require('../database/prisma');

const getAllCategories = async () => {
    return await prisma.category.findMany({
        orderBy: { id: "desc" }
    });
};

const getCategoryById = async (id) => {
    return await prisma.category.findUnique({
        where: {
            id: Number(id)
        }
    });
};

const createCategory = async (data) => {
    const { name, description, preventivePeriodicity } = data;

    if (!name || !description || !preventivePeriodicity) {
        const error = new Error("Nome, descrição e periodicidade são obrigatórios.");
        error.statusCode = 400;
        throw error;
    }

    if (preventivePeriodicity === null || preventivePeriodicity === '' || typeof preventivePeriodicity === 'boolean' || (typeof preventivePeriodicity === 'string' && preventivePeriodicity.trim() === '') || !Number.isSafeInteger(Number(preventivePeriodicity)) || Number(preventivePeriodicity) <= 0) {
        const error = new Error("Informe a periodicidade em dias usando um número inteiro maior que zero.");
        error.statusCode = 400;
        throw error;
    }

    return await prisma.category.create({
        data
    });
};

const updateCategory = async (id, data) => {
    const { name, description, preventivePeriodicity } = data;

    if (!name || !description || !preventivePeriodicity) {
        const error = new Error("Nome, descrição e periodicidade são obrigatórios.");
        error.statusCode = 400;
        throw error;
    }

    if (preventivePeriodicity === null || preventivePeriodicity === '' || typeof preventivePeriodicity === 'boolean' || (typeof preventivePeriodicity === 'string' && preventivePeriodicity.trim() === '') || !Number.isSafeInteger(Number(preventivePeriodicity)) || Number(preventivePeriodicity) <= 0) {
        const error = new Error("Informe a periodicidade em dias usando um número inteiro maior que zero.");
        error.statusCode = 400;
        throw error;
    }

    return await prisma.category.update({
        where: { id: Number(id) },
        data
    });
};

const deleteCategory = async (id) => {
    return await prisma.category.delete({
        where: {
            id: Number(id)
        }
    });
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
