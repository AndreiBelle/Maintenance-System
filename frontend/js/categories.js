import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { auth } from './services/firebase.js';
import { verifyTokenAndUser } from './services/authService.js';

const endPoint = 'http://localhost:3000/categories';

const categoryModalElement = document.getElementById("categoryModal");
const categoryModal = new bootstrap.Modal(categoryModalElement);
const categoryModalTitle = document.getElementById("categoryModalTitle");

const btnNewCategory = document.getElementById("btnNewCategory");
const btnSaveCategory = document.getElementById("btnSaveCategory");
const btnDeleteCategory = document.getElementById("btnDeleteCategory");
const logoutButton = document.getElementById("logoutButton");

const categoriesTable = document.getElementById("categoriesTable");
const categoriesTotal = document.getElementById("categoriesTotal");
const searchInput = document.getElementById("searchInput");
const userInfo = document.getElementById("userInfo");

const categoryName = document.getElementById("categoryName");
const categoryDescription = document.getElementById("categoryDescription");
const categoryPeriodicity = document.getElementById("categoryPeriodicity");

let allCategories = [];

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = '../../login.html';
        return;
    }

    userInfo.textContent = `Bem vindo! ${user.email}`;
    await loadCategories();
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

async function loadCategories() {
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
            throw new Error("Falha ao carregar categorias.");
        }

        allCategories = await response.json();
        categoriesTableRender(allCategories);
        dashboardRefresh(allCategories);
    } catch (err) {
        console.error("Erro ao carregar categorias: ", err);
        showNotify(err.message || "Não foi possível carregar as categorias.", "danger");
    }
}

async function saveCategory(category) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(endPoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Erro ao cadastrar a categoria.");
    }

    return result;
}

async function editCategory(id, category) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(`${endPoint}/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erro ao editar a categoria.");
    }
}

async function deleteCategory(id) {
    const idToken = await verifyTokenAndUser();
    const response = await fetch(`${endPoint}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erro ao excluir a categoria.");
    }

    await loadCategories();
}

function categoriesTableRender(categoriesList) {
    categoriesTable.innerHTML = "";

    if (categoriesList.length > 0) {
        categoriesList.forEach(category => {
            const row = document.createElement("tr");

            row.innerHTML = `<td>${category.name}</td>
                <td>${category.description}</td>
                <td>${category.preventivePeriodicity} dias</td>
                <td><button class="btn btn-info btnEdit" data-id="${category.id}">Editar</button></td>`;
            categoriesTable.appendChild(row);
        });
    } else {
        categoriesTable.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhuma categoria encontrada.</td></tr>`;
    }

    dashboardRefresh(allCategories);
}

function dashboardRefresh(categoriesList) {
    categoriesTotal.textContent = categoriesList.length;
    console.log("Cadastro de categorias atualizado!");
}

btnNewCategory.addEventListener("click", () => {
    delete btnSaveCategory.dataset.id;
    btnSaveCategory.textContent = "Salvar";
    btnDeleteCategory.classList.add("d-none");
    categoryModalTitle.textContent = "Nova Categoria";
    categoryName.value = "";
    categoryDescription.value = "";
    categoryPeriodicity.value = "";
    categoryModal.show();
});

categoriesTable.addEventListener("click", (event) => {
    if (event.target.classList.contains("btnEdit")) {
        const categoryId = Number(event.target.dataset.id);
        const category = allCategories.find(item => item.id === categoryId);

        if (!category) {
            showNotify("Categoria não encontrada.", "danger");
            return;
        }

        categoryName.value = category.name;
        categoryDescription.value = category.description;
        categoryPeriodicity.value = category.preventivePeriodicity;
        btnSaveCategory.textContent = "Editar";
        btnSaveCategory.dataset.id = category.id;
        btnDeleteCategory.classList.remove("d-none");
        categoryModalTitle.textContent = "Editar Categoria";
        categoryModal.show();
    }
});

categoryModalElement.addEventListener("click", async (event) => {
    const btnTarget = event.target.closest("button");

    if (!btnTarget || (!btnTarget.textContent.includes("Editar") && !btnTarget.textContent.includes("Salvar"))) {
        return;
    }

    event.preventDefault();

    const category = {
        name: categoryName.value.trim(),
        description: categoryDescription.value.trim(),
        preventivePeriodicity: categoryPeriodicity.value.trim()
    };

    if (!category.name || !category.description || !category.preventivePeriodicity) {
        showNotify("Preencha todos os campos obrigatórios.", "danger");
        return;
    }

    if (!Number.isSafeInteger(Number(category.preventivePeriodicity)) || Number(category.preventivePeriodicity) < 1) {
        showNotify("Informe a periodicidade em dias usando um número inteiro maior que zero.", "danger");
        return;
    }

    if (btnTarget.textContent.includes("Editar")) {
        try {
            await editCategory(btnSaveCategory.dataset.id, category);
            showNotify("Categoria editada com sucesso!", "success");
            categoryModal.hide();
            await loadCategories();
        } catch (err) {
            console.error("Erro ao editar categoria: ", err);
            showNotify(err.message || "Não foi possível editar a categoria.", "danger");
        }
    }

    if (btnTarget.textContent.includes("Salvar")) {
        try {
            const result = await saveCategory(category);
            showNotify(result.message || "Categoria cadastrada com sucesso!", "success");
            categoryModal.hide();
            await loadCategories();
        } catch (err) {
            console.error("Erro ao cadastrar categoria: ", err);
            showNotify(err.message || "Não foi possível cadastrar a categoria.", "danger");
        }
    }
});

btnDeleteCategory.addEventListener("click", () => {
    const categoryId = btnSaveCategory.dataset.id;
    showConfirm(
        "Excluir Categoria",
        "Tem certeza que deseja apagar esta categoria?",
        async () => {
            try {
                await deleteCategory(categoryId);
                categoryModal.hide();
                showNotify("Categoria apagada com sucesso!", "success");
            } catch (err) {
                console.error("Erro ao excluir categoria: ", err);
                showNotify(err.message || "Não foi possível excluir a categoria.", "danger");
            }
        }
    );
});

searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const result = allCategories.filter(category =>
        category.name.toLowerCase().includes(term) ||
        category.description.toLowerCase().includes(term)
    );

    categoriesTableRender(result);
});
