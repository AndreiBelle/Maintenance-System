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
    const { name, patrimony: equipmentPatrimony, local, status, acquisitionDate, categoryId, nextPreventiveDate } = data;

    if (!name || !equipmentPatrimony || !local || !status || !Number(categoryId)) {
        const error = new Error("Dados marcados com * são obrigatórios!");
        error.statusCode = 400;
        throw error;
    }

    const acquisition = acquisitionDate ? new Date(acquisitionDate) : null;
    const nextPreventive = nextPreventiveDate ? new Date(nextPreventiveDate) : null;

    if (!acquisitionDate || !nextPreventiveDate) {
        const error = new Error("Informe datas válidas para o equipamento.");
        error.statusCode = 400;
        throw error;
    }

    data = {
        name,
        patrimony: equipmentPatrimony,
        local,
        status,
        acquisitionDate: acquisition,
        categoryId: Number(categoryId),
        nextPreventiveDate: nextPreventive
    };

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
    const { name, patrimony, local, status, acquisitionDate, categoryId, nextPreventiveDate } = data;

    if (!name || !patrimony || !local || !status || !Number(categoryId)) {
        const error = new Error("Dados marcados com * são obrigatórios!");
        error.statusCode = 400;
        throw error;
    }

    const acquisition = acquisitionDate ? new Date(acquisitionDate) : null;
    const nextPreventive = nextPreventiveDate ? new Date(nextPreventiveDate) : null;

    if ((acquisitionDate && Number.isNaN(acquisition.getTime())) || (nextPreventiveDate && Number.isNaN(nextPreventive.getTime()))) {
        const error = new Error("Informe datas válidas para o equipamento.");
        error.statusCode = 400;
        throw error;
    }

    data = {
        name,
        patrimony,
        local,
        status,
        acquisitionDate: acquisition,
        categoryId: Number(categoryId),
        nextPreventiveDate: nextPreventive
    };

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
        if (err.code === 'P2003') {
            const error = new Error('Não é possível excluir um equipamento que possui ordens de serviço.');
            error.statusCode = 409;
            throw error;
        }
        throw err;
    }

};

module.exports = { getAllEquipments, getEquipmentById, createEquipment, update, deleteEquipment }
