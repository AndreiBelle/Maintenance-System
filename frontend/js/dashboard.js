console.log("Carregou o Dashboard");

const systemName = "Sistema de Controle de Manuteção";

let activeEquipaments = 58;
let manutenceEquipaments = 5;

const equipaments = [
    {id:1,
    name: "Compressor",
    local: "Oficina",
    status: "active",
    patrimony: "12-PP"
},{id:2,
    name: "Gerador",
    local: "Casa de Máquina",
    status: "maintence",
    patrimony: "65-PP"
},{id:3,
    name: "Torno",
    local: "Oficina",
    status: "active",
    patrimony: "1-PP"
}];

const activeTotal = document.querySelector("#activesTotal");
const preventiveTotal = document.querySelector("#preventiveTotal");
const maintenceEquipamentsTotal = document.querySelector("#maintenceEquipamentsTotal");
const equipamentsTable = document.querySelector("#equipmentsTable");
const searchInput = document.getElementById("searchInput");
const btnNewEquipament = document.getElementById("btnNewEquipament");
const modalElement = document.getElementById("equipamentModel");
const modal = new bootstrap.Modal(modalElement);

preventiveTotal.textContent = 1


function dashboardRefresh() {
    const actives = equipaments.filter(equipament => equipament.status === "active").length;
    
    const inMaintence = equipaments.filter(equipament => equipament.status === "maintence").length;

    activeTotal.textContent = actives;
    maintenceEquipamentsTotal.textContent = inMaintence;

    console.log("Dashboard Atualizado!")
}

dashboardRefresh()

function equipamentsTableRender(list) {
    equipamentsTable.innerHTML = "";

    list.forEach(equipment => {

        const row = document.createElement("tr");

        const statusBR = equipment.status === "active" ? "ativoou" : "desativo" 

        row.innerHTML = `<td>${equipment.name}</td>
        <td>${equipment.local}</td>
        <td>${statusBR}</td>
        <td> <button class="btn btn-danger"
        onclick="equipamentDelete(${equipment.id})">Excluir</button>
        </td>
        
        `

        
        equipamentsTable.appendChild(row);
    });
}

equipamentsTableRender(equipaments);

searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLocaleLowerCase();

    const result = equipaments.filter(equipament => 
        equipament.name.toLocaleLowerCase().includes(term)

    )
    equipamentsTableRender(result)
})


btnNewEquipament.addEventListener("click", () => {
    modal.show();
})


const btnSave = document.getElementById("btnSaveEquipament");

const equipamentName = document.getElementById("equipamentName");

btnSave.addEventListener("click", () => {
    if (equipamentName.value.trim() === "") {
        console.warn("Nome de equipamento não informado");
        alert("Informe o nome do equipamento");
        return
    }

    const newEquipament = {
        id: equipaments.length + 1,
        name: equipamentName,
        local: "Não Informado",
        status: "active",
        patrimony: `${String(equipaments.length+1).padStart(3, "0")}-PP`
    }

    equipaments.push(newEquipament);
    equipamentsTableRender(equipaments);
    dashboardRefresh();

    modal.hide();
    equipamentName.value = "";
})

function equipamentDelete(id) {
    const index = equipaments.findIndex(equipament => equipament.id === id
    );

    if (index === -1) {
        console.error("Equipamento não encontrado: ", id)
    }

    equipaments.splice(index,1);
    equipamentsTableRender(equipaments);
    dashboardRefresh();

}