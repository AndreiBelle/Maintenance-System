const equipmentService = require('../services/equipmentService');

const getAllEquipments = async (req,res) => {
    try{
        const equipments = await equipmentService.getAllEquipments();
        res.json(equipments);
    } catch (err) {
        console.error("Deu erro ao buscar equipamentos: ",err);
        res.status(500).json({message :"erro ao buscar equipamentos"})
    };
};

const createEquipment = async (req,res) => {
    const {name, patrimony, status, acquisitionDate = new Date().toISOString()} = req.body

    if(!name || !patrimony || !status) {
        return res.status(400).json({message : "Dados marcados com * são obrigatórios!"})
    }

    const data = {
        name: name,
        patrimony: patrimony,
        status: status,
        acquisitionDate: acquisitionDate,
    };

    try{
        await equipmentService.createEquipment(data) 
        return res.status(201).json({message: "Equipamento cadastrado com sucesso!"})
    } catch (err) {
        return res.status(500).json({message: "Erro ao processar os dados, por favor tente novamente amis tarde." + err})
    }

}
module.exports = {
    getAllEquipments,
    createEquipment
}