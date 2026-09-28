const activeTotal = document.querySelector("#activesTotal");
const preventiveTotal = document.querySelector("#preventiveTotal");
const maintenceEquipamentsTotal = document.querySelector("#maintenceEquipamentsTotal");
const searchInput = document.getElementById("searchInput");
import { equipaments } from '../js/bd.js'


console.log("Carregou o Dashboard");

const systemName = "Sistema de Controle de Manuteção";

let activeEquipaments = 58;
let manutenceEquipaments = 5;

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

