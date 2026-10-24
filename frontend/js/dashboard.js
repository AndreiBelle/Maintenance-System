import { signOut } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { auth } from "./firebase.js";

const getEquipments = 'http://localhost:3000/equipments';

const activeTotal = document.querySelector("#activesTotal");
const preventiveTotal = document.querySelector("#preventiveTotal");
const corretiveTotal = document.querySelector("#corretiveTotal");
const inactiveTotal = document.querySelector('#inactiveTotal')

const searchInput = document.getElementById("searchInput");
const logoutButton = document.querySelector("#logoutButton");
const userInfo = document.querySelector("#userInfo");
const equipamentsTable = document.querySelector("#equipmentsTable");


onAuthStateChanged(auth, (user)=> {
    if(!user) {
        window.location.href = '../login.html';
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


async function dashboardRefresh() {

    try{
        const data = await fetch(getEquipments);
        const response = await data.json();

        activeTotal.textContent = response.filter(response => response.status !== "Inactive").length;
        inactiveTotal.textContent = response.filter(response => response.status == "Inactive").length;
        preventiveTotal.textContent = response.filter(response => response.status == "Preventive").length;
        corretiveTotal.textContent = response.filter(response => response.status == "Corrective").length;

        console.log(response);

        console.log("Dashboard Atualizado!")

    } catch (err) {
        console.error("Occoreu um erro interno, por favor tente novamente mais tarde: "+err)
    }
}
dashboardRefresh()



searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLocaleLowerCase();

    const result = equipaments.filter(equipament => 
        equipament.name.toLocaleLowerCase().includes(term)

    )
    equipamentsTableRender(result)
})

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
        `
 
        equipamentsTable.appendChild(row);
        });  

        dashboardRefresh();
    } catch (err) {
        console.error("Occoreu um erro interno, por favor tente novamente mais tarde: "+err)
    }
}
equipamentsTableRender();