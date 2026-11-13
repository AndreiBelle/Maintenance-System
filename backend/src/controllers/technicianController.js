const technicianService = require('../services/technicianService');

const validStatuses = ['Ativo', 'Inativado'];

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
    const { name, position, status } = req.body;

    if (!name || !position || !status) {
        return res.status(400).json({ message: "Nome, cargo e status são obrigatórios." });
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "O status deve ser Ativo ou Inativado." });
    }

    try {
        await technicianService.createTechnician({ name, position, status });
        return res.status(201).json({ message: "Técnico cadastrado com sucesso!" });
    } catch (err) {
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
        return res.status(500).json({ message: "Erro ao excluir técnico." });
    }
};

const editTechnician = async (req, res) => {
    const { name, position, status } = req.body;

    if (!name || !position || !status) {
        return res.status(400).json({ message: "Nome, cargo e status são obrigatórios." });
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "O status deve ser Ativo ou Inativado." });
    }

    try {
        await technicianService.updateTechnician(req.params.id, { name, position, status });
        return res.status(204).send();
    } catch (err) {
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
