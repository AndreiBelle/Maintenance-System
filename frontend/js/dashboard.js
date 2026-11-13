import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { auth } from "./services/firebase.js";
import { verifyTokenAndUser } from "./services/authService.js";

const endPoint = 'http://localhost:3000/equipments';

const activeTotal = document.querySelector("#activesTotal");
const preventiveTotal = document.querySelector("#preventiveTotal");
const corretiveTotal = document.querySelector("#corretiveTotal");
const inactiveTotal = document.querySelector('#inactiveTotal');

const searchInput = document.getElementById("searchInput");
const logoutButton = document.querySelector("#logoutButton");
const userInfo = document.querySelector("#userInfo");
const equipamentsTable = document.querySelector("#equipmentsTable");

let allEquipments = [];

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = '../login.html';
        return;
    }

    userInfo.textContent = `Bem vindo! ${user.email}`;
    await loadAndInitializeData(); 
});

logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = "../login.html";
    } catch (err) {
        console.error("falha ao sair: ", err);
    }
});

async function loadAndInitializeData() {
    try {
        const idToken = await verifyTokenAndUser();
        
        const response = await fetch(endPoint, {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });

        if (response.status === 401) {
            window.location.href = "./login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Falha ao carregar equipamentos");
        }

        allEquipments = await response.json();

        dashboardRefresh(allEquipments);
        equipamentsTableRender(allEquipments);

    } catch (err) {
        console.error("Ocorreu um erro interno: ", err);
    }
}

function dashboardRefresh(data) {
    activeTotal.textContent = data.filter(eq => eq.status !== "Inactive").length;
    inactiveTotal.textContent = data.filter(eq => eq.status === "Inactive").length;
    preventiveTotal.textContent = data.filter(eq => eq.status === "Preventive").length;
    corretiveTotal.textContent = data.filter(eq => eq.status === "Corrective").length;
}

function equipamentsTableRender(data) {
    equipamentsTable.innerHTML = "";

    if (data.length === 0) {
        equipamentsTable.innerHTML = `<tr><td colspan="3" style="text-align: center;">Nenhum equipamento encontrado.</td></tr>`;
        return;
    }

    data.forEach(equipment => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${equipment.name}</td>
            <td>${equipment.local}</td>
            <td>${equipment.status}</td>
        `;
        equipamentsTable.appendChild(row);
    });
}

searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    const result = allEquipments.filter(equipment => 
        equipment.name.toLowerCase().includes(term)
    );
    
    equipamentsTableRender(result);
});