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
    const {name, patrimony, local, status, acquisitionDate = new Date().toISOString()} = req.body;

    if(!name || !patrimony || !local || !status) {
        return res.status(400).json({message : "Dados marcados com * são obrigatórios!"});
    }

    const data = {
        name: name,
        patrimony: patrimony,
        local: local,
        status: status,
        acquisitionDate: acquisitionDate,
    };

    try{
        await equipmentService.createEquipment(data);
        return res.status(201).json({message: "Equipamento cadastrado com sucesso!"});
    } catch (err) {
        return res.status(500).json({message: "Erro ao processar os dados, por favor tente novamente amis tarde." + err});
    }

}

const deleteEquipment = async (id ,req, res) => { 
    try {
        const equipment = await equipmentService.deleteEquipment(id);
        return res.status(204).send();
    } catch (err) {
        console.error(err)
    }
}

const editEquipment = async (id, req, res) => {
    try {
        const equipment = await equipmentService.getEquipmentById(id);
        return res.status(204).send();
    } catch (err) {
        return res.status(400).json({message : "Erro ao receber o id do equipamento!"});
    }
}
module.exports = {
    getAllEquipments,
    createEquipment,
    editEquipment,
    deleteEquipment
}