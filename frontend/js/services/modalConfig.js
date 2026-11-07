/**
 * Config de parâmetros para exibir o modal de confirmação
 * @param {string} title Título da confirmação
 * @param {string} message Mensagem para o usuário
 * @param {function} onConfirm Função executada se o usuário confirmar
 */
function showConfirm(title, message, onConfirm) {
    // Remove qualquer modal de confirmação anterior para evitar duplicidade
    const existingModal = document.getElementById('confirmModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modalNew = document.getElementById('equipamentModel');

    // Oculta o outro modal se ele existir na tela
    if (modalNew) {
        modalNew.classList.add('d-none');
    }

    // Estrutura HTML do Modal do Bootstrap (removido o atributo inválido backdrop="false")
    const modalHTML = `
        <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
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
        // Executa a função passada por parâmetro (ex: apagar o item)
        onConfirm();
        
        // Fecha o modal programaticamente
        bsModal.hide();

        // Restaura a visibilidade do outro modal
        if (modalNew) {
            modalNew.classList.remove('d-none');
        }
    });

    // Garante que, ao fechar (por Cancelar, X ou clique fora), o fundo cinza suma de vez
    modalElement.addEventListener('hidden.bs.modal', () => {
        // Remove o elemento modal do DOM
        modalElement.remove();

        // Garante que o outro modal volte a aparecer caso o usuário tenha cancelado
        if (modalNew) {
            modalNew.classList.remove('d-none');
        }

        // LIMPEZA DE SEGURANÇA: Remove qualquer backdrop cinza preso na tela e destrava o scroll do body
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    });

    // Exibe o modal na tela
    bsModal.show();
}

window.showConfirm = showConfirm;