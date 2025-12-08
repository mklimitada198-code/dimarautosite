/**
 * LOADING STATES & USER FEEDBACK
 * Sistema centralizado para indicadores de carregamento e feedback ao usuário
 */

(function() {
    'use strict';

    // ==================== LOADING SPINNER ====================
    /**
     * Cria um spinner de carregamento
     * @param {string} size - 'small' | 'medium' | 'large'
     * @returns {HTMLElement}
     */
    function createSpinner(size = 'medium') {
        const spinner = document.createElement('div');
        spinner.className = `loading-spinner ${size}`;
        spinner.innerHTML = `
            <div class="spinner-circle"></div>
            <style>
                .loading-spinner {
                    display: inline-block;
                    position: relative;
                }
                .loading-spinner.small { width: 20px; height: 20px; }
                .loading-spinner.medium { width: 40px; height: 40px; }
                .loading-spinner.large { width: 60px; height: 60px; }
                
                .spinner-circle {
                    width: 100%;
                    height: 100%;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #FF6B00;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        return spinner;
    }

    /**
     * Mostra spinner em um container
     * @param {string} containerId - ID do container
     * @param {string} message - Mensagem opcional
     */
    function showLoadingInContainer(containerId, message = 'Carregando...') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                ${createSpinner('large').outerHTML}
                <p style="margin-top: 1rem; color: #666;">${message}</p>
            </div>
        `;
    }

    /**
     * Mostra overlay de carregamento em tela cheia
     */
    function showFullscreenLoading(message = 'Carregando...') {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        overlay.innerHTML = `
            ${createSpinner('large').outerHTML}
            <p style="color: white; margin-top: 1rem; font-size: 1.1rem;">${message}</p>
        `;
        document.body.appendChild(overlay);
    }

    /**
     * Remove overlay de carregamento
     */
    function hideFullscreenLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // ==================== TOAST NOTIFICATIONS ====================
    /**
     * Mostra notificação toast
     * @param {string} message - Mensagem
     * @param {string} type - 'success' | 'error' | 'warning' | 'info'
     * @param {number} duration - Duração em ms (0 = sem auto-close)
     */
    function showToast(message, type = 'info', duration = 3000) {
        // Criar container de toasts se não existir
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(toastContainer);
        }

        // Criar toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };

        toast.style.cssText = `
            background: white;
            border-left: 4px solid ${colors[type]};
            padding: 1rem 1.5rem;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            min-width: 300px;
            max-width: 500px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideIn 0.3s ease-out;
        `;

        toast.innerHTML = `
            <span style="font-size: 1.5rem;">${icons[type]}</span>
            <span style="flex: 1; color: #333;">${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #999;">×</button>
            <style>
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            </style>
        `;

        toastContainer.appendChild(toast);

        // Auto-remover
        if (duration > 0) {
            setTimeout(() => {
                toast.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    }

    // ==================== EMPTY STATES ====================
    /**
     * Mostra estado vazio (sem resultados)
     * @param {string} containerId - ID do container
     * @param {string} title - Título
     * @param {string} message - Mensagem
     * @param {string} icon - Emoji/ícone
     * @param {object} action - Ação opcional {text, callback}
     */
    function showEmptyState(containerId, title, message, icon = '🔍', action = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let actionHTML = '';
        if (action) {
            actionHTML = `
                <button onclick="${action.callback}" style="
                    margin-top: 1.5rem;
                    padding: 0.75rem 2rem;
                    background: #FF6B00;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                ">
                    ${action.text}
                </button>
            `;
        }

        container.innerHTML = `
            <div style="
                text-align: center;
                padding: 4rem 2rem;
                color: #666;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${icon}</div>
                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #333;">${title}</h3>
                <p style="font-size: 1rem; margin-bottom: 1rem;">${message}</p>
                ${actionHTML}
            </div>
        `;
    }

    // ==================== ERROR STATES ====================
    /**
     * Mostra estado de erro
     * @param {string} containerId - ID do container
     * @param {string} message - Mensagem de erro
     * @param {function} retryCallback - Callback para tentar novamente
     */
    function showErrorState(containerId, message = 'Algo deu errado. Tente novamente.', retryCallback = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let retryButton = '';
        if (retryCallback) {
            const callbackName = `retry_${Date.now()}`;
            window[callbackName] = retryCallback;
            retryButton = `
                <button onclick="${callbackName}()" style="
                    margin-top: 1.5rem;
                    padding: 0.75rem 2rem;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                ">
                    🔄 Tentar Novamente
                </button>
            `;
        }

        container.innerHTML = `
            <div style="
                text-align: center;
                padding: 3rem 2rem;
                color: #e74c3c;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Ops! Algo deu errado</h3>
                <p style="font-size: 1rem; color: #666;">${message}</p>
                ${retryButton}
            </div>
        `;
    }

    // ==================== SKELETON LOADERS ====================
    /**
     * Cria skeleton loader para cards de produto
     * @param {number} count - Quantidade de skeletons
     * @returns {string} HTML dos skeletons
     */
    function createProductSkeleton(count = 4) {
        const skeletonHTML = `
            <div class="product-skeleton" style="
                background: white;
                border-radius: 8px;
                padding: 1rem;
                animation: pulse 1.5s ease-in-out infinite;
            ">
                <div style="
                    width: 100%;
                    height: 200px;
                    background: #e0e0e0;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                "></div>
                <div style="
                    width: 80%;
                    height: 20px;
                    background: #e0e0e0;
                    border-radius: 4px;
                    margin-bottom: 0.5rem;
                "></div>
                <div style="
                    width: 60%;
                    height: 20px;
                    background: #e0e0e0;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                "></div>
                <div style="
                    width: 50%;
                    height: 30px;
                    background: #e0e0e0;
                    border-radius: 4px;
                "></div>
            </div>
            <style>
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
        `;

        return Array(count).fill(skeletonHTML).join('');
    }

    // ==================== EXPORTAR FUNÇÕES ====================
    window.loadingStates = {
        showLoadingInContainer,
        showFullscreenLoading,
        hideFullscreenLoading,
        showToast,
        showEmptyState,
        showErrorState,
        createProductSkeleton,
        createSpinner
    };

    console.log('✅ Loading States system initialized');
})();

