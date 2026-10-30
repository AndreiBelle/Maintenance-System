/**
 * Config de parâmetros para exbir o modal de confirmação (Criando tipo um método)
 * @param {string} title titulo da confirmacao
 * @param {string} message mensagem para o usuário
 * @param {function} onConfirm passa a função que vai executar se o usuário clicar em não
 */
function showConfirm(title, message, onConfirm) {
    // Remove qualquer modal de confirmação anterior para evitar duplicidade
    const existingModal = document.getElementById('confirmModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modalNew = document.getElementById('equipamentModel');

    modalNew.classList.add('d-none')

    // Estrutura HTML do Modal do Bootstrap
    const modalHTML = `
        <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true" backdrop="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="confirmModalLabel">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>${title}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="fs-6 mb-0">${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="id-btn-confirm btn btn-danger">Sim, apagar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insere o modal no final do corpo da página
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalElement = document.getElementById('confirmModal');
    const bsModal = new bootstrap.Modal(modalElement);

    // Escuta o clique no botão de confirmação ("Sim, apagar")
    const confirmBtn = modalElement.querySelector('.id-btn-confirm');
    confirmBtn.addEventListener('click', () => {
        // Executa a função que o usuário passou (ex: apagar o item)
        onConfirm();
        // Fecha o modal automaticamente
        bsModal.hide();
        modalNew.classList.remove('d-none');
    });

    // Remove o modal do HTML assim que ele terminar de fechar para manter a página limpa
    modalElement.addEventListener('hidden.bs.modal', () => {
        modalElement.remove();
    });

    // Exibe o modal na tela
    bsModal.show();
}

window.showConfirm = showConfirm;