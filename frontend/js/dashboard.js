import { equipaments } from '../js/bd.js'
import { signOut } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js';
import { auth } from "./firebase";
const activeTotal = document.querySelector("#activesTotal");
const preventiveTotal = document.querySelector("#preventiveTotal");
const maintenceEquipamentsTotal = document.querySelector("#maintenceEquipamentsTotal");
const searchInput = document.getElementById("searchInput");
const logoutButton = document.querySelector("#logoutButton");
const userInfo = document.querySelector("#userInfo");

onAuthStateChanged(auth, (user)=> {
    if(!user) {
        window.location.href = './login.html';
        return;
    }

    userInfo.textContent = `Usuário: ${user.email}`
})

logoutButton.addEventListener('click', async (event) => {
    try{
        signOut(auth)
        window.location.href = "./login.html"
    } catch (err) {
        console.error("falha ao sair: ", err);
    }
})

console.log("Carregou o Dashboard");

const systemName = "Sistema de Controle de Manuteção";

preventiveTotal.textContent = 1


function dashboardRefresh() {
    const actives = equipaments.filter(equipament => equipament.status === "active").length;
    
    const inMaintence = equipaments.filter(equipament => equipament.status === "maintence").length;

    activeTotal.textContent = actives;
    maintenceEquipamentsTotal.textContent = inMaintence;

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