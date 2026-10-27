import { signOut } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { auth } from "./firebase.js";

const endPoint = 'http://localhost:3000/equipments';

const activeTotal = document.querySelector("#activesTotal");
const preventiveTotal = document.querySelector("#preventiveTotal");
const corretiveTotal = document.querySelector("#corretiveTotal");
const inactiveTotal = document.querySelector('#inactiveTotal')

const searchInput = document.getElementById("searchInput");
const logoutButton = document.querySelector("#logoutButton");
const userInfo = document.querySelector("#userInfo");
const equipamentsTable = document.querySelector("#equipmentsTable");



async function loadEquipments() {
    try{

        const currentUser = auth.currentUser;
        
        if(!currentUser) {
            window.location.href = './login.html';
            return;
        }
        const idToken = await currentUser.getIdToken();
        
        const response = await fetch(endPoint,{
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });

        if (response.status == 401) {
            window.location.href = "./login.html";
            return;
        }

        if(!response.ok) {
            throw new Error("Falha ao carregar equipamentos")
        }

        const equipaments = await response.json();

        equipamentsTableRender(equipaments);

    } catch (err) {
        console.error("Erro ao caregar equipamentos: ", err);
    }
}



onAuthStateChanged(auth, (user)=> {
    if(!user) {
        window.location.href = '../login.html';
        return;
    }

    loadEquipments();
    dashboardRefresh()
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
    const currentUser = auth.currentUser;
        
    if(!currentUser) {
        window.location.href = './login.html';
        return;
    }
    const idToken = await currentUser.getIdToken();

    try{
        const data = await fetch(endPoint,{
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });
;
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



searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLocaleLowerCase();

    const result = equipaments.filter(equipament => 
        equipament.name.toLocaleLowerCase().includes(term)

    )
    equipamentsTableRender(result)
})

async function equipamentsTableRender() {
    equipamentsTable.innerHTML = "";
    const currentUser = auth.currentUser;
        
        if(!currentUser) {
            window.location.href = './login.html';
            return;
        }
        const idToken = await currentUser.getIdToken();

    try{

        const data = await fetch(endPoint,{
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });
;
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
