const btnNewEquipament = document.getElementById("btnNewEquipament");
const modalElement = document.getElementById("equipamentModel");
const modal = new bootstrap.Modal(modalElement);
const equipamentsTable = document.querySelector("#equipmentsTable");
const activeTotal = document.querySelector("#activeTotal")
import { equipaments } from '../js/bd.js'



btnNewEquipament.addEventListener("click", () => {
    modal.show();
})

const btnSave = document.getElementById("btnSaveEquipament");
const equipamentName = document.getElementById("equipamentName");
const equipamentSerie = document.getElementById("equipamentSerie");
const equipamentLocal = document.getElementById("equipamentLocal");
const equipamentStatus = document.getElementById("equipamentStatus");


btnSave.addEventListener("click", () => {
    if (equipamentName.value.trim() === "") {
        console.warn("Nome de equipamento não informado");
        alert("Informe o nome do equipamento");
        return
    }

    const newEquipament = {
        id: equipaments.length + 1,
        name: equipamentName.value,
        local: equipamentLocal.value,
        status: equipamentStatus.value,
        NumberSerie: equipamentSerie.value,
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


        row.innerHTML = `<td>${equipment.name}</td>
        <td>${equipment.local}</td>
        <td>${equipment.status}</td>
        <td>${equipment.NumberSerie}</td>
        <td> <button class="btn btn-danger btn-delete" data-id="${equipment.id}">Excluir</button>
        </td>  
        `

        
        equipamentsTable.appendChild(row);
    });
    
}

equipamentsTableRender(equipaments);

function dashboardRefresh() {
    const actives = equipaments.filter(equipament => equipament.status === "Ativo").length;
    
    const inMaintence = equipaments.filter(equipament => equipament.status === "maintence").length;

    activeTotal.textContent = actives;
    maintenceEquipamentsTotal.textContent = inMaintence;

    console.log("..")
}

dashboardRefresh()



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

equipamentsTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-delete')) {
        const idEquipamentDelete = Number(event.target.dataset.id);
        equipamentDelete(idEquipamentDelete);
    }
});

equipamentsTableRender(equipaments);
dashboardRefresh();