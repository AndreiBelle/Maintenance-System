/**
 * Config para exibir a mensagem
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} type - O tipo ('success', 'warning', 'danger', 'info').
 */

function showNotify(message, type = 'success') {
    //Configuração para os tipos de notificações, criados os básicos
    const config = {
        success: { bg: 'bg-success text-white', icon: 'bi-check-circle-fill', btnClose: 'btn-close-white' },
        warning: { bg: 'bg-warning text-dark', icon: 'bi-exclamation-triangle-fill', btnClose: '' },
        danger:  { bg: 'bg-danger text-white', icon: 'bi-x-circle-fill', btnClose: 'btn-close-white' },
        info:    { bg: 'bg-info text-dark', icon: 'bi-info-circle-fill', btnClose: '' }
    };

    const currentConfig = config[type] || config.success;

    // Cria o container global de toasts se ele ainda não existir na página
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1080';
        document.body.appendChild(container);
    }

    // ID único para cada toast
    const toastId = 'toast_' + Date.now();

    // Estrutura HTML do Toast do Bootstrap
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center ${currentConfig.bg} border-0 shadow-sm" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center">
                    <i class="bi ${currentConfig.icon} me-2 fs-5"></i>
                    <div>${message}</div>
                </div>
                <button type="button" class="btn-close ${currentConfig.btnClose} me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    // Insere o toast no container
    container.insertAdjacentHTML('beforeend', toastHTML);

    // Inicializa e exibe o toast usando a API do Bootstrap (fecha sozinho após 4 segundos/4000ms)
    const toastElement = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastElement, { delay: 4000 });
    bsToast.show();

    // Remove o elemento do DOM após ele desaparecer completamente para não acumular lixo
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

window.showNotify = showNotify;