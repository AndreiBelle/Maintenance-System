const prisma = require('../database/prisma');

const priorities = ['Baixa', 'Média', 'Alta'];
const statuses = ['Aberta', 'Em andamento', 'Concluída'];

const getAllWorkOrders = async () => {
    return await prisma.workOrder.findMany({
        include: {
            equipment: {
                select: { id: true, name: true, patrimony: true }
            },
            technician: {
                select: { id: true, name: true, specialty: true }
            }
        },
        orderBy: { id: "desc" }
    });
};

const getWorkOrderById = async (id) => {
    return await prisma.workOrder.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            equipment: {
                select: { id: true, name: true, patrimony: true }
            },
            technician: {
                select: { id: true, name: true, specialty: true }
            }
        }
    });
};

const createWorkOrder = async (data) => {
    const startDate = data.startDate ? new Date(data.startDate) : null;
    
    const expectedDeliveryDate = data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : null;
    
    const workOrder = {
        equipmentId: Number(data.equipmentId),
        technicianId: Number(data.technicianId),
        description: data.description,
        priority: data.priority,
        startDate: startDate && ! Number.isNaN(startDate.getTime()) ? startDate : null,
        expectedDeliveryDate: expectedDeliveryDate && !Number.isNaN(expectedDeliveryDate.getTime()) ? expectedDeliveryDate : null,
        status: data.status
    };

    if (!workOrder.equipmentId || !workOrder.technicianId || !workOrder.description || !priorities.includes(workOrder.priority) || !workOrder.startDate || !workOrder.expectedDeliveryDate || !statuses.includes(workOrder.status)) {
        const error = new Error("Preencha os campos obrigatórios da ordem com valores válidos.");
        error.statusCode = 400;
        throw error;
    }

    if (workOrder.expectedDeliveryDate < workOrder.startDate) {
        const error = new Error("A previsão de entrega não pode ser anterior ao início.");
        error.statusCode = 400;
        throw error;
    }

    return await prisma.workOrder.create({
        data: workOrder
    });
};

const updateWorkOrder = async (id, data) => {
    const startDate = data.startDate ? new Date(data.startDate) : null;
    
    const expectedDeliveryDate = data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : null;
    
    const workOrder = {
        equipmentId: Number(data.equipmentId),
        technicianId: Number(data.technicianId),
        description: data.description,
        priority: data.priority,
        startDate: startDate && !Number.isNaN(startDate.getTime()) ? startDate : null,
        expectedDeliveryDate: expectedDeliveryDate && !Number.isNaN(expectedDeliveryDate.getTime()) ? expectedDeliveryDate : null,
        status: data.status
    };

    if (!workOrder.equipmentId || !workOrder.technicianId || !workOrder.description || !priorities.includes(workOrder.priority) || !workOrder.startDate || !workOrder.expectedDeliveryDate || !statuses.includes(workOrder.status)) {
        const error = new Error("Preencha os campos obrigatórios da ordem com valores válidos.");
        error.statusCode = 400;
        throw error;
    }

    if (workOrder.expectedDeliveryDate < workOrder.startDate) {
        const error = new Error("A previsão de entrega não pode ser anterior ao início.");
        error.statusCode = 400;
        throw error;
    }

    return await prisma.workOrder.update({
        where: { id: Number(id) },
        data: workOrder
    });
};

const updateWorkOrderStatus = async (id, status) => {
    if (!statuses.includes(status)) {
        const error = new Error("Informe um status válido para a ordem de serviço.");
        error.statusCode = 400;
        throw error;
    }

    return await prisma.workOrder.update({
        where: { id: Number(id) },
        data: { status }
    });
};

module.exports = {
    getAllWorkOrders,
    getWorkOrderById,
    createWorkOrder,
    updateWorkOrder,
    updateWorkOrderStatus
};
