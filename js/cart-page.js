/**
 * Cart Page Script
 * Gerenciamento da interface da página do carrinho
 */

(function() {
    'use strict';

    // Aguardar carregar
    window.addEventListener('load', () => {
        setTimeout(initCartPage, 200);
    });

    function initCartPage() {
        if (!window.cart) {
            console.error('❌ Cart system not loaded');
            return;
        }

        console.log('🛒 Initializing cart page...');
        
        updateCartDisplay();
        setupEventListeners();

        // Listen for cart changes
        document.addEventListener('cartUpdated', updateCartDisplay);
    }

    function setupEventListeners() {
        // Apply coupon button
        const applyBtn = document.querySelector('.btn-apply');
        if (applyBtn) {
            applyBtn.addEventListener('click', applyCoupon);
        }

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

        // Show/hide sections
        const emptyCart = document.getElementById('emptyCart');
        const cartItemsList = document.getElementById('cartItemsList');
        const cartActions = document.getElementById('cartActions');
        const cartSummary = document.getElementById('cartSummary');

        if (emptyCart) emptyCart.style.display = isEmpty ? 'block' : 'none';
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
            const price = item.salePrice || item.price;
            const subtotal = price * item.quantity;
            const hasDiscount = item.salePrice && item.salePrice < item.price;

            return `
                <div class="cart-item" data-item-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>

                    <div class="item-info">
                        <h4 class="item-name">${item.name}</h4>
                        <p class="item-sku">SKU: ${item.sku}</p>
                        
                        <div class="item-price">
                            ${hasDiscount ? `
                                <span class="price-old">R$ ${formatPrice(item.price)}</span>
                                <span class="price-current">R$ ${formatPrice(item.salePrice)}</span>
                            ` : `
                                <span class="price-current">R$ ${formatPrice(price)}</span>
                            `}
                        </div>
                    </div>

                    <div class="item-quantity">
                        <button class="qty-btn qty-minus" onclick="changeQuantity('${item.id}', -1)">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <input 
                            type="number" 
                            class="qty-input" 
                            value="${item.quantity}" 
                            min="1" 
                            max="99"
                            onchange="updateQuantity('${item.id}', this.value)"
                        >
                        <button class="qty-btn qty-plus" onclick="changeQuantity('${item.id}', 1)">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>

                    <div class="item-subtotal">
                        <span class="subtotal-label">Subtotal:</span>
                        <span class="subtotal-value">R$ ${formatPrice(subtotal)}</span>
                    </div>

                    <button class="item-remove" onclick="removeItem('${item.id}')" title="Remover item">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
    }

    function renderSummary() {
        const totals = window.cart.calculateTotals();
        
        // Update totals
        const subtotalEl = document.getElementById('cartSubtotal');
        const discountEl = document.getElementById('cartDiscount');
        const shippingEl = document.getElementById('cartShipping');
        const totalEl = document.getElementById('cartTotal');

        if (subtotalEl) subtotalEl.textContent = `R$ ${formatPrice(totals.subtotal)}`;
        if (discountEl) discountEl.textContent = `- R$ ${formatPrice(totals.discount)}`;
        if (shippingEl) shippingEl.textContent = totals.freeShipping ? 'Grátis' : `R$ ${formatPrice(totals.shipping)}`;
        if (totalEl) totalEl.textContent = `R$ ${formatPrice(totals.total)}`;

        // Show/hide discount row
        const discountRow = discountEl?.closest('.summary-row');
        if (discountRow) {
            discountRow.style.display = totals.discount > 0 ? 'flex' : 'none';
        }
    }

    function applyCoupon() {
        const input = document.getElementById('couponInput');
        if (!input) return;

        const code = input.value.trim().toUpperCase();
        
        if (!code) {
            alert('Digite um código de cupom');
            return;
        }

        const result = window.cart.applyCoupon(code);
        
        if (result.success) {
            input.value = '';
            input.disabled = true;
            alert(`✅ Cupom aplicado! ${result.message}`);
        } else {
            alert(`❌ ${result.message}`);
        }
    }

    // Global functions for inline onclick
    window.changeQuantity = function(itemId, delta) {
        const item = window.cart.getItems().find(i => i.id === itemId);
        if (item) {
            const newQty = item.quantity + delta;
            if (newQty > 0 && newQty <= 99) {
                window.cart.updateItemQuantity(itemId, newQty);
            }
        }
    };

    window.updateQuantity = function(itemId, value) {
        const qty = parseInt(value);
        if (qty > 0 && qty <= 99) {
            window.cart.updateItemQuantity(itemId, qty);
        } else {
            // Reset to current quantity
            updateCartDisplay();
        }
    };

    window.removeItem = function(itemId) {
        if (confirm('Deseja remover este item do carrinho?')) {
            window.cart.removeItem(itemId);
        }
    };

    function formatPrice(value) {
        return value.toFixed(2).replace('.', ',');
    }

})();
