const prisma = require('../database/prisma');


const getAllEquipments = async () => {
    return await prisma.equipment.findMany({
        orderBy:{id: "desc"}
    });
};

const getEquipmentById = async (id) => {
    return await prisma.equipment.findUnique({
        where: {
            id
        }
    });
};

const createEquipment = async (data) => {
    return await prisma.equipment.create({
        data
    });
};

const update = async (id, data) => {
    return await prisma.equipment.update({
        where: {id},
        data
    });
};

const deleteEquipment = async (id) => {
    try {
        return await prisma.equipment.delete({
        where: {
            id
        }
    });
    } catch (err) {
        console.log("ID RECEBIDO: ",id)
        throw new Error('Erro ao deletar Equipamento'+id);
    }
   
};

module.exports = {getAllEquipments, getEquipmentById, createEquipment, update, deleteEquipment}