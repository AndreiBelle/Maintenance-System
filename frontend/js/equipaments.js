const btnNewEquipament = document.getElementById("btnNewEquipament");
const modalElement = document.getElementById("equipamentModel");
const modal = new bootstrap.Modal(modalElement);
const equipamentsTable = document.querySelector("#equipmentsTable");


const equipaments = [
    {id:1,
    name: "Compressor",
    local: "Oficina",
    status: "active",
    patrimony: "12-PP"
  },
  {id:2,
    name: "Gerador",
    local: "Casa de Máquina",
    status: "maintence",
    patrimony: "65-PP"
  },
  {id:3,
    name: "Torno",
    local: "Oficina",
    status: "active",
    patrimony: "1-PP"
  }
];


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
    dashboardRefresh();

    modal.hide();
    equipamentName.value = "";
})


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