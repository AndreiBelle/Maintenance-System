import { signOut } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { auth } from './services/firebase.js';
import { verifyTokenAndUser } from './services/authService.js'


const endPoint = 'http://localhost:3000/equipments';

let isLoading = false;
let cancelFunc = false;

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

btnNewEquipament.addEventListener("click", () => {
    btnDeleteEquipament.classList.add('d-none');
    btnSave.textContent = "Salvar";
    modal.show();
})

equipamentsTable.addEventListener('click', (event => {
    if (event.target.classList.contains('btnEdit')) {
        const equipmentId = Number(event.target.dataset.id);
        loadingData(equipmentId);
        validaLoading(equipmentId);
    }
}));

function validaLoading(equipmentId) {
    if (isLoading != false) {
        showNotify("Aguarde, carregando dados...", "info");
        setTimeout(() => validaLoading(equipmentId), 1000);
    }
    if (cancelFunc == true) {
        return showNotify("Operação cancelada", "danger");
    } else if (isLoading == false && cancelFunc == false) {
        openModalEdit(equipmentId);
    }
}

async function loadingData(id) {
    isLoading = true
    if (!id) {
        showNotify(`Não foi informado um id: ${id}`, "info");
    }

    const idToken = await verifyTokenAndUser();

    try {
        const data = await fetch(`${endPoint}/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });

        if (!data.ok) {
            showNotify("Não foi possível buscar os dados, tente novamente mais tarde.", "danger");
            return cancelFunc = true;
        }

        const response = await data.json()

        equipamentName.value = response.name;
        equipmentPatrimony.value = response.patrimony;
        equipamentLocal.value = response.local;
        equipamentStatus.value = response.status;



    } catch (err) {
        showNotify(`Erro ao buscar dados: ${err}`, "info")
    } finally {
        isLoading = false;
    }
}

function openModalEdit(id) {
    modal.show();
    btnSave.textContent = "Editar";
    modalTitle.textContent = "Editar Equipamento";
    btnDeleteEquipament.classList.remove('d-none');


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

    btnSave.addEventListener('click', async (event) => {
        event.preventDefault();
        const equipament = {
            name: equipamentName.value,
            patrimony: equipmentPatrimony.value,
            local: equipamentLocal.value,
            status: equipamentStatus.value
        }

        try {
            const retorno = await saveEquipments(equipament);
            showNotify(retorno.message || "Equipamento cadastrado!", "success");
            modal.hide();

        } catch (err) {
            showNotify("Ocorreu um erro: "+err , "danger");
        }

    })

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
                Authorization: `Bearer ${idToken}`
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
    } catch (err) {
        console.warn("Ocorreu um erro:", err.message);
        alert(err.message);
    }

    equipamentsTableRender();
    dashboardRefresh();

})

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