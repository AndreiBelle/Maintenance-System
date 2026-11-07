import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { auth } from './services/firebase.js';
import { verifyTokenAndUser } from './services/authService.js'

const endPoint = 'http://localhost:3000/equipments';



const btnNewEquipament = document.getElementById("btnNewEquipament");
const logoutButton = document.querySelector("#logoutButton");
const btnSave = document.getElementById("btnSaveEquipament");
const btnDeleteEquipament = document.getElementById("btnDeleteEquipament");

const modalElement = document.getElementById("equipamentModel");
const modal = new bootstrap.Modal(modalElement);
const modalTitle = document.querySelector("#modal-title");

const equipamentsTable = document.querySelector("#equipmentsTable");
const userInfo = document.querySelector("#userInfo");
const activesTotal = document.querySelector("#activesTotal");

const equipamentName = document.getElementById("equipamentName");
const equipmentPatrimony = document.getElementById("equipmentPatrimony");
const equipamentLocal = document.getElementById("equipamentLocal");
const equipamentStatus = document.getElementById("equipamentStatus");

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = '../../login.html';
        return;
    }

    loadEquipments();
    dashboardRefresh();

    userInfo.textContent = `Bem vindo! ${user.email}`
})

logoutButton.addEventListener('click', async () => {
    try {
        signOut(auth)
        window.location.href = "../login.html"
    } catch (err) {
        console.error("falha ao sair: ", err);
    }
})


async function loadEquipments() {
    try {
        const idToken = await verifyTokenAndUser();
        console.log(idToken);

        const response = await fetch(endPoint, {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });

        if (response.status == 401) {
            window.location.href = "./login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Falha ao carregar equipamentos")
        }

        const equipaments = await response.json();

        equipamentsTableRender(equipaments);

    } catch (err) {
        console.error("Erro ao caregar equipamentos: ", err);
    }
}

async function saveEquipments(equipment) {
    try {
        if (!equipment || !equipment.name) {
            throw new Error("Nome de equipamento não informado.");
        }

        const idToken = await verifyTokenAndUser();

        const data = await fetch(endPoint, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(equipment)
        });

        const retorno = await data.json();

        if (!data.ok) {
            throw new Error(retorno.message || "Erro ao salvar o equipamento no servidor.");
        }

        return retorno;

    } catch (err) {
        console.error("Occoreu um erro interno, por favor tente novamente mais tarde: " + err)
    }
}

async function editEquipment(id, equipment) {
    const idToken = await verifyTokenAndUser();
    try{
        const data = await fetch(`${endPoint}/${id}`,{
            method: 'PUT',
            headers:{
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(equipment)
        })

        if (!data.ok) {
            const retorno = await data.json()

            showNotify(retorno.message, "danger");
            return
        }
        showNotify("Equipamento editado com sucesso!", "success")

    } catch (err) {
        showNotify(err.message || "Ops! Não foi possível atualizar seu equipamento agora, tente novamente mais tarde.", "danger");
    }
}

async function equipamentDelete(id) {
    if (!id) {
        console.error("ID não encontrado");
    }

    const idToken = await verifyTokenAndUser();
    

    try {
        const data = await fetch(`${endPoint}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${idToken}`,
            }
        });

        if(!data.ok) {
            showNotify("Equipamento apagado com sucesso!", "success");
        }

        equipamentsTableRender();
        dashboardRefresh();
    } catch (err) {
        console.error("Ocorreu um erro ao excluir o equipamento: " + id.name + `Erro: ` + err)
    }
}

async function equipamentsTableRender() {
    equipamentsTable.innerHTML = "";
    const idToken = await verifyTokenAndUser();

    try {
        const data = await fetch(endPoint, {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });
        const response = await data.json();

        if(response.length > 0)  {
            response.forEach(equipment => {
                const status = (equipment.status == "Preventiva" || equipment.status == "Corretiva") ? `Manutenção ${equipment.status}` : `${equipment.status}`;

                const row = document.createElement("tr");

                row.innerHTML = `<td>${equipment.name}</td>
                <td>${equipment.local}</td>
                <td>${status}</td>
                <td> <button class="btn btn-info btnEdit" data-id="${equipment.id}">Editar</button>
                </td>  
                `
                equipamentsTable.appendChild(row);
            });
        } else {
            equipamentsTable.innerHTML = "";

            const row = document.createElement("td");

            equipamentsTable.appendChild(row);
        }

        dashboardRefresh();
    } catch (err) {
        console.error("Occoreu um erro interno, por favor tente novamente mais tarde: " + err)
    }
}

async function dashboardRefresh() {
    const idToken = await verifyTokenAndUser();


    const data = await fetch(endPoint, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });
    const response = await data.json();

    activesTotal.textContent = response.filter(response => response.status !== "Inativo").length;

    console.log(response);

    console.log("Dashboard Atualizado!");
}

btnNewEquipament.addEventListener("click", () => {
    btnDeleteEquipament.classList.add('d-none');
    btnSave.textContent = "Salvar";

    equipamentName.value = "";
    equipmentPatrimony.value = "";
    equipamentLocal.value = "";
    equipamentStatus.value = "Ativo";

    modal.show();
})

equipamentsTable.addEventListener('click', async (event) => {
    if (event.target.classList.contains('btnEdit')) {
        const equipmentId = Number(event.target.dataset.id);
        console.log(equipmentId);

        showNotify("Carregando dados, aguarde...", "info");

        try {
            const idToken = await verifyTokenAndUser();
            const response = await fetch(`${endPoint}/${equipmentId}`, {
                headers: { Authorization: `Bearer ${idToken}` }
            });

            if (!response.ok) {
                throw new Error("Não foi possível buscar os dados do equipamento.");
            }

            const equipment = await response.json()

            equipamentName.value = equipment.name;
            equipmentPatrimony.value = equipment.patrimony;
            equipamentLocal.value = equipment.local;
            equipamentStatus.value = equipment.status;

            btnSave.textContent = "Editar";
            btnSave.dataset.id = equipment.id;
            modalTitle.textContent = "Editar Equipamento";
            btnDeleteEquipament.classList.remove('d-none');
            modal.show();
        } catch (err) {
            showNotify(err.message || "Operação cancelada ou falha ao carregar.", "danger");
        }
    }
});


modalElement.addEventListener("click", async (event) => {
    event.preventDefault();

    const btnTarget = event.target.closest("button");

    if(!btnTarget) {
        return;
    }

    const equipment = {
        name: equipamentName.value,
        patrimony: equipmentPatrimony.value,
        local: equipamentLocal.value,
        status: equipamentStatus.value
    };

    if (event.target.textContent.includes('Editar')) {
        const equipmentId = event.target.dataset.id;

        btnDeleteEquipament.addEventListener('click', async (event) => {
            event.preventDefault();
            showConfirm(
                'Excluir Equipamento', 
                'Tem certeza que deseja apagar este item permanentemente?', 
                () => {
                    equipamentDelete(id)
                    modal.hide();
                    showNotify("Equipamento apagado com sucesso","success");
                }
            );
        });

        try {
            const retorno = await editEquipment(equipmentId, equipment);

            if (retorno) {
                modal.hide();
                equipamentsTableRender();
                dashboardRefresh();
            }


            
        } catch (err) {
            showNotify("Ocorreu um erro ao editar: " + err.message, "danger");
        }
    }

    if (event.target.textContent.includes('Salvar')) {
        try {
            const retorno = await saveEquipments(equipment);
            showNotify(retorno?.message || "Equipamento cadastrado!", "success");
            modal.hide();
            equipamentsTableRender();
            dashboardRefresh();
        } catch (err) {
            showNotify("Ocorreu um erro ao salvar: " + err.message, "danger");
        }
    }
});


