/**
 * Cart Page Script (REFATORADO)
 * Gerenciamento da interface da página do carrinho
 */

(function () {
    'use strict';

    console.log('🛒 cart-page.js carregado');

    // Aguardar carregar
    window.addEventListener('load', () => {
        setTimeout(initCartPage, 300);
    });

    function initCartPage() {
        if (!window.cart) {
            console.error('❌ Cart system not loaded');
            return;
        }

        console.log('✅ Initializing cart page...');

        updateCartDisplay();
        setupEventListeners();

        // Listen for cart changes (cart.js dispara pelo window)
        window.addEventListener('cartUpdated', updateCartDisplay);
    }

    function setupEventListeners() {
        // Coupon input (Enter key)
        const couponInput = document.getElementById('couponInput');
        if (couponInput) {
            couponInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    applyCoupon();
                }
            });
        }
    }

    function updateCartDisplay() {
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

        container.innerHTML = items.map(item => {
            const salePrice = item.sale_price || item.salePrice;
            const price = salePrice || item.price;
            const subtotal = price * item.quantity;
            const hasDiscount = salePrice && salePrice < item.price;

            // Determinar imagem - verificar todas as possibilidades
            // Placeholder SVG inline (não depende de arquivos externos)
            const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='50%25' y='45%25' fill='%23999' font-family='Arial' font-size='14' text-anchor='middle'%3ESem Imagem%3C/text%3E%3Ctext x='50%25' y='55%25' fill='%23ccc' font-family='Arial' font-size='30' text-anchor='middle'%3E📦%3C/text%3E%3C/svg%3E";
            let imageUrl = PLACEHOLDER_IMG; // Default

            if (item.images && Array.isArray(item.images) && item.images.length > 0 && item.images[0]) {
                imageUrl = item.images[0];
            } else if (item.image && item.image.trim() !== '') {
                imageUrl = item.image.startsWith('http') ? item.image : `../${item.image}`;
            }

            // Verificar se parece uma URL válida
            if (!imageUrl || imageUrl === '' || imageUrl === 'null' || imageUrl === 'undefined') {
                imageUrl = PLACEHOLDER_IMG;
            }

            // SKU tratado
            const sku = item.sku || 'N/A';

            return `
                <div class="cart-item" data-item-id="${item.id}">
                    <div class="item-image">
                        <img src="${imageUrl}" alt="${item.name}" onerror="this.onerror=null; this.src='${PLACEHOLDER_IMG}'">
                    </div>

                    <div class="item-details">
                        <h4 class="item-name">${item.name}</h4>
                        <p class="item-sku">SKU: ${sku}</p>
                        
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
                            <button class="qty-btn qty-minus" onclick="changeQuantity('${item.id}', -1)">−</button>
                            <input 
                                type="number" 
                                class="qty-input" 
                                value="${item.quantity}" 
                                min="1" 
                                max="99"
                                onchange="updateQuantity('${item.id}', this.value)"
                            >
                            <button class="qty-btn qty-plus" onclick="changeQuantity('${item.id}', 1)">+</button>
                        </div>
                        
                        <div class="item-subtotal">
                            <span class="subtotal-label">Subtotal:</span>
                            <span class="subtotal-value">R$ ${formatPrice(subtotal)}</span>
                        </div>

                        <button class="remove-btn" onclick="removeItem('${item.id}')">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Remover
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderSummary() {
        const totals = window.cart.calculateTotals();

        console.log('📊 Totais:', totals);

        // Atualizar subtotal (ID: summarySubtotal)
        const subtotalEl = document.getElementById('summarySubtotal');
        if (subtotalEl) subtotalEl.textContent = `R$ ${formatPrice(totals.subtotal)}`;

        // Desconto de produtos
        const productDiscountEl = document.getElementById('summaryProductDiscount');
        const productDiscountRow = document.getElementById('productDiscountRow');
        if (productDiscountEl && productDiscountRow) {
            const productDiscount = totals.productDiscount || 0;
            if (productDiscount > 0) {
                productDiscountEl.textContent = `- R$ ${formatPrice(productDiscount)}`;
                productDiscountRow.style.display = 'flex';
            } else {
                productDiscountRow.style.display = 'none';
            }
        }

        // Desconto de cupom
        const couponDiscountEl = document.getElementById('summaryCouponDiscount');
        const couponDiscountRow = document.getElementById('couponDiscountRow');
        if (couponDiscountEl && couponDiscountRow) {
            const couponDiscount = totals.couponDiscount || 0;
            if (couponDiscount > 0) {
                couponDiscountEl.textContent = `- R$ ${formatPrice(couponDiscount)}`;
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
        const couponInput = document.getElementById('couponInput');

        if (activeCoupon && window.cart.coupon) {
            activeCoupon.style.display = 'flex';
            if (couponCode) couponCode.textContent = window.cart.coupon.code;
            if (couponInput) couponInput.style.display = 'none';
        } else if (activeCoupon) {
            activeCoupon.style.display = 'none';
            if (couponInput) couponInput.style.display = 'block';
        }
    }

    // Global functions for inline onclick
    window.changeQuantity = function (itemId, delta) {
        const item = window.cart.getItems().find(i => i.id === itemId);
        if (item) {
            const newQty = item.quantity + delta;
            if (newQty > 0 && newQty <= 99) {
                window.cart.updateItemQuantity(itemId, newQty);
            }
        }
    };

    window.updateQuantity = function (itemId, value) {
        const qty = parseInt(value);
        if (qty > 0 && qty <= 99) {
            window.cart.updateItemQuantity(itemId, qty);
        } else {
            updateCartDisplay();
        }
    };

    window.removeItem = function (itemId) {
        if (confirm('Deseja remover este item do carrinho?')) {
            window.cart.removeItem(itemId);
        }
    };

    window.applyCoupon = function () {
        const input = document.getElementById('couponInput');
        if (!input) return;

        const code = input.value.trim().toUpperCase();

        if (!code) {
            showToast('Digite um código de cupom', 'warning');
            return;
        }

        const result = window.cart.applyCoupon(code);

        if (result.success) {
            input.value = '';
            showToast(`✅ Cupom aplicado! ${result.message}`, 'success');
            updateCartDisplay();
        } else {
            showToast(`❌ ${result.message}`, 'error');
        }
    };

    window.proceedToCheckout = function () {
        const items = window.cart.getItems();
        if (items.length === 0) {
            showToast('Adicione produtos ao carrinho primeiro!', 'warning');
            return;
        }

        // Por enquanto, apenas mostra mensagem
        showToast('Redirecionando para o checkout...', 'info');

        // TODO: Implementar checkout real
        // window.location.href = 'checkout.html';
    };

    // Toast notification simples
    function showToast(message, type = 'info') {
        // Se existir toast anterior, remover
        const existingToast = document.querySelector('.cart-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `cart-toast cart-toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideUp 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function formatPrice(value) {
        if (!value && value !== 0) return '0,00';
        return parseFloat(value).toFixed(2).replace('.', ',');
    }

    // Expor updateCartDisplay para uso externo
    window.updateCartPage = updateCartDisplay;

})();
