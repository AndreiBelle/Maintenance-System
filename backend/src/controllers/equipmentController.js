const equipments = [{
    id:1,
    nome:"Compressor",
    status:"Ativo",
},{
    id:2,
    nome:"Gerador 1",
    status:"Ativo",
},{
    id:3,
    nome:"Compressor 5444",
    status:"Ativo",
},
];

function getAllEquipments(req,res) {
    res.json(equipments);
}

module.exports = {
    getAllEquipments
}