/**
 * Cart Page Script (REFATORADO v4 - Event Delegation)
 * Gerenciamento da interface da página do carrinho
 * Usa delegação de eventos para melhor robustez
 */

(function () {
    'use strict';

    console.log('🛒 cart-page.js v4 (Event Delegation) carregado');

    // Aguardar DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Aguardar cart.js carregar
        checkCartAndInit();
    }

    function checkCartAndInit() {
        if (!window.cart) {
            console.log('⏳ Aguardando cart.js...');
            setTimeout(checkCartAndInit, 200);
            return;
        }

        console.log('✅ Initializing cart page v4...');

        // Configurar listeners
        setupEventDelegation();
        setupStaticListeners();

        // Atualizar display inicial
        updateCartDisplay();

        // Escutar mudanças no carrinho
        window.addEventListener('cartUpdated', updateCartDisplay);
    }

    /**
     * DELEGAÇÃO DE EVENTOS - Captura todos os cliques no container de itens
     */
    function setupEventDelegation() {
        const container = document.getElementById('cartItemsList');
        if (!container) return;

        container.addEventListener('click', function (e) {
            // Encontrar o botão clicado
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            e.preventDefault();
            e.stopPropagation();

            const action = btn.dataset.action;
            const itemId = btn.dataset.itemId;

            console.log(`🔄 Ação: ${action}, Item ID: ${itemId}`);

            if (!itemId) {
                console.error('❌ Item ID não encontrado');
                return;
            }

            switch (action) {
                case 'increase':
                    handleQuantityChange(itemId, 1);
                    break;
                case 'decrease':
                    handleQuantityChange(itemId, -1);
                    break;
                case 'remove':
                    handleRemoveItem(itemId);
                    break;
                default:
                    console.warn('Ação desconhecida:', action);
            }
        });

        // Listener para input de quantidade (change)
        container.addEventListener('change', function (e) {
            if (e.target.classList.contains('qty-input')) {
                const itemId = e.target.dataset.itemId;
                const newQty = parseInt(e.target.value, 10);

                if (itemId && !isNaN(newQty)) {
                    handleSetQuantity(itemId, newQty);
                }
            }
        });

        console.log('✅ Event delegation configurado');
    }

    function setupStaticListeners() {
        // Botão Limpar Carrinho
        const clearBtn = document.getElementById('clearCartBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                handleClearCart();
            });
        }

        // Botão Aplicar Cupom
        const applyBtn = document.querySelector('.btn-apply');
        if (applyBtn) {
            applyBtn.addEventListener('click', function () {
                handleApplyCoupon();
            });
        }

        // Cupom com Enter
        const couponInput = document.getElementById('couponInput');
        if (couponInput) {
            couponInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    handleApplyCoupon();
                }
            });
        }

        // Botão Checkout
        const checkoutBtn = document.querySelector('.btn-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function () {
                handleCheckout();
            });
        }
    }

    // ============ HANDLERS ============

    function handleQuantityChange(itemId, delta) {
        console.log(`📊 handleQuantityChange: ${itemId}, delta: ${delta}`);

        const items = window.cart.getItems();
        console.log('📦 Itens no carrinho:', items.map(i => ({ id: i.id, qty: i.quantity })));

        // Encontrar item - comparar como strings
        const item = items.find(i => String(i.id) === String(itemId));

        if (!item) {
            console.error(`❌ Item não encontrado: ${itemId}`);
            console.log('IDs disponíveis:', items.map(i => i.id));
            return;
        }

        const newQty = item.quantity + delta;
        console.log(`📈 Nova quantidade: ${newQty}`);

        if (newQty > 0 && newQty <= 99) {
            window.cart.updateQuantity(itemId, newQty);
            updateCartDisplay();
        } else if (newQty <= 0) {
            handleRemoveItem(itemId);
        }
    }

    function handleSetQuantity(itemId, quantity) {
        console.log(`📊 handleSetQuantity: ${itemId}, qty: ${quantity}`);

        if (quantity > 0 && quantity <= 99) {
            window.cart.updateQuantity(itemId, quantity);
            updateCartDisplay();
        } else if (quantity <= 0) {
            handleRemoveItem(itemId);
        } else {
            updateCartDisplay(); // Reset para valor válido
        }
    }

    function handleRemoveItem(itemId) {
        console.log(`🗑️ handleRemoveItem: ${itemId}`);

        // Usar modal customizado em vez de confirm() para melhor UX e compatibilidade
        showConfirmModal(
            'Remover Item',
            'Deseja remover este item do carrinho?',
            function () {
                // Callback para quando usuário confirma
                console.log('✅ Confirmado - removendo item:', itemId);
                window.cart.removeItem(itemId);
                updateCartDisplay();
                showToast('Item removido do carrinho', 'info');
            }
        );
    }

    function handleClearCart() {
        if (window.cart && window.cart.items.length > 0) {
            showConfirmModal(
                'Limpar Carrinho',
                'Deseja realmente remover todos os itens do carrinho?',
                function () {
                    window.cart.items = [];
                    window.cart.saveToStorage();
                    window.cart.updateCartBadge();
                    updateCartDisplay();
                    showToast('Carrinho limpo!', 'info');
                }
            );
        }
    }

    function handleApplyCoupon() {
        const input = document.getElementById('couponInput');
        if (!input) return;

        const code = input.value.trim().toUpperCase();
        if (!code) {
            showToast('Digite um código de cupom', 'warning');
            return;
        }

        const result = window.cart.applyCoupon(code);
        if (result) {
            input.value = '';
            showToast('✅ Cupom aplicado com sucesso!', 'success');
            updateCartDisplay();
        } else {
            showToast('❌ Cupom inválido', 'error');
        }
    }

    function handleCheckout() {
        const items = window.cart.getItems();
        if (items.length === 0) {
            showToast('Adicione produtos primeiro!', 'warning');
            return;
        }
        showToast('Redirecionando para checkout...', 'info');
        // TODO: Implementar checkout
    }

    // ============ RENDER ============

    function updateCartDisplay() {
        if (!window.cart) return;

        const items = window.cart.getItems();
        const isEmpty = items.length === 0;

        console.log(`🛒 Atualizando carrinho: ${items.length} itens`);

        // Show/hide sections
        const emptyCart = document.getElementById('emptyCart');
        const cartItemsList = document.getElementById('cartItemsList');
        const cartActions = document.getElementById('cartActions');
        const cartSummary = document.getElementById('cartSummary');

        if (emptyCart) emptyCart.style.display = isEmpty ? 'flex' : 'none';
        if (cartItemsList) cartItemsList.style.display = isEmpty ? 'none' : 'block';
        if (cartActions) cartActions.style.display = isEmpty ? 'none' : 'flex';
        if (cartSummary) cartSummary.style.display = isEmpty ? 'none' : 'block';

        if (!isEmpty) {
            renderCartItems(items);
            renderSummary();
        }
    }

    function renderCartItems(items) {
        const container = document.getElementById('cartItemsList');
        if (!container) return;

        const html = items.map(item => {
            const salePrice = item.sale_price || item.salePrice;
            const price = salePrice || item.price;
            const subtotal = price * item.quantity;
            const hasDiscount = salePrice && salePrice < item.price;

            // Determinar imagem - priorizar array de imagens
            let imageUrl = '';
            if (item.images && Array.isArray(item.images) && item.images.length > 0) {
                imageUrl = item.images[0];
            } else if (item.image && typeof item.image === 'string' && item.image.trim()) {
                imageUrl = item.image;
            }

            // Limpar URLs inválidas
            if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') {
                imageUrl = '';
            }

            const sku = item.sku || 'N/A';
            const safeName = escapeHtml(item.name || 'Produto');
            const itemId = item.id; // Usar ID original sem escape

            // HTML da imagem
            const imgHtml = imageUrl
                ? `<img src="${escapeHtml(imageUrl)}" alt="${safeName}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'cart-item-placeholder\\'>📦</div>'">`
                : `<div class="cart-item-placeholder">📦</div>`;

            return `
                <div class="cart-item" data-item-id="${escapeHtml(itemId)}">
                    <div class="item-image">${imgHtml}</div>
                    <div class="item-details">
                        <h4 class="item-name">${safeName}</h4>
                        <p class="item-sku">SKU: ${escapeHtml(sku)}</p>
                        <div class="item-price">
                            ${hasDiscount ? `
                                <span class="item-price-original">R$ ${formatPrice(item.price)}</span>
                                <span class="item-price-current">R$ ${formatPrice(salePrice)}</span>
                            ` : `
                                <span class="item-price-normal">R$ ${formatPrice(price)}</span>
                            `}
                        </div>
                    </div>
                    <div class="item-actions">
                        <div class="quantity-control">
                            <button type="button" class="qty-btn qty-minus" data-action="decrease" data-item-id="${escapeHtml(itemId)}">−</button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="99" data-item-id="${escapeHtml(itemId)}">
                            <button type="button" class="qty-btn qty-plus" data-action="increase" data-item-id="${escapeHtml(itemId)}">+</button>
                        </div>
                        <div class="item-subtotal">
                            <span class="subtotal-label">Subtotal:</span>
                            <span class="subtotal-value">R$ ${formatPrice(subtotal)}</span>
                        </div>
                        <button type="button" class="remove-btn" data-action="remove" data-item-id="${escapeHtml(itemId)}">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Remover
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    function renderSummary() {
        if (!window.cart || !window.cart.calculateTotals) return;

        const totals = window.cart.calculateTotals();
        console.log('📊 Totais:', totals);

        // Subtotal
        const subtotalEl = document.getElementById('summarySubtotal');
        if (subtotalEl) subtotalEl.textContent = `R$ ${formatPrice(totals.subtotal)}`;

        // Desconto de produtos
        const productDiscountEl = document.getElementById('summaryProductDiscount');
        const productDiscountRow = document.getElementById('productDiscountRow');
        if (productDiscountEl && productDiscountRow) {
            if (totals.productDiscount > 0) {
                productDiscountEl.textContent = `- R$ ${formatPrice(totals.productDiscount)}`;
                productDiscountRow.style.display = 'flex';
            } else {
                productDiscountRow.style.display = 'none';
            }
        }

        // Desconto de cupom
        const couponDiscountEl = document.getElementById('summaryCouponDiscount');
        const couponDiscountRow = document.getElementById('couponDiscountRow');
        if (couponDiscountEl && couponDiscountRow) {
            if (totals.couponDiscount > 0) {
                couponDiscountEl.textContent = `- R$ ${formatPrice(totals.couponDiscount)}`;
                couponDiscountRow.style.display = 'flex';
            } else {
                couponDiscountRow.style.display = 'none';
            }
        }

        // Total
        const totalEl = document.getElementById('summaryTotal');
        if (totalEl) totalEl.textContent = `R$ ${formatPrice(totals.total)}`;

        // Cupom ativo
        const activeCoupon = document.getElementById('activeCoupon');
        const couponCode = document.getElementById('couponCode');
        const couponInputGroup = document.querySelector('.coupon-input-group');

        if (activeCoupon && window.cart.coupon) {
            activeCoupon.style.display = 'flex';
            if (couponCode) couponCode.textContent = window.cart.coupon.code;
            if (couponInputGroup) couponInputGroup.style.display = 'none';
        } else if (activeCoupon) {
            activeCoupon.style.display = 'none';
            if (couponInputGroup) couponInputGroup.style.display = 'flex';
        }
    }

    // ============ UTILITÁRIOS ============

    function escapeHtml(text) {
        if (text === null || text === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    function formatPrice(value) {
        if (!value && value !== 0) return '0,00';
        return parseFloat(value).toFixed(2).replace('.', ',');
    }

    function showToast(message, type = 'info') {
        const existing = document.querySelector('.cart-toast');
        if (existing) existing.remove();

        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };

        const toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type]};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Modal de confirmação customizado (substitui confirm() nativo)
     */
    function showConfirmModal(title, message, onConfirm) {
        // Remover modal existente se houver
        const existing = document.getElementById('cartConfirmModal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'cartConfirmModal';
        modal.innerHTML = `
            <div class="confirm-modal-overlay">
                <div class="confirm-modal-content">
                    <h3 class="confirm-modal-title">${escapeHtml(title)}</h3>
                    <p class="confirm-modal-message">${escapeHtml(message)}</p>
                    <div class="confirm-modal-buttons">
                        <button type="button" class="confirm-modal-btn confirm-modal-cancel">Cancelar</button>
                        <button type="button" class="confirm-modal-btn confirm-modal-confirm">Confirmar</button>
                    </div>
                </div>
            </div>
        `;

        // Estilos inline para garantir funcionamento
        modal.querySelector('.confirm-modal-overlay').style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.2s ease;
        `;

        modal.querySelector('.confirm-modal-content').style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            animation: slideUp 0.2s ease;
        `;

        modal.querySelector('.confirm-modal-title').style.cssText = `
            font-size: 20px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 12px 0;
        `;

        modal.querySelector('.confirm-modal-message').style.cssText = `
            font-size: 16px;
            color: #666;
            margin: 0 0 24px 0;
        `;

        modal.querySelector('.confirm-modal-buttons').style.cssText = `
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        `;

        modal.querySelectorAll('.confirm-modal-btn').forEach(btn => {
            btn.style.cssText = `
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                transition: all 0.2s ease;
            `;
        });

        modal.querySelector('.confirm-modal-cancel').style.cssText += `
            background: #f5f5f5;
            color: #666;
        `;

        modal.querySelector('.confirm-modal-confirm').style.cssText += `
            background: #e74c3c;
            color: white;
        `;

        document.body.appendChild(modal);

        // Event listeners
        const cancelBtn = modal.querySelector('.confirm-modal-cancel');
        const confirmBtn = modal.querySelector('.confirm-modal-confirm');
        const overlay = modal.querySelector('.confirm-modal-overlay');

        function closeModal() {
            modal.remove();
        }

        cancelBtn.addEventListener('click', closeModal);

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeModal();
        });

        confirmBtn.addEventListener('click', function () {
            closeModal();
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
        });

        // Focus no botão confirmar
        confirmBtn.focus();
    }

    // ============ FUNÇÕES GLOBAIS (para compatibilidade com HTML inline) ============

    window.cartRemoveItem = handleRemoveItem;
    window.cartChangeQty = handleQuantityChange;
    window.cartSetQty = handleSetQuantity;
    window.applyCouponHandler = handleApplyCoupon;
    window.proceedToCheckout = handleCheckout;
    window.updateCartPage = updateCartDisplay;

    // Aliases para compatibilidade
    window.removeItem = handleRemoveItem;
    window.changeQuantity = handleQuantityChange;
    window.updateQuantity = handleSetQuantity;
    window.applyCoupon = handleApplyCoupon;

})();
