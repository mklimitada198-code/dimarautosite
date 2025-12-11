/**
 * Categories Bar Script
 * Gerencia a barra de categorias do header
 * - Dropdown de categorias (carrega do Supabase)
 * - Links de navegação para Peças Carros/Motos
 * - Modal de rastreamento de pedidos
 * - Link para serviços
 */

(function () {
    'use strict';

    console.log('📂 categories-bar.js carregado');

    // Aguardar DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('🚀 Inicializando barra de categorias...');

        setupCategoriesDropdown();
        setupCategoryLinks();
        loadCategoriesFromSupabase();

        console.log('✅ Barra de categorias inicializada');
    }

    // ==================== DROPDOWN DE CATEGORIAS ====================

    function setupCategoriesDropdown() {
        const categoriesBtn = document.getElementById('categoriesBtn');
        const categoriesMenu = document.getElementById('categoriesMenu');

        if (!categoriesBtn || !categoriesMenu) {
            console.warn('⚠️ Elementos do dropdown não encontrados');
            return;
        }

        // Toggle dropdown
        categoriesBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = categoriesMenu.classList.contains('show');

            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        // Fechar ao clicar fora
        document.addEventListener('click', function (e) {
            if (!categoriesBtn.contains(e.target) && !categoriesMenu.contains(e.target)) {
                closeDropdown();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeDropdown();
            }
        });

        function openDropdown() {
            categoriesMenu.classList.add('show');
            categoriesBtn.classList.add('active');
            categoriesBtn.setAttribute('aria-expanded', 'true');
        }

        function closeDropdown() {
            categoriesMenu.classList.remove('show');
            categoriesBtn.classList.remove('active');
            categoriesBtn.setAttribute('aria-expanded', 'false');
        }
    }

    // ==================== CARREGAR CATEGORIAS DO SUPABASE ====================

    async function loadCategoriesFromSupabase() {
        const categoriesMenu = document.getElementById('categoriesMenu');
        if (!categoriesMenu) return;

        // Renderizar categorias estáticas IMEDIATAMENTE para UX rápida
        renderStaticCategories();

        // Tentar atualizar com Supabase em background
        try {
            // Aguardar Supabase (máximo 3 segundos)
            let attempts = 0;
            while (!window.supabaseClient && attempts < 30) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!window.supabaseClient) {
                console.warn('⚠️ Supabase não disponível, usando categorias estáticas');
                return;
            }

            const { data: categories, error } = await window.supabaseClient
                .from('categories')
                .select('id, name, slug, icon, description')
                .eq('is_active', true)
                .order('display_order', { ascending: true, nullsFirst: false });

            if (error) {
                console.error('❌ Erro ao carregar categorias:', error);
                return; // Mantém as estáticas
            }

            if (!categories || categories.length === 0) {
                console.warn('⚠️ Nenhuma categoria no Supabase, mantendo estáticas');
                return;
            }

            console.log(`✅ ${categories.length} categorias carregadas do Supabase`);
            renderCategories(categories);

        } catch (error) {
            console.error('❌ Erro ao carregar categorias:', error);
            // Mantém as categorias estáticas já renderizadas
        }
    }

    function renderCategories(categories) {
        const categoriesMenu = document.getElementById('categoriesMenu');
        if (!categoriesMenu) return;

        const html = categories.map(cat => {
            const icon = cat.icon || getCategoryIcon(cat.name);
            const href = `/pages/produtos.html?categoria=${encodeURIComponent(cat.slug || cat.id)}`;

            return `
                <a href="${href}" class="category-menu-item" data-category-id="${cat.id}">
                    <span class="category-icon">${icon}</span>
                    <span class="category-name">${escapeHtml(cat.name)}</span>
                </a>
            `;
        }).join('');

        // Adicionar link para ver todas
        categoriesMenu.innerHTML = html + `
            <div class="category-menu-divider"></div>
            <a href="/pages/produtos.html" class="category-menu-item category-menu-all">
                <span class="category-icon">📦</span>
                <span class="category-name">Ver Todas as Categorias</span>
            </a>
        `;
    }

    function renderStaticCategories() {
        const categoriesMenu = document.getElementById('categoriesMenu');
        if (!categoriesMenu) return;

        const staticCategories = [
            { name: 'Motor', slug: 'motor', icon: '🔧' },
            { name: 'Freios', slug: 'freios', icon: '🛑' },
            { name: 'Suspensão', slug: 'suspensao', icon: '🔩' },
            { name: 'Elétrica', slug: 'eletrica', icon: '⚡' },
            { name: 'Filtros', slug: 'filtros', icon: '🌀' },
            { name: 'Iluminação', slug: 'iluminacao', icon: '💡' },
            { name: 'Acessórios', slug: 'acessorios', icon: '🎯' }
        ];

        renderCategories(staticCategories);
    }

    function getCategoryIcon(name) {
        const icons = {
            'motor': '🔧',
            'freios': '🛑',
            'suspensão': '🔩',
            'elétrica': '⚡',
            'filtros': '🌀',
            'iluminação': '💡',
            'acessórios': '🎯',
            'carroceria': '🚗',
            'arrefecimento': '❄️',
            'transmissão': '⚙️',
            'escapamento': '💨',
            'direção': '🎯',
            'óleo': '🛢️',
            'pneus': '🛞'
        };

        const normalized = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return icons[normalized] || '📦';
    }

    // ==================== LINKS DE NAVEGAÇÃO ====================

    function setupCategoryLinks() {
        const categoryLinksContainer = document.querySelector('.category-links');
        if (!categoryLinksContainer) return;

        // Atualizar HTML com links funcionais
        categoryLinksContainer.innerHTML = `
            <a href="/pages/produtos.html?tipo=carro" class="category-link" data-vehicle="carro">
                <span class="link-icon">🚗</span>
                Peças Carros
            </a>
            <a href="/pages/produtos.html?tipo=moto" class="category-link" data-vehicle="moto">
                <span class="link-icon">🏍️</span>
                Peças Motos
            </a>
            <a href="#" class="category-link" id="trackOrderLink">
                <span class="link-icon">📦</span>
                Rastrear Pedido
            </a>
            <a href="/pages/servicos.html" class="category-link">
                <span class="link-icon">🛠️</span>
                Nossos Serviços
            </a>
        `;

        // Setup modal de rastreamento
        setupTrackingModal();
    }

    // ==================== MODAL DE RASTREAMENTO ====================

    function setupTrackingModal() {
        const trackLink = document.getElementById('trackOrderLink');
        if (!trackLink) return;

        trackLink.addEventListener('click', function (e) {
            e.preventDefault();
            showTrackingModal();
        });
    }

    function showTrackingModal() {
        // Remover modal existente
        const existing = document.getElementById('trackingModal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'trackingModal';
        modal.innerHTML = `
            <div class="tracking-modal-overlay">
                <div class="tracking-modal-content">
                    <button type="button" class="tracking-modal-close" aria-label="Fechar">&times;</button>
                    <div class="tracking-modal-header">
                        <h3>📦 Rastrear Pedido</h3>
                        <p>Insira o número do seu pedido para acompanhar o status</p>
                    </div>
                    <form id="trackingForm" class="tracking-form">
                        <div class="tracking-input-group">
                            <label for="orderNumber">Número do Pedido</label>
                            <input type="text" id="orderNumber" placeholder="Ex: DIM-123456" required>
                        </div>
                        <div class="tracking-input-group">
                            <label for="orderEmail">E-mail do Pedido</label>
                            <input type="email" id="orderEmail" placeholder="seu@email.com" required>
                        </div>
                        <button type="submit" class="tracking-submit-btn">
                            <span class="btn-icon">🔍</span>
                            Rastrear Pedido
                        </button>
                    </form>
                    <div id="trackingResult" class="tracking-result" style="display: none;"></div>
                </div>
            </div>
        `;

        // Estilos inline
        applyTrackingModalStyles(modal);

        document.body.appendChild(modal);

        // Event listeners
        const closeBtn = modal.querySelector('.tracking-modal-close');
        const overlay = modal.querySelector('.tracking-modal-overlay');
        const form = modal.querySelector('#trackingForm');

        closeBtn.addEventListener('click', () => modal.remove());

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) modal.remove();
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            handleTrackOrder();
        });

        // Focus no input
        modal.querySelector('#orderNumber').focus();
    }

    function applyTrackingModalStyles(modal) {
        modal.querySelector('.tracking-modal-overlay').style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease;
        `;

        modal.querySelector('.tracking-modal-content').style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 480px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            position: relative;
            animation: slideUp 0.3s ease;
        `;

        modal.querySelector('.tracking-modal-close').style.cssText = `
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 28px;
            color: #666;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
        `;

        modal.querySelector('.tracking-modal-header').style.cssText = `
            text-align: center;
            margin-bottom: 24px;
        `;

        modal.querySelector('.tracking-modal-header h3').style.cssText = `
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 8px 0;
        `;

        modal.querySelector('.tracking-modal-header p').style.cssText = `
            font-size: 14px;
            color: #666;
            margin: 0;
        `;

        modal.querySelectorAll('.tracking-input-group').forEach(group => {
            group.style.cssText = `
                margin-bottom: 16px;
            `;
        });

        modal.querySelectorAll('.tracking-input-group label').forEach(label => {
            label.style.cssText = `
                display: block;
                font-size: 14px;
                font-weight: 600;
                color: #333;
                margin-bottom: 6px;
            `;
        });

        modal.querySelectorAll('.tracking-input-group input').forEach(input => {
            input.style.cssText = `
                width: 100%;
                padding: 14px 16px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.2s;
                box-sizing: border-box;
            `;
        });

        modal.querySelector('.tracking-submit-btn').style.cssText = `
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, #ff6600 0%, #ff8800 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 24px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
        `;
    }

    function handleTrackOrder() {
        const orderNumber = document.getElementById('orderNumber').value.trim();
        const orderEmail = document.getElementById('orderEmail').value.trim();
        const resultDiv = document.getElementById('trackingResult');
        const form = document.getElementById('trackingForm');

        if (!orderNumber || !orderEmail) {
            showTrackingError('Por favor, preencha todos os campos.');
            return;
        }

        // Simular busca (em produção, fazer chamada à API)
        form.querySelector('.tracking-submit-btn').innerHTML = `
            <span class="btn-icon">⏳</span>
            Buscando...
        `;

        setTimeout(() => {
            // Simulação de resultado
            const mockOrder = {
                number: orderNumber,
                status: 'em_transito',
                statusLabel: 'Em Trânsito',
                lastUpdate: new Date().toLocaleDateString('pt-BR'),
                estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
                steps: [
                    { label: 'Pedido Confirmado', done: true, date: '08/12/2024' },
                    { label: 'Pagamento Aprovado', done: true, date: '08/12/2024' },
                    { label: 'Em Separação', done: true, date: '09/12/2024' },
                    { label: 'Enviado', done: true, date: '10/12/2024' },
                    { label: 'Em Trânsito', done: true, date: '11/12/2024' },
                    { label: 'Entregue', done: false, date: '' }
                ]
            };

            form.style.display = 'none';
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = renderTrackingResult(mockOrder);

        }, 1500);
    }

    function renderTrackingResult(order) {
        const stepsHtml = order.steps.map((step, index) => `
            <div class="tracking-step ${step.done ? 'done' : ''}" style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 0;
                border-left: 3px solid ${step.done ? '#27ae60' : '#e0e0e0'};
                margin-left: 12px;
                padding-left: 20px;
                position: relative;
            ">
                <div class="step-marker" style="
                    position: absolute;
                    left: -10px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: ${step.done ? '#27ae60' : '#e0e0e0'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                ">${step.done ? '✓' : ''}</div>
                <div class="step-info" style="flex: 1;">
                    <div style="font-weight: 600; color: ${step.done ? '#1a1a1a' : '#999'};">${step.label}</div>
                    ${step.date ? `<div style="font-size: 12px; color: #999;">${step.date}</div>` : ''}
                </div>
            </div>
        `).join('');

        return `
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="font-size: 48px; margin-bottom: 12px;">🚚</div>
                <h4 style="font-size: 18px; color: #1a1a1a; margin: 0 0 4px 0;">Pedido ${escapeHtml(order.number)}</h4>
                <div style="
                    display: inline-block;
                    padding: 6px 16px;
                    background: #fff3e0;
                    color: #ff6600;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                ">${order.statusLabel}</div>
            </div>
            <div style="background: #f8f9fa; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">Última atualização:</span>
                    <span style="font-weight: 600;">${order.lastUpdate}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #666;">Previsão de entrega:</span>
                    <span style="font-weight: 600; color: #27ae60;">${order.estimatedDelivery}</span>
                </div>
            </div>
            <div class="tracking-timeline" style="padding-left: 0;">
                ${stepsHtml}
            </div>
            <button type="button" onclick="document.getElementById('trackingModal').remove()" style="
                width: 100%;
                padding: 14px;
                background: #f5f5f5;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                color: #666;
                cursor: pointer;
                margin-top: 20px;
            ">Fechar</button>
        `;
    }

    function showTrackingError(message) {
        const resultDiv = document.getElementById('trackingResult');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div style="text-align: center; padding: 20px; background: #ffebee; border-radius: 8px; color: #c62828;">
                <span style="font-size: 32px;">❌</span>
                <p style="margin: 12px 0 0 0;">${message}</p>
            </div>
        `;
    }

    // ==================== UTILITÁRIOS ====================

    function escapeHtml(text) {
        if (text === null || text === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

})();
