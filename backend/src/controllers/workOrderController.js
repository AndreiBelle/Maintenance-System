const workOrderService = require('../services/workOrderService');

const getAllWorkOrders = async (req, res) => {
    try {
        const workOrders = await workOrderService.getAllWorkOrders();
        return res.json(workOrders);
    } catch (err) {
        console.error("Erro ao buscar ordens de serviço: ", err);
        return res.status(500).json({ message: "Erro ao buscar ordens de serviço." });
    }
};

const createWorkOrder = async (req, res) => {
    try {
        await workOrderService.createWorkOrder(req.body);
        return res.status(201).json({ message: "Ordem de serviço aberta com sucesso!" });
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error("Erro ao abrir ordem de serviço: ", err);
        return res.status(400).json({ message: "Não foi possível abrir a ordem de serviço." });
    }
};

const editWorkOrder = async (req, res) => {
    try {
        await workOrderService.updateWorkOrder(req.params.id, req.body);
        return res.status(204).send();
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error("Erro ao editar ordem de serviço: ", err);
        return res.status(400).json({ message: "Não foi possível editar a ordem de serviço." });
    }
};

const updateWorkOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        await workOrderService.updateWorkOrderStatus(req.params.id, status);
        return res.status(204).send();
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error("Erro ao alterar status da ordem de serviço: ", err);
        return res.status(400).json({ message: "Não foi possível alterar o status da ordem de serviço." });
    }
};

const getWorkOrderById = async (req, res) => {
    try {
        const workOrder = await workOrderService.getWorkOrderById(req.params.id);

        if (!workOrder) {
            return res.status(404).json({ message: "Ordem de serviço não encontrada." });
        }

        return res.json(workOrder);
    } catch (err) {
        console.error("Erro ao buscar ordem de serviço: ", err);
        return res.status(500).json({ message: "Erro ao buscar ordem de serviço." });
    }
};

module.exports = {
    getAllWorkOrders,
    createWorkOrder,
    editWorkOrder,
    updateWorkOrderStatus,
    getWorkOrderById
};
