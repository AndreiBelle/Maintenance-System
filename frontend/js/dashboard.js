console.log("Carregou o Dashboard");

const systemName = "Sistema de Controle de Manuteção";

let activeEquipaments = 58;
let manutenceEquipaments = 5;


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

        const statusBR = equipment.status === "active" ? "Ativado" : "Desativado" 

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
        name: equipamentName.value,
        local: "Não Informado",
        status: "active",
        patrimony: `${String(equipaments.length+1).padStart(3, "0")}-PP`
    }

    equipaments.push(newEquipament);
    equipamentsTableRender(equipaments);
    // dashboardRefresh();

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
    // dashboardRefresh();

}

async function dashboardLoad() {
        const response = await fetch('http://localhost:3000/dashboard');
        

        if(!response.ok) {
            throw new Error("Não foi possível carregar o Dashboard!")
        }

        console.log(response.mensage)

        const data = await response.json();


        console.log("Equipamento ativo: "+data.activeEquipaments);
        console.log("Equipamento em manutenção: "+data.inMaintence);
        console.log("Equipamento em manutenção preventiva: "+data.preventiveMaintenance);

        const actives = data.activeEquipaments
    
        const inMaintence = data.inMaintence

        const preventiveEquips = data.preventiveMaintenance

        activeTotal.textContent = actives;
        maintenceEquipamentsTotal.textContent = inMaintence;
        preventiveTotal.textContent = preventiveEquips;

        console.log("Dashboard Atualizado!")
}

dashboardLoad()