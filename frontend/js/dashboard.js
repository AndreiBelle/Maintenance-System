const activeTotal = document.querySelector("#activesTotal");
const preventiveTotal = document.querySelector("#preventiveTotal");
const maintenceEquipamentsTotal = document.querySelector("#maintenceEquipamentsTotal");
const searchInput = document.getElementById("searchInput");

console.log("Carregou o Dashboard");

const systemName = "Sistema de Controle de Manuteção";

let activeEquipaments = 58;
let manutenceEquipaments = 5;

const equipaments = [
    {id:1,
    name: "Compressor",
    local: "Oficina",
    status: "active",
    patrimony: "12-PP"
  },
  {id:2,
    name: "Gerador",
    local: "Casa de Máquina",
    status: "maintence",
    patrimony: "65-PP"
  },
  {id:3,
    name: "Torno",
    local: "Oficina",
    status: "active",
    patrimony: "1-PP"
  }
];

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

