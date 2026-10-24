import { auth } from './firebase.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';

const getEquipments = 'http://localhost:3000/equipments';
const postEquipments = 'http://localhost:3000/equipments/cadastro';

const btnNewEquipament = document.getElementById("btnNewEquipament");
const logoutButton = document.querySelector("#logoutButton");
const btnSave = document.getElementById("btnSaveEquipament");
const btnDeleteEquipament = document.getElementById("btnDeleteEquipament");

const modalElement = document.getElementById("equipamentModel");
const modal = new bootstrap.Modal(modalElement);
const modalTitle = document.querySelector("#modal-title");
const formControl = document.querySelectorAll(".form-control")

const equipamentsTable = document.querySelector("#equipmentsTable");

const userInfo = document.querySelector("#userInfo");
const activesTotal = document.querySelector("#activesTotal");
const equipamentName = document.getElementById("equipamentName");
const equipmentPatrimony = document.getElementById("equipmentPatrimony");
const equipamentLocal = document.getElementById("equipamentLocal");
const equipamentStatus = document.getElementById("equipamentStatus");


onAuthStateChanged(auth, (user)=> {
    if(!user) {
        window.location.href = '../../login.html';
        return;
    }

    userInfo.textContent = `Bem vindo! ${user.email}`
})

logoutButton.addEventListener('click', async () => {
    try{
        signOut(auth)
        window.location.href = "../login.html"
    } catch (err) {
        console.error("falha ao sair: ", err);
    }
})

// equipamentsTable.addEventListener('click', (event) => {
//     if (event.target.classList.contains('btn-delete')) {
//         const idEquipamentDelete = Number(event.target.dataset.id);
//         equipamentDelete(idEquipamentDelete);
//     }
//     equipamentsTableRender(equipaments);
//     dashboardRefresh();
// });

btnNewEquipament.addEventListener("click", () => {
    btnDeleteEquipament.classList.add('d-none');
    modal.show();
})

equipamentsTable.addEventListener('click', (event => {
    if (event.target.classList.contains('btnEdit')) {
        const equipmentId = Number(event.target.dataset.id);
        
        openModalEdit(equipmentId);
    }
}))

btnSave.addEventListener("click", async (event) => {
    event.preventDefault();
    
    const equipament = {
        name: equipamentName.value,
        patrimony: equipmentPatrimony.value,
        local: equipamentLocal.value,
        status: equipamentStatus.value
    }

    try {
        const retorno = await saveEquipments(equipament);

        alert(retorno.message || "Equipamento cadastrado!");
        formControl.reset();
    } catch(err) {
        console.warn("Ocorreu um erro:", err.message);
        alert(err.message);
    }
    
})

async function saveEquipments(equipment) {
    try{
        if (!equipment || !equipment.name) {
            throw new Error("Nome de equipamento não informado.");
        }

        const data = await fetch(postEquipments, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(equipment)
        });

        const retorno = await data.json();

        if(!data.ok) {
            throw new Error(retorno.message || "Erro ao salvar o equipamento no servidor.");
        }

        return retorno;

    } catch (err) {
        console.error("Occoreu um erro interno, por favor tente novamente mais tarde: "+err)
    }
}


async function equipamentsTableRender() {
    equipamentsTable.innerHTML = "";

    try{
        const data = await fetch(getEquipments);
        const response = await data.json();

        response.forEach(equipment => {

            const row = document.createElement("tr");

            row.innerHTML = `<td>${equipment.name}</td>
            <td>${equipment.local}</td>
            <td>${equipment.status}</td>
            <td> <button class="btn btn-info btnEdit" data-id="${equipment.id}">Editar</button>
            </td>  
            `
            equipamentsTable.appendChild(row);
        });  

        dashboardRefresh();
    } catch (err) {
        console.error("Occoreu um erro interno, por favor tente novamente mais tarde: "+err)
    }
}
equipamentsTableRender();

async function dashboardRefresh() {
    
    const data = await fetch(getEquipments);
    const response = await data.json();

    activesTotal.textContent = response.filter(response => response.status !== "Inactive").length;

    console.log(response);

    console.log("Dashboard Atualizado!")
}
dashboardRefresh()



// function equipamentDelete(id) {
//     const index = equipaments.findIndex(equipament => equipament.id === id
//     );

//     if (index === -1) {
//         console.error("Equipamento não encontrado: ", id)
//     }

//     equipaments.splice(index,1);
//     equipamentsTableRender(equipaments);
//     dashboardRefresh();

// }

function openModalEdit(id) {
    modal.show();
    btnSave.textContent = "Editar";
    modalTitle.textContent = "Editar Equipamento";
    btnDeleteEquipament.classList.remove('d-none');
    return;
        // CRIAR ROTA NO BACK E CONTINUAR LÓGIA DA FUNCTION
        // LEMBRAR DE TRATAR 
}