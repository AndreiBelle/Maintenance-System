const technicianService = require('../services/technicianService');

const getAllTechnicians = async (req, res) => {
    try {
        const technicians = await technicianService.getAllTechnicians();
        return res.json(technicians);
    } catch (err) {
        console.error("Erro ao buscar técnicos: ", err);
        return res.status(500).json({ message: "Erro ao buscar técnicos." });
    }
};

const createTechnician = async (req, res) => {
    try {
        await technicianService.createTechnician(req.body);
        return res.status(201).json({ message: "Técnico cadastrado com sucesso!" });
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error("Erro ao cadastrar técnico: ", err);
        return res.status(500).json({ message: "Erro ao processar os dados do técnico." });
    }
};

const deleteTechnician = async (req, res) => {
    try {
        await technicianService.deleteTechnician(req.params.id);
        return res.status(204).send();
    } catch (err) {
        console.error("Erro ao excluir técnico: ", err);
        return res.status(err.statusCode || 500).json({ message: err.message || "Erro ao excluir técnico." });
    }
};

const editTechnician = async (req, res) => {
    try {
        await technicianService.updateTechnician(req.params.id, req.body);
        return res.status(204).send();
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error("Erro ao editar técnico: ", err);
        return res.status(400).json({ message: "Erro ao editar técnico." });
    }
};

const getTechnicianById = async (req, res) => {
    try {
        const technician = await technicianService.getTechnicianById(req.params.id);

        if (!technician) {
            return res.status(404).json({ message: "Técnico não encontrado." });
        }

        return res.json(technician);
    } catch (err) {
        console.error("Erro ao buscar técnico: ", err);
        return res.status(500).json({ message: "Erro ao buscar técnico." });
    }
};

module.exports = {
    getAllTechnicians,
    createTechnician,
    editTechnician,
    deleteTechnician,
    getTechnicianById
};
