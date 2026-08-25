console.log("Carregou o Dashboard");

const systemName = "Sistema de Controle de Manuteção";

// let activeEquipaments = 48;
let manutenceEquipaments = 5;
// let preventiveMaintenance = 10;

console.log("Nome do Sistema ",systemName);
console.info("Em Manutenção ",manutenceEquipaments);

const equipaments = [
    {id:1,
    name: "Compressor",
    local: "Oficina",
    status: true,
    patriminy: "12-PP"
},{id:2,
    name: "Gerador",
    local: "Casa de Máquina",
    status: true,
    patriminy: "65-PP"
},{id:3,
    name: "Torno",
    local: "Oficina",
    status: true,
    patriminy: "1-PP"
}];

console.table(equipaments);
console.log(equipaments[0].name);

const activeTotal = document.querySelector("#activesTotal");
const preventiveTotal = document.querySelector("preventiveTotal");

console.log("activeTotal: ",activeTotal.textContent)