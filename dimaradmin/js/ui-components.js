/**
 * Loading States & Toast Notifications - Dimar Admin
 * Sistema global de loading e notificações
 * 
 * @version 1.0.0
 * @date 2024-12-10
 */

(function () {
    'use strict';

    // ==================== LOADING OVERLAY ====================

    const loadingHTML = `
        <div id="globalLoadingOverlay" class="loading-overlay" style="display: none;">
            <div class="loading-content">
                <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <p id="loadingMessage" class="loading-text">Carregando...</p>
            </div>
        </div>
    `;

    const loadingStyles = `
        <style id="loadingStyles">
            .loading-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
                z-index: 99998;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .loading-content {
                background: white;
                padding: 40px 60px;
                border-radius: 16px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            
            .loading-spinner {
                position: relative;
                width: 60px;
                height: 60px;
                margin: 0 auto 20px;
            }
            
            .spinner-ring {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 4px solid transparent;
                border-top-color: #ff6b00;
                border-radius: 50%;
                animation: spin 1.2s linear infinite;
            }
            
            .spinner-ring:nth-child(2) {
                width: 80%;
                height: 80%;
                top: 10%;
                left: 10%;
                border-top-color: #1a1a1a;
                animation-duration: 0.9s;
                animation-direction: reverse;
            }
            
            .spinner-ring:nth-child(3) {
                width: 60%;
                height: 60%;
                top: 20%;
                left: 20%;
                border-top-color: #ff6b00;
                animation-duration: 0.6s;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .loading-text {
                margin: 0;
                color: #2c3e50;
                font-size: 16px;
                font-weight: 500;
            }
            
            /* Toast Notifications */
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            }
            
            .toast {
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                animation: slideIn 0.3s ease-out;
                cursor: pointer;
                transition: transform 0.2s, opacity 0.2s;
            }
            
            .toast:hover {
                transform: translateX(-5px);
            }
            
            .toast.hiding {
                animation: slideOut 0.3s ease-in forwards;
            }
            
            .toast-success {
                background: linear-gradient(135deg, #2ecc71, #27ae60);
                color: white;
            }
            
            .toast-error {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
            }
            
            .toast-warning {
                background: linear-gradient(135deg, #f39c12, #e67e22);
                color: white;
            }
            
            .toast-info {
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
            }
            
            .toast-icon {
                font-size: 20px;
                flex-shrink: 0;
            }
            
            .toast-message {
                flex: 1;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 18px;
                cursor: pointer;
                opacity: 0.7;
                padding: 0;
                line-height: 1;
            }
            
            .toast-close:hover {
                opacity: 1;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            /* Table Loading Skeleton */
            .table-skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
                border-radius: 4px;
            }
            
            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            .skeleton-row td {
                padding: 12px;
            }
            
            .skeleton-cell {
                height: 20px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
                border-radius: 4px;
            }
            
            .skeleton-image {
                width: 50px;
                height: 50px;
                border-radius: 8px;
            }
        </style>
    `;

    const toastContainerHTML = `<div id="toastContainer" class="toast-container"></div>`;

    // ==================== LOADING MANAGER ====================

    const LoadingManager = {
        overlay: null,
        messageEl: null,

        init() {
            if (!document.getElementById('loadingStyles')) {
                document.head.insertAdjacentHTML('beforeend', loadingStyles);
            }
            if (!document.getElementById('globalLoadingOverlay')) {
                document.body.insertAdjacentHTML('beforeend', loadingHTML);
            }
            this.overlay = document.getElementById('globalLoadingOverlay');
            this.messageEl = document.getElementById('loadingMessage');
        },

        show(message = 'Carregando...') {
            if (!this.overlay) this.init();
            this.messageEl.textContent = message;
            this.overlay.style.display = 'flex';
        },

        hide() {
            if (this.overlay) {
                this.overlay.style.display = 'none';
            }
        },

        async wrap(promise, message = 'Processando...') {
            this.show(message);
            try {
                const result = await promise;
                this.hide();
                return result;
            } catch (error) {
                this.hide();
                throw error;
            }
        }
    };

    // ==================== TOAST MANAGER ====================

    const ToastManager = {
        container: null,

        init() {
            if (!document.getElementById('toastContainer')) {
                document.body.insertAdjacentHTML('beforeend', toastContainerHTML);
            }
            this.container = document.getElementById('toastContainer');
        },

        show(message, type = 'info', duration = 5000) {
            if (!this.container) this.init();

            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <span class="toast-icon">${icons[type]}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.remove()">×</button>
            `;

            this.container.appendChild(toast);

            // Click to dismiss
            toast.addEventListener('click', (e) => {
                if (e.target.className !== 'toast-close') {
                    this.dismiss(toast);
                }
            });

            // Auto dismiss
            if (duration > 0) {
                setTimeout(() => this.dismiss(toast), duration);
            }

            return toast;
        },

        dismiss(toast) {
            if (toast && toast.parentElement) {
                toast.classList.add('hiding');
                setTimeout(() => toast.remove(), 300);
            }
        },

        success(message, duration = 4000) {
            return this.show(message, 'success', duration);
        },

        error(message, duration = 6000) {
            return this.show(message, 'error', duration);
        },

        warning(message, duration = 5000) {
            return this.show(message, 'warning', duration);
        },

        info(message, duration = 4000) {
            return this.show(message, 'info', duration);
        }
    };

    // ==================== TABLE SKELETON ====================

    function showTableSkeleton(tableBodyId, columns = 4, rows = 5) {
        const tbody = document.getElementById(tableBodyId);
        if (!tbody) return;

        let html = '';
        for (let i = 0; i < rows; i++) {
            html += '<tr class="skeleton-row">';
            for (let j = 0; j < columns; j++) {
                if (j === 0) {
                    html += '<td><div class="skeleton-cell skeleton-image"></div></td>';
                } else {
                    const width = 50 + Math.random() * 50;
                    html += `<td><div class="skeleton-cell" style="width: ${width}%"></div></td>`;
                }
            }
            html += '</tr>';
        }
        tbody.innerHTML = html;
    }

    // ==================== INITIALIZE ====================

    function initialize() {
        LoadingManager.init();
        ToastManager.init();
        console.log('✅ Loading States & Toast System initialized');
    }

    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // ==================== EXPORTS ====================

    window.LoadingManager = LoadingManager;
    window.ToastManager = ToastManager;
    window.showTableSkeleton = showTableSkeleton;

})();
