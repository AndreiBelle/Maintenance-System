const localService = require('../services/localService');

const getAllLocals = async (req, res) => {
    try {
        const locals = await localService.getAllLocals();
        res.json(locals);
    } catch (err) {
        console.error("Deu erro ao buscar locais: ", err);
        res.status(500).json({ message: "erro ao buscar locais" });
    }
};

const createLocal = async (req, res) => {
    const { cep, city, state, cnpj, nameLocation, sector } = req.body;

    if (!cep || !city || !state || !nameLocation || !sector) {
        return res.status(400).json({ message: "Dados marcados com * são obrigatórios!" });
    }

    const data = {
        cep,
        city,
        state,
        cnpj,
        nameLocation,
        sector
    };

    try {
        await localService.createLocal(data);
        return res.status(201).json({ message: "Local cadastrado com sucesso!" });
    } catch (err) {
        return res.status(500).json({ message: "Erro ao processar os dados, por favor tente novamente mais tarde." + err });
    }
};

const deleteLocal = async (req, res) => {
    try {
        await localService.deleteLocal(req.params.id);
        return res.status(204).send();
    } catch (err) {
        console.error("Erro ao deletar local: ", err);
        return res.status(500).json({ message: "Erro ao deletar local" });
    }
};

const editLocal = async (req, res) => {
    try {
        await localService.updateLocal(req.params.id, req.body);
        return res.status(204).send();
    } catch (err) {
        return res.status(400).json({ message: `${err}` });
    }
};

const getLocalById = async (req, res) => {
    try {
        const local = await localService.getLocalById(req.params.id);

        if (!local) {
            return res.status(404).json({ message: "Local não encontrado" });
        }

        return res.json(local);
    } catch (err) {
        console.error("Erro ao buscar local: ", err);
        return res.status(500).json({ message: "Erro ao buscar local" });
    }
};

module.exports = {
    getAllLocals,
    createLocal,
    editLocal,
    deleteLocal,
    getLocalById
};
