const prisma = require('../database/prisma');

const validStatuses = ['Ativo', 'Inativado'];

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
    const { name, status, phone, email, specialty } = data;

    if (!name || !status || !phone || !email || !specialty) {
        const error = new Error("Nome, telefone, e-mail, especialidade e status são obrigatórios.");
        error.statusCode = 400;
        throw error;
    }

    if (!validStatuses.includes(status)) {
        const error = new Error("O status deve ser Ativo ou Inativado.");
        error.statusCode = 400;
        throw error;
    }

    return await prisma.technicians.create({ data });
};

const updateTechnician = async (id, data) => {
    const { name, status, phone, email, specialty } = data;

    if (!name || !status || !phone || !email || !specialty) {
        const error = new Error("Nome, telefone, e-mail, especialidade e status são obrigatórios.");
        error.statusCode = 400;
        throw error;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const error = new Error("Informe um e-mail válido.");
        error.statusCode = 400;
        throw error;
    }

    if (!validStatuses.includes(status)) {
        const error = new Error("O status deve ser Ativo ou Inativado.");
        error.statusCode = 400;
        throw error;
    }

    return await prisma.technicians.update({
        where: { id: Number(id) },
        data
    });
};

const deleteTechnician = async (id) => {
    try {
        return await prisma.technicians.delete({
            where: { id: Number(id) }
        });
    } catch (err) {
        if (err.code === 'P2003') {
            const error = new Error('Não é possível excluir um técnico vinculado a ordens de serviço.');
            error.statusCode = 409;
            throw error;
        }
        throw err;
    }
};

module.exports = {
    getAllTechnicians,
    getTechnicianById,
    createTechnician,
    updateTechnician,
    deleteTechnician
};
