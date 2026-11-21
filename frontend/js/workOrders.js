import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { auth } from './services/firebase.js';
import { verifyTokenAndUser } from './services/authService.js';

const endPoint = 'http://localhost:3000/work-orders';
const equipmentsEndPoint = 'http://localhost:3000/equipments';
const techniciansEndPoint = 'http://localhost:3000/technicians';

const workOrderModalElement = document.getElementById("workOrderModal");
const workOrderModal = new bootstrap.Modal(workOrderModalElement);
const workOrderModalTitle = document.getElementById("workOrderModalTitle");

const btnNewWorkOrder = document.getElementById("btnNewWorkOrder");
const btnSaveWorkOrder = document.getElementById("btnSaveWorkOrder");
const logoutButton = document.getElementById("logoutButton");

const workOrdersTable = document.getElementById("workOrdersTable");
const workOrdersTotal = document.getElementById("workOrdersTotal");
const userInfo = document.getElementById("userInfo");
const searchInput = document.getElementById("searchInput");

const workOrderEquipment = document.getElementById("workOrderEquipment");
const workOrderTechnician = document.getElementById("workOrderTechnician");
const workOrderDescription = document.getElementById("workOrderDescription");
const workOrderPriority = document.getElementById("workOrderPriority");
const workOrderStartDate = document.getElementById("workOrderStartDate");
const workOrderExpectedDate = document.getElementById("workOrderExpectedDate");
const workOrderStatus = document.getElementById("workOrderStatus");

let allWorkOrders = [];

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = '../../login.html';
        return;
    }

    userInfo.textContent = `Bem vindo! ${user.email}`;
    await loadEquipments();
    await loadTechnicians();
    await loadWorkOrders();
});

logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = '../../login.html';
    } catch (err) {
        console.error("Falha ao sair: ", err);
        showNotify("Não foi possível encerrar a sessão.", "danger");
    }
});

async function loadEquipments() {
    try {
        const idToken = await verifyTokenAndUser();
        const response = await fetch(equipmentsEndPoint, {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });

        if (response.status === 401) {
            window.location.href = '../../login.html';
            return;
        }

        if (!response.ok) {
            throw new Error("Falha ao carregar equipamentos.");
        }

        const equipments = await response.json();
        workOrderEquipment.innerHTML = '<option selected disabled value="">Selecione o equipamento...</option>';

        equipments.forEach(equipment => {
            const option = document.createElement("option");
            option.value = equipment.id;
            option.textContent = `${equipment.name} - ${equipment.patrimony}`;
            workOrderEquipment.appendChild(option);
        });

        const date = new Date()
        console.log(date);
    } catch (err) {
        console.error("Erro ao carregar equipamentos: ", err);
        showNotify(err.message || "Não foi possível carregar os equipamentos.", "danger");
    }
}

async function loadTechnicians() {
    try {
        const idToken = await verifyTokenAndUser();
        const response = await fetch(techniciansEndPoint, {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });

        if (response.status === 401) {
            window.location.href = '../../login.html';
            return;
        }

        if (!response.ok) {
            throw new Error("Falha ao carregar técnicos.");
        }

        const technicians = await response.json();
        workOrderTechnician.innerHTML = '<option selected disabled value="">Selecione o técnico...</option>';

        technicians.forEach(technician => {
            const option = document.createElement("option");
            option.value = technician.id;
            option.textContent = `${technician.name} - ${technician.specialty}`;
            workOrderTechnician.appendChild(option);
        });
    } catch (err) {
        console.error("Erro ao carregar técnicos: ", err);
        showNotify(err.message || "Não foi possível carregar os técnicos.", "danger");
    }
}

async function loadWorkOrders() {
    try {
        const idToken = await verifyTokenAndUser();
        const response = await fetch(endPoint, {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });

        if (response.status === 401) {
            window.location.href = '../../login.html';
            return;
        }

        if (!response.ok) {
            throw new Error("Falha ao carregar o histórico de ordens de serviço.");
        }

        allWorkOrders = await response.json();
        workOrdersTableRender(allWorkOrders);
        dashboardRefresh(allWorkOrders);
    } catch (err) {
        console.error("Erro ao carregar ordens de serviço: ", err);
        showNotify(err.message || "Não foi possível carregar o histórico.", "danger");
    }
}

async function saveWorkOrder(workOrder) {
    try {
        const idToken = await verifyTokenAndUser();
        const response = await fetch(endPoint, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workOrder)
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Erro ao abrir a ordem de serviço.");
        }

        return result;
    } catch (err) {
        console.error("Erro ao abrir ordem de serviço: ", err);
        throw err;
    }
}

async function editWorkOrder(id, workOrder) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(`${endPoint}/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(workOrder)
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erro ao editar a ordem de serviço.");
    }
}

async function updateWorkOrderStatus(id, status) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(`${endPoint}/${id}/status`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erro ao alterar o status da ordem de serviço.");
    }
}

async function getWorkOrderById(id) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(`${endPoint}/${id}`, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });

    if (!response.ok) {
        throw new Error("Não foi possível buscar os dados da ordem de serviço.");
    }

    return await response.json();
}

function formatDateBr(value) {
    if (!value) {
        return "";
    }

    const [year, month, day] = value.slice(0, 10).split("-");
    return `${day}/${month}/${year}`;
}

function formatDateEn() {
    const date = new Date().toISOString();

    const [year, month, day] = date.slice(0, 10).split("-");
    return `${year}-${month}-${day}`;
}

function workOrdersTableRender(workOrdersList) {
    workOrdersTable.innerHTML = "";

    if (workOrdersList.length > 0) {
        workOrdersList.forEach(workOrder => {
            const row = document.createElement("tr");
            const equipmentName = workOrder.equipment ? workOrder.equipment.name : "Equipamento não encontrado";
            const technicianName = workOrder.technician ? workOrder.technician.name : "Técnico não encontrado";

            row.innerHTML = `<td>${equipmentName}</td>
                <td>${technicianName}</td>
                <td>${workOrder.description}</td>
                <td>${workOrder.priority}</td>
                <td>${formatDateBr(workOrder.startDate)}</td>
                <td>${formatDateBr(workOrder.expectedDeliveryDate)}</td>
                <td>${workOrder.status}</td>
                <td>
                    <button class="btn btn-info btn-sm btnEdit" data-id="${workOrder.id}">Editar</button>
                    ${workOrder.status !== "Concluída"
                        ? `<button class="btn btn-success btn-sm btnComplete ms-2" data-id="${workOrder.id}">Concluir</button>`
                        : ""}
                </td>`;
            workOrdersTable.appendChild(row);
        });
    } else {
        workOrdersTable.innerHTML = `<tr><td colspan="8" style="text-align: center;">Nenhuma ordem de serviço encontrada.</td></tr>`;
    }

    dashboardRefresh(allWorkOrders);
}

function dashboardRefresh(workOrdersList) {
    workOrdersTotal.textContent = workOrdersList.length;
    console.log("Histórico de ordens de serviço atualizado!");
}

btnNewWorkOrder.addEventListener("click", () => {
    delete btnSaveWorkOrder.dataset.id;
    btnSaveWorkOrder.textContent = "Salvar";
    workOrderModalTitle.textContent = "Abrir Ordem de Serviço";
    workOrderEquipment.value = "";
    workOrderTechnician.value = "";
    workOrderDescription.value = "";
    workOrderPriority.value = "Baixa";
    workOrderStartDate.value = formatDateEn();
    workOrderExpectedDate.value = "";
    workOrderStatus.value = "Aberta";
    workOrderModal.show();
});

workOrdersTable.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btnEdit")) {
        try {
            const workOrder = await getWorkOrderById(event.target.dataset.id);

            workOrderEquipment.value = workOrder.equipmentId;
            workOrderTechnician.value = workOrder.technicianId;
            workOrderDescription.value = workOrder.description;
            workOrderPriority.value = workOrder.priority;
            workOrderStartDate.value = workOrder.startDate ? workOrder.startDate.slice(0, 10) : "";
            workOrderExpectedDate.value = workOrder.startDate ? workOrder.expectedDeliveryDate.slice(0, 10) : "";
            workOrderStatus.value = workOrder.status;
            btnSaveWorkOrder.textContent = "Editar";
            btnSaveWorkOrder.dataset.id = workOrder.id;
            workOrderModalTitle.textContent = "Editar Ordem de Serviço";

            const isCompleted = workOrder.status === "Concluída";

            const inputWork = [
                workOrderEquipment,
                workOrderTechnician,
                workOrderDescription,
                workOrderPriority,
                workOrderStartDate,
                workOrderExpectedDate,
            ];

            inputWork.forEach(input => input.disabled = isCompleted);

            workOrderModal.show();
        } catch (err) {
            console.error("Erro ao carregar ordem de serviço: ", err);
            showNotify(err.message || "Não foi possível carregar a ordem de serviço.", "danger");
        }
    }

    if (event.target.classList.contains("btnComplete")) {
        const workOrderId = event.target.dataset.id;
        showConfirm(
            "Concluir manutenção",
            "Deseja marcar esta ordem de serviço como concluída?",
            async () => {
                try {
                    await updateWorkOrderStatus(workOrderId, "Concluída");
                    showNotify("Manutenção concluída com sucesso!", "success");
                    await loadWorkOrders();
                } catch (err) {
                    console.error("Erro ao concluir manutenção: ", err);
                    showNotify(err.message || "Não foi possível concluir a manutenção.", "danger");
                }
            }
        );
    }
});

workOrderModalElement.addEventListener("click", async (event) => {
    const btnTarget = event.target.closest("button");

    if (!btnTarget || (!btnTarget.textContent.includes("Editar") && !btnTarget.textContent.includes("Salvar"))) {
        return;
    }

    event.preventDefault();

    const workOrder = {
        equipmentId: Number(workOrderEquipment.value),
        technicianId: Number(workOrderTechnician.value),
        description: workOrderDescription.value.trim(),
        priority: workOrderPriority.value,
        startDate: workOrderStartDate.value ? workOrderStartDate.value : "",
        expectedDeliveryDate: workOrderExpectedDate.value ? workOrderExpectedDate.value : "",
        status: workOrderStatus.value
    };

    if (!workOrder.equipmentId || !workOrder.technicianId || !workOrder.description
        || !workOrder.startDate || !workOrder.expectedDeliveryDate) {
        showNotify("Preencha todos os campos obrigatórios.", "danger");
        return;
    }

    if (btnTarget.textContent.includes("Editar")) {
        try {
            await editWorkOrder(btnSaveWorkOrder.dataset.id, workOrder);
            showNotify("Ordem de serviço editada com sucesso!", "success");
            workOrderModal.hide();
            await loadWorkOrders();
        } catch (err) {
            console.error("Erro ao editar ordem de serviço: ", err);
            showNotify(err.message || "Não foi possível editar a ordem de serviço.", "danger");
        }
    }

    if (btnTarget.textContent.includes("Salvar")) {
        try {
            const result = await saveWorkOrder(workOrder);
            showNotify(result.message || "Ordem de serviço aberta com sucesso!", "success");
            workOrderModal.hide();
            await loadWorkOrders();
        } catch (err) {
            showNotify(err.message || "Não foi possível abrir a ordem de serviço.", "danger");
        }
    }
});

searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const result = allWorkOrders.filter(workOrder => (workOrder.equipment && workOrder.equipment.name.toLowerCase().includes(term)) ||
        (workOrder.technician && workOrder.technician.name.toLowerCase().includes(term)) ||
        workOrder.description.toLowerCase().includes(term) || workOrder.status.toLowerCase().includes(term)
    );

    workOrdersTableRender(result);
});
