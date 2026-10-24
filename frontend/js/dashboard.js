import { signOut } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { auth } from "./firebase.js";

const activeTotal = document.querySelector("#activesTotal");
const preventiveTotal = document.querySelector("#preventiveTotal");
const corretiveTotal = document.querySelector("#corretiveTotal");
const inactiveTotal = document.querySelector('#inactiveTotal')

const searchInput = document.getElementById("searchInput");
const logoutButton = document.querySelector("#logoutButton");
const userInfo = document.querySelector("#userInfo");


onAuthStateChanged(auth, (user)=> {
    if(!user) {
        window.location.href = '../login.html';
        return;
    }

    userInfo.textContent = `Bem vindo! ${user.email}`
})

logoutButton.addEventListener('click', async (event) => {
    try{
        signOut(auth)
        window.location.href = "../login.html"
    } catch (err) {
        console.error("falha ao sair: ", err);
    }
})


async function dashboardRefresh() {
    
    const data = await fetch('http://localhost:3000/equipments');
    const response = await data.json();

    console.log(response);

    activeTotal.textContent = actives;
    corretiveTotal.textContent = inMaintence;

    console.log("Dashboard Atualizado!")
}

dashboardRefresh()



searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLocaleLowerCase();

    const result = equipaments.filter(equipament => 
        equipament.name.toLocaleLowerCase().includes(term)

    )
    equipamentsTableRender(result)
})