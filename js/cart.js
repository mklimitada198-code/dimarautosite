/**
 * Shopping Cart System - Dimar E-commerce
 * Gerenciamento completo do carrinho de compras
 */

class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
        this.init();
    }

    /**
     * Inicializar sistema de carrinho
     */
    init() {
        this.updateCartBadge();
        this.setupEventListeners();
        console.log('🛒 Shopping Cart initialized');
    }

    /**
     * Adicionar produto ao carrinho
     */
    addItem(product) {
        // Verificar se produto já existe no carrinho
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            // Aumentar quantidade
            existingItem.quantity += product.quantity || 1;
            this.showNotification(`Quantidade atualizada: ${product.name}`, 'success');
        } else {
            // Adicionar novo item
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                salePrice: product.salePrice || null,
                image: product.image,
                sku: product.sku,
                quantity: product.quantity || 1,
                addedAt: new Date().toISOString()
            });
            this.showNotification(`${product.name} adicionado ao carrinho!`, 'success');
        }

        this.saveToStorage();
        this.updateCartBadge();
        this.animateCartIcon();

        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { items: this.items }
        }));

        return true;
    }

    /**
     * Remover produto do carrinho
     */
    removeItem(productId) {
        const item = this.items.find(i => i.id === productId);

        if (item) {
            this.items = this.items.filter(i => i.id !== productId);
            this.showNotification(`${item.name} removido do carrinho`, 'info');

            this.saveToStorage();
            this.updateCartBadge();

            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { items: this.items }
            }));

            return true;
        }

        return false;
    }

    /**
     * Atualizar quantidade de um item
     */
    updateQuantity(productId, quantity) {
        const item = this.items.find(i => i.id === productId);

        if (item) {
            if (quantity <= 0) {
                return this.removeItem(productId);
            }

            item.quantity = quantity;
            this.saveToStorage();
            this.updateCartBadge();

            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { items: this.items }
            }));

            return true;
        }

        return false;
    }

    /**
     * Limpar carrinho
     */
    clear() {
        if (this.items.length === 0) return;

        if (confirm('Deseja realmente limpar o carrinho?')) {
            this.items = [];
            this.saveToStorage();
            this.updateCartBadge();
            this.showNotification('Carrinho limpo!', 'info');

            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { items: this.items }
            }));

            return true;
        }

        return false;
    }

    /**
     * Obter todos os itens
     */
    getItems() {
        return [...this.items];
    }

    /**
     * Obter quantidade total de itens
     */
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Calcular subtotal
     */
    getSubtotal() {
        return this.items.reduce((total, item) => {
            const price = item.salePrice || item.price;
            return total + (price * item.quantity);
        }, 0);
    }

    /**
     * Calcular desconto total
     */
    getTotalDiscount() {
        return this.items.reduce((total, item) => {
            if (item.salePrice) {
                const discount = (item.price - item.salePrice) * item.quantity;
                return total + discount;
            }
            return total;
        }, 0);
    }

    /**
     * Aplicar cupom de desconto
     */
    applyCoupon(couponCode) {
        // Cupons de exemplo (em produção, validar no backend)
        const coupons = {
            'DIMAR10': { type: 'percent', value: 10, description: '10% de desconto' },
            'DIMAR50': { type: 'fixed', value: 50, description: 'R$ 50 de desconto' },
            '50TAO': { type: 'percent', value: 50, description: '50% de desconto' },
            'FRETEGRATIS': { type: 'shipping', value: 0, description: 'Frete grátis' }
        };

        const coupon = coupons[couponCode.toUpperCase()];

        if (coupon) {
            this.activeCoupon = { code: couponCode.toUpperCase(), ...coupon };
            this.saveToStorage();
            this.showNotification(`Cupom aplicado: ${coupon.description}`, 'success');

            window.dispatchEvent(new CustomEvent('couponApplied', {
                detail: { coupon: this.activeCoupon }
            }));

            return coupon;
        }

        this.showNotification('Cupom inválido!', 'error');
        return null;
    }

    /**
     * Remover cupom
     */
    removeCoupon() {
        this.activeCoupon = null;
        this.saveToStorage();
        this.showNotification('Cupom removido', 'info');

        window.dispatchEvent(new CustomEvent('couponRemoved'));
    }

    /**
     * Calcular desconto do cupom
     */
    getCouponDiscount() {
        if (!this.activeCoupon) return 0;

        const subtotal = this.getSubtotal();

        switch (this.activeCoupon.type) {
            case 'percent':
                return subtotal * (this.activeCoupon.value / 100);
            case 'fixed':
                return Math.min(this.activeCoupon.value, subtotal);
            default:
                return 0;
        }
    }

    /**
     * Calcular total final
     */
    getTotal() {
        const subtotal = this.getSubtotal();
        const couponDiscount = this.getCouponDiscount();
        return Math.max(0, subtotal - couponDiscount);
    }

    /**
     * Salvar no localStorage
     */
    saveToStorage() {
        try {
            const data = {
                items: this.items,
                activeCoupon: this.activeCoupon || null,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('dimar_cart', JSON.stringify(data));
        } catch (error) {
            console.error('Erro ao salvar carrinho:', error);
        }
    }

    /**
     * Carregar do localStorage
     */
    loadFromStorage() {
        try {
            const data = localStorage.getItem('dimar_cart');
            if (data) {
                const parsed = JSON.parse(data);
                this.items = parsed.items || [];
                this.activeCoupon = parsed.activeCoupon || null;
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
            this.items = [];
        }
    }

    /**
     * Atualizar badge do carrinho no header
     */
    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        const totalItems = this.getTotalItems();

        if (badge) {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    /**
     * Animar ícone do carrinho
     */
    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-action');
        if (cartIcon) {
            cartIcon.classList.add('cart-bounce');
            setTimeout(() => {
                cartIcon.classList.remove('cart-bounce');
            }, 600);
        }
    }

    /**
     * Mostrar notificação
     */
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `cart-notification cart-notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${this.getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        `;

        // Adicionar ao body
        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 10);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Obter ícone da notificação
     */
    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            info: 'ℹ',
            warning: '⚠'
        };
        return icons[type] || icons.info;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Atalho: Ver carrinho ao clicar no ícone
        const cartIcon = document.querySelector('.cart-action');
        if (cartIcon && !cartIcon.dataset.listenerAdded) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/pages/carrinho.html';
            });
            cartIcon.dataset.listenerAdded = 'true';
        }
    }

    /**
     * Calcular todos os totais (para uso na página de carrinho)
     */
    calculateTotals() {
        const subtotal = this.getSubtotal();
        const productDiscount = this.getTotalDiscount();
        const couponDiscount = this.getCouponDiscount();
        const total = this.getTotal();

        return {
            subtotal: subtotal,
            productDiscount: productDiscount,
            couponDiscount: couponDiscount,
            discount: productDiscount + couponDiscount,
            total: total,
            freeShipping: total >= 200 || (this.activeCoupon && this.activeCoupon.type === 'shipping'),
            shipping: total >= 200 ? 0 : 15.90
        };
    }

    /**
     * Alias para updateQuantity (compatibilidade)
     */
    updateItemQuantity(productId, quantity) {
        return this.updateQuantity(productId, quantity);
    }

    /**
     * Obter cupom ativo
     */
    get coupon() {
        return this.activeCoupon;
    }

    /**
     * Obter resumo do carrinho (para uso em outras páginas)
     */
    getSummary() {
        return {
            totalItems: this.getTotalItems(),
            subtotal: this.getSubtotal(),
            discount: this.getTotalDiscount(),
            couponDiscount: this.getCouponDiscount(),
            total: this.getTotal(),
            activeCoupon: this.activeCoupon
        };
    }
}

// Inicializar carrinho globalmente
window.cart = new ShoppingCart();

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoppingCart;
}

