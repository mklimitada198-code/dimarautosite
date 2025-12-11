/**
 * Cart Page Script (REFATORADO v3 - Simplificado)
 * Gerenciamento da interface da página do carrinho
 * Usa funções globais simples que são mais robustas
 */

(function () {
    'use strict';

    console.log('🛒 cart-page.js v3 carregado');

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

        console.log('✅ Initializing cart page...');

        // Configurar listeners estáticos (elementos que já existem)
        setupStaticListeners();

        // Atualizar display inicial
        updateCartDisplay();

        // Escutar mudanças no carrinho
        window.addEventListener('cartUpdated', updateCartDisplay);
    }

    function setupStaticListeners() {
        // Botão Limpar Carrinho
        const clearBtn = document.getElementById('clearCartBtn');
        if (clearBtn) {
            clearBtn.onclick = function () {
                if (window.cart && confirm('Deseja realmente limpar o carrinho?')) {
                    window.cart.items = [];
                    window.cart.saveToStorage();
                    window.cart.updateCartBadge();
                    updateCartDisplay();
                    showToast('Carrinho limpo!', 'info');
                }
            };
        }

        // Botão Aplicar Cupom
        const applyBtn = document.querySelector('.btn-apply');
        if (applyBtn) {
            applyBtn.onclick = window.applyCouponHandler;
        }

        // Cupom com Enter
        const couponInput = document.getElementById('couponInput');
        if (couponInput) {
            couponInput.onkeypress = function (e) {
                if (e.key === 'Enter') {
                    window.applyCouponHandler();
                }
            };
        }

        // Botão Checkout
        const checkoutBtn = document.querySelector('.btn-checkout');
        if (checkoutBtn) {
            checkoutBtn.onclick = window.proceedToCheckout;
        }
    }

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
            const safeId = String(item.id).replace(/'/g, "\\'"); // Escapar aspas simples para JS

            // HTML da imagem
            const imgHtml = imageUrl
                ? `<img src="${escapeHtml(imageUrl)}" alt="${safeName}" loading="lazy">`
                : `<div class="cart-item-placeholder">📦</div>`;

            return `
                <div class="cart-item" data-item-id="${escapeHtml(item.id)}">
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
                            <button type="button" class="qty-btn qty-minus" onclick="window.cartChangeQty('${safeId}', -1)">−</button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="99" 
                                   onchange="window.cartSetQty('${safeId}', this.value)">
                            <button type="button" class="qty-btn qty-plus" onclick="window.cartChangeQty('${safeId}', 1)">+</button>
                        </div>
                        <div class="item-subtotal">
                            <span class="subtotal-label">Subtotal:</span>
                            <span class="subtotal-value">R$ ${formatPrice(subtotal)}</span>
                        </div>
                        <button type="button" class="remove-btn" onclick="window.cartRemoveItem('${safeId}')">
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

    // ============ FUNÇÕES GLOBAIS ============

    // Remover item
    window.cartRemoveItem = function (itemId) {
        console.log('🗑️ Removendo item:', itemId);
        if (confirm('Deseja remover este item do carrinho?')) {
            window.cart.removeItem(itemId);
            updateCartDisplay();
            showToast('Item removido do carrinho', 'info');
        }
    };

    // Mudar quantidade (+/-)
    window.cartChangeQty = function (itemId, delta) {
        const item = window.cart.getItems().find(i => i.id === itemId);
        if (item) {
            const newQty = item.quantity + delta;
            if (newQty > 0 && newQty <= 99) {
                window.cart.updateQuantity(itemId, newQty);
                updateCartDisplay();
            } else if (newQty <= 0) {
                window.cartRemoveItem(itemId);
            }
        }
    };

    // Definir quantidade diretamente
    window.cartSetQty = function (itemId, value) {
        const qty = parseInt(value);
        if (qty > 0 && qty <= 99) {
            window.cart.updateQuantity(itemId, qty);
            updateCartDisplay();
        } else {
            updateCartDisplay(); // Reset para valor válido
        }
    };

    // Aplicar cupom
    window.applyCouponHandler = function () {
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
    };

    // Checkout
    window.proceedToCheckout = function () {
        const items = window.cart.getItems();
        if (items.length === 0) {
            showToast('Adicione produtos primeiro!', 'warning');
            return;
        }
        showToast('Redirecionando para checkout...', 'info');
        // TODO: Implementar checkout
    };

    // Aliases para compatibilidade
    window.removeItem = window.cartRemoveItem;
    window.changeQuantity = window.cartChangeQty;
    window.updateQuantity = window.cartSetQty;
    window.applyCoupon = window.applyCouponHandler;
    window.updateCartPage = updateCartDisplay;

    // ============ UTILITÁRIOS ============

    function escapeHtml(text) {
        if (!text) return '';
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
        `;

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

})();
