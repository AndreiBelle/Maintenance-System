const techniciansTable = document.querySelector('#techniciansTable');
const btnNewTechnicians = document.querySelector('#btnNewTechnicians');
const technicianModel = document.querySelector('#technicianModel');
const modal = new bootstrap.Modal(technicianModel);

const technicians = [
    {id:1,
    name: "Joao",
    cargo: "Mecânico II",
    status: "Em atendimento",
    setor_resp: "Oficina"
  },
  {id:2,
    name: "Pedro",
    cargo: "Eletricista I",
    status: "Em Atendimento",
    setor_resp: "Casa de Máquina"

  },
  {id:3,
    name: "Paulo",
    cargo: "Tec. Automação II",
    status: "Oficina",
    setor_resp: "Peru A1"
  }
];

const techniciansTableRender = (list) => {
    techniciansTable.innerHTML = "";

    list.forEach(technician => {
        
        const row = document.createElement('tr');

        row.innerHTML = `<td>${technician.name}</td>
        <td>${technician.setor_resp}</td>
        <td>${technician.status}</td>
        <td> <button class="btn btn-danger"
        onclick="equipamentDelete(${technician.id})">Excluir</button>
        </td>
        `

        techniciansTable.appendChild(row);
    });
}

techniciansTableRender(technicians)

btnNewTechnicians.addEventListener('click', () => {
    modal.show();
})