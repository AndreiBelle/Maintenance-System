import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { auth } from './services/firebase.js';
import { verifyTokenAndUser } from './services/authService.js';

const endPoint = 'http://localhost:3000/technicians';

const modalElement = document.querySelector('#technicianModal');
const modal = new bootstrap.Modal(modalElement);
const modalTitle = document.querySelector('#technicianModalTitle');

const btnNewTechnician = document.querySelector('#btnNewTechnician');
const btnSaveTechnician = document.querySelector('#btnSaveTechnician');
const btnDeleteTechnician = document.querySelector('#btnDeleteTechnician');

const technicianName = document.querySelector('#technicianName');
const technicianPosition = document.querySelector('#technicianPosition');
const technicianStatus = document.querySelector('#technicianStatus');

const techniciansTable = document.querySelector('#techniciansTable');
const activeTechniciansTotal = document.querySelector('#activeTechniciansTotal');
const logoutButton = document.querySelector('#logoutButton');
const userInfo = document.querySelector('#userInfo');

const searchInput = document.getElementById('searchInput');

let allTechnicians = [];

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = '../../login.html';
        return;
    }

    userInfo.textContent = `Bem vindo! ${user.email}`;
    loadTechnicians();
});

logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = '../../login.html';
    } catch (err) {
        console.error('Falha ao sair: ', err);
        window.showNotify('Não foi possível encerrar a sessão.', 'danger');
    }
});

async function loadTechnicians() {
    try {
        const idToken = await verifyTokenAndUser();
        const response = await fetch(endPoint, {
            headers: { Authorization: `Bearer ${idToken}` }
        });

        if (response.status === 401) {
            window.location.href = '../../login.html';
            return;
        }

        if (!response.ok) {
            throw new Error('Falha ao carregar técnicos.');
        }

        allTechnicians = await response.json();
        renderTechnicians(allTechnicians);
    } catch (err) {
        console.error('Erro ao carregar técnicos: ', err);
        window.showNotify(err.message || 'Não foi possível carregar os técnicos.', 'danger');
    }
}

function renderTechnicians(technicians) {
    techniciansTable.replaceChildren();

    if (technicians.length === 0) {
        techniciansTable.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum técnico encontrado.</td></tr>`;
        activeTechniciansTotal.textContent = 0;
        return;
    }

    technicians.forEach((technician) => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const positionCell = document.createElement('td');
        const statusCell = document.createElement('td');
        const actionCell = document.createElement('td');
        const editButton = document.createElement('button');

        nameCell.textContent = technician.name;
        positionCell.textContent = technician.position;
        statusCell.textContent = technician.status;
        editButton.type = 'button';
        editButton.className = 'btn btn-info btnEdit';
        editButton.dataset.id = technician.id;
        editButton.textContent = 'Editar';
        actionCell.appendChild(editButton);
        row.append(nameCell, positionCell, statusCell, actionCell);
        techniciansTable.appendChild(row);
    });

    activeTechniciansTotal.textContent = allTechnicians.filter(
        (technician) => technician.status === 'Ativo'
    ).length;
}

async function getTechnicianById(id) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(`${endPoint}/${id}`, {
        headers: { Authorization: `Bearer ${idToken}` }
    });

    if (!response.ok) {
        throw new Error('Não foi possível buscar os dados do técnico.');
    }

    return response.json();
}

async function saveTechnician(technician) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(endPoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(technician)
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Erro ao cadastrar o técnico.');
    }

    return result;
}

async function editTechnician(id, technician) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(`${endPoint}/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(technician)
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Erro ao editar o técnico.');
    }
}

async function deleteTechnician(id) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(`${endPoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${idToken}` }
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Erro ao excluir o técnico.');
    }

    await loadTechnicians();
}

btnNewTechnician.addEventListener('click', () => {
    technicianName.value = '';
    technicianPosition.value = '';
    technicianStatus.value = 'Ativo';
    btnSaveTechnician.textContent = 'Salvar';
    delete btnSaveTechnician.dataset.id;
    btnDeleteTechnician.classList.add('d-none');
    modalTitle.textContent = 'Novo Técnico';
    modal.show();
});

techniciansTable.addEventListener('click', async (event) => {
    const editButton = event.target.closest('.btnEdit');
    if (!editButton) {
        return;
    }

    try {
        const technician = await getTechnicianById(editButton.dataset.id);
        technicianName.value = technician.name;
        technicianPosition.value = technician.position;
        technicianStatus.value = technician.status;
        btnSaveTechnician.textContent = 'Editar';
        btnSaveTechnician.dataset.id = technician.id;
        btnDeleteTechnician.classList.remove('d-none');
        modalTitle.textContent = 'Editar Técnico';
        modal.show();
    } catch (err) {
        console.error('Erro ao carregar técnico: ', err);
        window.showNotify(err.message || 'Não foi possível carregar o técnico.', 'danger');
    }
});

btnSaveTechnician.addEventListener('click', async () => {
    const technician = {
        name: technicianName.value.trim(),
        position: technicianPosition.value.trim(),
        status: technicianStatus.value
    };

    if (!technician.name || !technician.position || !technician.status) {
        window.showNotify('Preencha todos os campos obrigatórios.', 'danger');
        return;
    }

    try {
        if (btnSaveTechnician.dataset.id) {
            await editTechnician(btnSaveTechnician.dataset.id, technician);
            window.showNotify('Técnico editado com sucesso!', 'success');
        } else {
            const result = await saveTechnician(technician);
            window.showNotify(result.message || 'Técnico cadastrado com sucesso!', 'success');
        }

        modal.hide();
        await loadTechnicians();
    } catch (err) {
        console.error('Erro ao salvar técnico: ', err);
        window.showNotify(err.message || 'Não foi possível salvar o técnico.', 'danger');
    }
});

btnDeleteTechnician.addEventListener('click', () => {
    const id = btnSaveTechnician.dataset.id;
    window.showConfirm(
        'Excluir Técnico',
        'Tem certeza que deseja apagar este técnico permanentemente?',
        async () => {
            try {
                await deleteTechnician(id);
                modal.hide();
                window.showNotify('Técnico apagado com sucesso!', 'success');
            } catch (err) {
                console.error('Erro ao excluir técnico: ', err);
                window.showNotify(err.message || 'Não foi possível excluir o técnico.', 'danger');
            }
        }
    );
});

searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    const result = allTechnicians.filter(technician => 
        technician.name.toLowerCase().includes(term) ||
        technician.position.toLowerCase().includes(term)
    );
    
    renderTechnicians(result);
});