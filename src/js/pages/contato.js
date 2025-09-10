// frontend/src/js/pages/contato.js

import { API_BASE_URL } from '../config.js';

// Função auxiliar para criar alertas do Bootstrap
function createAlert(message, type) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    return wrapper;
}

export default function initContatoPage() {
    const form = document.getElementById('formContato');
    const alertPlaceholder = document.getElementById('alert-placeholder');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        // Previne o comportamento padrão do formulário (que seria recarregar a página)
        event.preventDefault();

        // Pega o texto original do botão e o desabilita para evitar cliques duplos
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Enviando...
        `;
        
        // Limpa alertas antigos
        alertPlaceholder.innerHTML = '';

        // Cria um objeto com os dados do formulário
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Envia os dados para a nossa API do backend
            const response = await fetch(`${API_BASE_URL}/api/contato`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                // Se a API retornar um erro (ex: 400, 500), lança uma exceção
                throw new Error(result.mensagem || 'Ocorreu um erro.');
            }

            // Sucesso! Mostra uma mensagem positiva e reseta o formulário
            alertPlaceholder.append(createAlert(result.mensagem, 'success'));
            form.reset();

        } catch (error) {
            // Erro! Mostra uma mensagem de falha
            console.error('Erro ao enviar formulário:', error);
            alertPlaceholder.append(createAlert(error.message, 'danger'));
        } finally {
            // Reabilita o botão com o texto original, independentemente do resultado
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}