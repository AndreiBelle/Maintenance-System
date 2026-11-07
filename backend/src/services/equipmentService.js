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
    return await prisma.equipment.create({
        data
    });
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