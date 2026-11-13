const prisma = require('../database/prisma');

const getAllTechnicians = async () => {
    return await prisma.technicians.findMany({
        orderBy: { id: "desc" }
    });
};

const getTechnicianById = async (id) => {
    return await prisma.technicians.findUnique({
        where: { id: Number(id) }
    });
};

const createTechnician = async (data) => {
    return await prisma.technicians.create({ data });
};

const updateTechnician = async (id, data) => {
    return await prisma.technicians.update({
        where: { id: Number(id) },
        data
    });
};

const deleteTechnician = async (id) => {
    return await prisma.technicians.delete({
        where: { id: Number(id) }
    });
};

module.exports = {
    getAllTechnicians,
    getTechnicianById,
    createTechnician,
    updateTechnician,
    deleteTechnician
};
