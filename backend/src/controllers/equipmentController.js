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