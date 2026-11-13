import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { auth } from './services/firebase.js';
import { verifyTokenAndUser } from './services/authService.js'
import { buscarCep } from './services/viaCep.js';

const endPoint = 'http://localhost:3000/equipments';
const localsEndPoint = 'http://localhost:3000/locals';

const modalEquipment = document.getElementById("equipamentModel");
const modal = new bootstrap.Modal(modalEquipment);
const modalTitle = document.querySelector("#modal-title");

const modalLocalElement = document.getElementById("localModal");
const modalLocal = new bootstrap.Modal(modalLocalElement);

const btnNewEquipament = document.getElementById("btnNewEquipament");
const btnNewLocal = document.getElementById("btnNewLocal");
const btnSave = document.getElementById("btnSaveEquipament");
const btnSaveLocal = document.getElementById("btnSaveLocal");
const btnDeleteEquipament = document.getElementById("btnDeleteEquipament");
const logoutButton = document.querySelector("#logoutButton");

const equipamentsTable = document.querySelector("#equipmentsTable");
const userInfo = document.querySelector("#userInfo");
const activesTotal = document.querySelector("#activesTotal");

const equipamentName = document.getElementById("equipamentName");
const equipmentPatrimony = document.getElementById("equipmentPatrimony");
const equipamentLocal = document.getElementById("equipamentLocal");
const equipamentStatus = document.getElementById("equipamentStatus");

const localCep = document.getElementById("localCep");
const localCity = document.getElementById("localCity");
const localEstado = document.getElementById("localEstado");
const localCnpj = document.getElementById("localCnpj");
const localNameLocation = document.getElementById("localNameLocation");
const localSector = document.getElementById("localSector");
const localModalTitle = document.getElementById("localModalTitle");

const searchInput = document.getElementById('searchInput');

let allEquipments = [];

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = '../../login.html';
        return;
    }

    userInfo.textContent = `Bem vindo! ${user.email}`;
    await loadEquipments();
    await loadLocals();
});

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

        allEquipments = await response.json();

        equipamentsTableRender(allEquipments);
        dashboardRefresh(allEquipments);

    } catch (err) {
        console.error("Erro ao caregar equipamentos: ", err);
    }
}

async function saveEquipments(equipment) {
    try {
        if (!equipment) {
            throw new Error("Equipamento não informado.");
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
            showNotify(retorno.message, "danger");
            return;
        }

        await loadEquipments();
        return retorno;
        

    } catch (err) {
        console.error("Occoreu um erro interno, por favor tente novamente mais tarde: " + err)
    }
}

async function loadLocals() {
    try {
        const idToken = await verifyTokenAndUser();
        const response = await fetch(localsEndPoint, {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });

        if (response.status === 401) {
            window.location.href = "./login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Falha ao carregar locais.");
        }

        const locals = await response.json();
        localSelectRender(locals);
    } catch (err) {
        console.error("Erro ao carregar locais: ", err);

        showNotify(err.message || "Não foi possível carregar os locais.", "danger");
    }
}

async function saveLocal(local) {
    if (!local) {
        throw new Error("Local não informado.");
    }

    const idToken = await verifyTokenAndUser();
    const response = await fetch(localsEndPoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(local)
    });

    const retorno = await response.json();

    if (!response.ok) {
        throw new Error(retorno.message || "Erro ao salvar o local.");
    }

    return retorno;
}

async function editLocal(id, local) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(`${localsEndPoint}/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(local)
    });

    if (!response.ok) {
        const retorno = await response.json();
        throw new Error(retorno.message || "Erro ao editar o local.");
    }
}

async function getLocalById(id) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(`${localsEndPoint}/${id}`, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });

    if (!response.ok) {
        throw new Error("Não foi possível buscar os dados do local.");
    }

    return await response.json();
}

async function deleteLocal(id) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(`${localsEndPoint}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });

    if (!response.ok) {
        const retorno = await response.json();
        throw new Error(retorno.message || "Erro ao excluir o local.");
    }

    showNotify("Local apagado com sucesso!", "success");
}

function localSelectRender(locals) {
    const selectedLocal = equipamentLocal.value;
    equipamentLocal.innerHTML = '<option selected disabled value="">Selecione o local...</option>';

    locals.forEach(local => {
        const option = document.createElement("option");
        option.value = local.nameLocation;
        option.textContent = `${local.nameLocation} - ${local.sector} (${local.city}/${local.state})`;
        equipamentLocal.appendChild(option);
    });

    if (locals.some(local => local.nameLocation === selectedLocal)) {
        equipamentLocal.value = selectedLocal;
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
            return;
        }
        showNotify("Equipamento editado com sucesso!", "success")
        modal.hide();

        await loadEquipments();

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

        await loadEquipments();
    } catch (err) {
        console.error("Ocorreu um erro ao excluir o equipamento: " + err)
    }
}

function equipamentsTableRender(equipmentsList) {
    equipamentsTable.innerHTML = "";

    if(equipmentsList.length > 0)  {
        equipmentsList.forEach(equipment => {
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
        equipamentsTable.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum equipamento encontrado.</td></tr>`;
    }

    dashboardRefresh(allEquipments);
}

function dashboardRefresh(equipmentsList) {
    activesTotal.textContent = equipmentsList.filter(equipment => equipment.status !== "Inativo").length;
    console.log("Dashboard Atualizado!");
}

btnNewEquipament.addEventListener("click", async () => {

    btnDeleteEquipament.classList.add('d-none');
    btnSave.textContent = "Salvar";
    delete btnSave.dataset.id;

    equipamentName.value = "";
    equipmentPatrimony.value = "";
    equipamentLocal.value = "";
    equipamentStatus.value = "Ativo";

    modal.show();
})

btnNewLocal.addEventListener("click", () => {
    localCep.value = "";
    localCity.value = "";
    localEstado.value = "";
    localCnpj.value = "";
    localNameLocation.value = "";
    localSector.value = "";
    delete btnSaveLocal.dataset.id;
    btnSaveLocal.textContent = "Salvar Local";
    localModalTitle.textContent = "Novo Local";
    modalLocal.show();
});

async function fillLocalCityAndState() {
    const cepConsultado = localCep.value;
    const endereco = await buscarCep(cepConsultado);

    if (localCep.value !== cepConsultado) {
        return false;
    }

    localCity.value = endereco.city;
    localEstado.value = endereco.state;
    return true;
}

localCep.addEventListener("input", () => {
    localCity.value = "";
    localEstado.value = "";
});

localCep.addEventListener("blur", async () => {
    if (!localCep.value.trim()) {
        return;
    }

    try {
        await fillLocalCityAndState();
    } catch (err) {
        showNotify(err.message || "Não foi possível consultar o CEP.", "danger");
    }
});

btnSaveLocal.addEventListener("click", async (event) => {
    event.preventDefault();

    if (localCep.value.trim() && (!localCity.value.trim() || !localEstado.value.trim())) {
        try {
            const consulta = await fillLocalCityAndState()

            if (!consulta) {
                return;
            }
        } catch (err) {
            showNotify(err.message || "Não foi possível consultar o CEP.", "danger");
            return;
        }
    }

    const local = {
        cep: localCep.value.replace(/\D/g, ""), // (/"\D pega o que NÃO for número"/"g" pega em todo o texto)
        city: localCity.value.trim(),
        state: localEstado.value.trim(),
        cnpj: localCnpj.value.trim() || null,
        nameLocation: localNameLocation.value.trim(),
        sector: localSector.value.trim()
    };

    if (!local.cep || !local.city || !local.state || !local.nameLocation || !local.sector) {
        showNotify("Preencha os campos obrigatórios do local.", "danger");
        return;
    }

    try {
        if (btnSaveLocal.dataset.id) {
            await editLocal(btnSaveLocal.dataset.id, local);
            showNotify("Local editado com sucesso!", "success");
        } else {
            const retorno = await saveLocal(local);
            showNotify(retorno.message || "Local cadastrado com sucesso!", "success");
        }

        modalLocal.hide();
        await loadLocals();
    } catch (err) {
        showNotify("Erro ao salvar local: " + err.message, "danger");
    }
});

equipamentsTable.addEventListener('click', async (event) => {
    if (event.target.classList.contains('btnEdit')) {
        const equipmentId = Number(event.target.dataset.id);

        showNotify("Carregando dados, aguarde...", "info");

        btnDeleteEquipament.addEventListener('click', async (event) => {
            event.preventDefault();
            showConfirm(
                'Excluir Equipamento', 
                'Tem certeza que deseja apagar este item permanentemente?', 
                async () => {
                    await equipamentDelete(equipmentId);
                    modal.hide();
                    showNotify("Equipamento apagado com sucesso","success");
                }
            );
        });

        try {
            await loadLocals();
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


modalEquipment.addEventListener("click", async (event) => {
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

    if (!equipment.local) {
        showNotify("Selecione um local cadastrado.", "danger");
        return;
    }

    if (event.target.textContent.includes('Editar')) {
        const equipmentId = event.target.dataset.id;

        try {
            const retorno = await editEquipment(equipmentId, equipment);

            if (retorno !== undefined) {
                modal.hide();
                await loadEquipments();
            }
        } catch (err) {
            showNotify("Ocorreu um erro ao editar: " + err.message, "danger");
        }
    }

    if (event.target.textContent.includes('Salvar')) {
        try {
            await saveEquipments(equipment);
            await loadEquipments();
        } catch (err) {
            showNotify(err);
        }
    }
});

searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    const result = allEquipments.filter(equipament => 
        equipament.name.toLowerCase().includes(term)
    );
    
    equipamentsTableRender(result);
});