const prisma = require('../database/prisma');

const getAllLocals = async () => {
    return await prisma.local.findMany({
        orderBy: { id: "desc" }
    });
};

const getLocalById = async (id) => {
    return await prisma.local.findUnique({
        where: {
            id: Number(id)
        }
    });
};

const createLocal = async (data) => {
    return await prisma.local.create({
        data
    });
};

const updateLocal = async (id, data) => {
    return await prisma.local.update({
        where: { id: Number(id) },
        data
    });
};

const deleteLocal = async (id) => {
    return await prisma.local.delete({
        where: {
            id: Number(id)
        }
    });
};

module.exports = { getAllLocals, getLocalById, createLocal, updateLocal, deleteLocal };
