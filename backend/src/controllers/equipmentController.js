const equipmentService = require('../services/equipmentService');

const getAllEquipments = async (req,res) => {
    try{
        const equipments = await equipmentService.getAllEquipments();
        res.json(equipments);
    } catch (err) {
        console.error("Deu erro ao buscar equipamentos: ",err);
        res.status(500).json({message :"erro ao buscar equipamentos"});
    };
};

const createEquipment = async (req,res) => {
    try{
        await equipmentService.createEquipment(req.body);
        return res.status(201).json({message: "Equipamento cadastrado com sucesso!"});
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({
                message: err.message
            });
        }

        return res.status(500).json({
            message: "Erro ao processar os dados, por favor tente novamente mais tarde."
        });
    }

}

const deleteEquipment = async (req, res) => { 
    try {
        await equipmentService.deleteEquipment(req.params.id);
        return res.status(204).send();
    } catch (err) {
        console.error("Erro ao excluir equipamento: ", err);
        return res.status(err.statusCode || 500).json({ message: err.message || "Erro ao excluir equipamento." });
    }
}

const editEquipment = async (req, res) => {
    try {
        await equipmentService.update(req.params.id, req.body);
        return res.status(204).send();
    } catch (err) {
        return res.status(err.statusCode || 400).json({ message: err.message });
    }
}

const getEquipmentById = async (req, res) => {
    try {
        const equipment = await equipmentService.getEquipmentById(req.params.id);

        if (!equipment) {
            return res.status(404).json({ message: "Equipamento não encontrado" });
        }

        return res.json(equipment);
    } catch (err) {
        console.error("Erro ao buscar equipamento: ", err);
        return res.status(500).json({ message: "Erro ao buscar equipamento." });
    }
}
module.exports = {
    getAllEquipments,
    createEquipment,
    editEquipment,
    deleteEquipment,
    getEquipmentById
}
