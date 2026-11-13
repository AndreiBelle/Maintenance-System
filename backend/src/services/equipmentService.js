const prisma = require('../database/prisma');


const getAllEquipments = async () => {
    return await prisma.equipment.findMany({
        orderBy: { id: "desc" }
    });
};

const getEquipmentById = async (id) => {
    return await prisma.equipment.findUnique({
        where: {
            id: Number(id)
        }
    });
};

const createEquipment = async (data) => {
    try {
        const patrimony = await prisma.equipment.findUnique({
            where: {
                patrimony: data.patrimony
            }
        })

        if (patrimony) {
            const error = new Error("Esse patrimônio já tem cadastro, verifique no sistema!");
            error.statusCode = 409;
            throw error;
        }

        return await prisma.equipment.create({
            data
        });
    } catch (err) {
        console.error("Erro ao criar:", err.message);
        throw err;
    }
};

const update = async (id, data) => {
    try {
        const searchEquipment = await prisma.equipment.findUnique({
            where: { patrimony: data.patrimony }
        })

        if (searchEquipment && searchEquipment.id !== Number(id)) {
            throw new Error("Esse patrimônio já tem cadastro, verifique no sistema!");
        }

        return await prisma.equipment.update({
            where: { id: Number(id) },
            data
        });
    } catch (err) {
        console.error("Erro no update:", err.message);
        throw err;
    }

};

const deleteEquipment = async (id) => {
    try {
        return await prisma.equipment.delete({
            where: {
                id: Number(id)
            }
        });
    } catch (err) {
        throw new Error('Erro ao deletar Equipamento '+err);
    }

};

module.exports = { getAllEquipments, getEquipmentById, createEquipment, update, deleteEquipment }