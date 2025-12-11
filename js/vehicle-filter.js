/**
 * VEHICLE FILTER - Lógica do filtro de busca por veículo
 * Integrado com vehicle-data.js e redireciona para página de produtos
 */

(function () {
    'use strict';

    console.log('🚗 vehicle-filter.js carregado');

    // ==================== ELEMENTOS DOM ====================
    let tabButtons, brandSelect, modelSelect, yearSelect, vehicleForm;
    let currentVehicleType = 'car';

    // ==================== INICIALIZAÇÃO ====================
    function init() {
        tabButtons = document.querySelectorAll('.tab-button');
        brandSelect = document.getElementById('brandSelect');
        modelSelect = document.getElementById('modelSelect');
        yearSelect = document.getElementById('yearSelect');
        vehicleForm = document.getElementById('vehicleFilterForm');

        // Verificar se elementos existem
        if (!brandSelect || !modelSelect || !yearSelect) {
            console.warn('⚠️ Elementos do filtro de veículo não encontrados');
            return;
        }

        console.log('✅ Inicializando filtro de veículos...');

        // Setup
        setupTabButtons();
        setupBrandSelect();
        setupModelSelect();
        setupFormSubmit();

        // Carregar marcas iniciais (carro)
        populateBrands('car');
    }

    // ==================== TABS (Carro/Moto) ====================
    function setupTabButtons() {
        if (!tabButtons || tabButtons.length === 0) return;

        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Remove active de todos
                tabButtons.forEach(tab => tab.classList.remove('active'));
                // Adiciona active ao clicado
                this.classList.add('active');

                // Atualizar tipo de veículo
                currentVehicleType = this.dataset.vehicle === 'moto' ? 'moto' : 'car';
                console.log(`🔄 Tab alterada para: ${currentVehicleType}`);

                // Resetar e recarregar selects
                resetSelects();
                populateBrands(currentVehicleType);
            });
        });
    }

    // ==================== POPULATE MARCAS ====================
    function populateBrands(vehicleType) {
        if (!window.vehicleData) {
            console.error('❌ vehicleData não carregado');
            return;
        }

        const brands = window.vehicleData.getBrands(vehicleType);

        // Limpar e adicionar opção padrão
        brandSelect.innerHTML = '<option value="">Selecione a Marca</option>';

        // Adicionar marcas
        Object.keys(brands).sort((a, b) => {
            return brands[a].name.localeCompare(brands[b].name);
        }).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = brands[key].name;
            brandSelect.appendChild(option);
        });

        console.log(`📋 ${Object.keys(brands).length} marcas carregadas para ${vehicleType}`);
    }

    // ==================== SETUP BRAND SELECT ====================
    function setupBrandSelect() {
        brandSelect.addEventListener('change', function () {
            const selectedBrand = this.value;

            if (selectedBrand) {
                // Habilitar e popular modelos
                modelSelect.disabled = false;
                populateModels(currentVehicleType, selectedBrand);
            } else {
                // Resetar modelos e anos
                modelSelect.disabled = true;
                yearSelect.disabled = true;
                modelSelect.innerHTML = '<option value="">Selecione o Modelo</option>';
                yearSelect.innerHTML = '<option value="">Selecione o Ano</option>';
            }
        });
    }

    // ==================== POPULATE MODELOS ====================
    function populateModels(vehicleType, brandKey) {
        const models = window.vehicleData.getModels(vehicleType, brandKey);

        // Limpar e adicionar opção padrão
        modelSelect.innerHTML = '<option value="">Selecione o Modelo</option>';

        // Adicionar modelos (ordenar alfabeticamente)
        models.sort().forEach(model => {
            const option = document.createElement('option');
            option.value = model.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            option.textContent = model;
            modelSelect.appendChild(option);
        });

        // Resetar anos
        yearSelect.disabled = true;
        yearSelect.innerHTML = '<option value="">Selecione o Ano</option>';

        console.log(`📋 ${models.length} modelos carregados para ${brandKey}`);
    }

    // ==================== SETUP MODEL SELECT ====================
    function setupModelSelect() {
        modelSelect.addEventListener('change', function () {
            if (this.value) {
                yearSelect.disabled = false;
                populateYears();
            } else {
                yearSelect.disabled = true;
                yearSelect.innerHTML = '<option value="">Selecione o Ano</option>';
            }
        });
    }

    // ==================== POPULATE ANOS ====================
    function populateYears() {
        const years = window.vehicleData.getYears();

        yearSelect.innerHTML = '<option value="">Selecione o Ano</option>';

        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });

        console.log(`📋 ${years.length} anos disponíveis`);
    }

    // ==================== FORM SUBMIT ====================
    function setupFormSubmit() {
        if (!vehicleForm) return;

        vehicleForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const brand = brandSelect.value;
            const brandName = brandSelect.options[brandSelect.selectedIndex]?.text || brand;
            const model = modelSelect.value;
            const modelName = modelSelect.options[modelSelect.selectedIndex]?.text || model;
            const year = yearSelect.value;
            const vehicleType = currentVehicleType === 'moto' ? 'moto' : 'carro';

            // Validação
            if (!brand) {
                showMessage('Selecione uma marca', 'warning');
                brandSelect.focus();
                return;
            }
            if (!model) {
                showMessage('Selecione um modelo', 'warning');
                modelSelect.focus();
                return;
            }
            if (!year) {
                showMessage('Selecione um ano', 'warning');
                yearSelect.focus();
                return;
            }

            // Construir URL de redirecionamento
            const params = new URLSearchParams({
                tipo: vehicleType,
                marca: brand,
                marca_nome: brandName,
                modelo: model,
                modelo_nome: modelName,
                ano: year
            });

            const redirectUrl = `pages/produtos.html?${params.toString()}`;

            console.log(`🔍 Buscando peças para: ${vehicleType} ${brandName} ${modelName} ${year}`);
            console.log(`🔗 Redirecionando para: ${redirectUrl}`);

            // Mostrar feedback visual
            showMessage(`Buscando peças para ${brandName} ${modelName} ${year}...`, 'info');

            // Redirecionar após pequeno delay para feedback
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 500);
        });
    }

    // ==================== RESET SELECTS ====================
    function resetSelects() {
        brandSelect.selectedIndex = 0;
        modelSelect.innerHTML = '<option value="">Selecione o Modelo</option>';
        modelSelect.disabled = true;
        yearSelect.innerHTML = '<option value="">Selecione o Ano</option>';
        yearSelect.disabled = true;
    }

    // ==================== SHOW MESSAGE ====================
    function showMessage(message, type = 'info') {
        // Remover mensagem anterior se existir
        const existing = document.querySelector('.vehicle-filter-message');
        if (existing) existing.remove();

        const colors = {
            info: '#3498db',
            success: '#27ae60',
            warning: '#f39c12',
            error: '#e74c3c'
        };

        const msgEl = document.createElement('div');
        msgEl.className = 'vehicle-filter-message';
        msgEl.textContent = message;
        msgEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideDown 0.3s ease;
        `;

        document.body.appendChild(msgEl);

        // Auto-remover após 3s
        setTimeout(() => {
            msgEl.style.opacity = '0';
            msgEl.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => msgEl.remove(), 300);
        }, 3000);
    }

    // ==================== INICIALIZAR QUANDO DOM PRONTO ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
