/**
 * Vehicle Selector Component - Seletor Estruturado de Veículos Compatíveis
 * Usado no admin para selecionar veículos de forma padronizada
 * Integra com vehicle-data.js para garantir consistência com o filtro da homepage
 */

// Estado do componente
let selectedVehicles = [];
let currentVehicleType = 'car';

console.log('🚗 vehicle-selector.js carregado');

// ==================== INICIALIZAÇÃO ====================
function initVehicleSelector() {
    console.log('🔧 Inicializando seletor de veículos...');

    const container = document.getElementById('vehicleSelectorContainer');
    if (!container) {
        console.warn('⚠️ Container do seletor de veículos não encontrado');
        return;
    }

    // Verificar se vehicle-data.js foi carregado
    if (!window.vehicleData) {
        console.error('❌ vehicle-data.js não foi carregado!');
        container.innerHTML = '<p style="color: red;">Erro: Dados de veículos não disponíveis</p>';
        return;
    }

    setupTabListeners();
    setupBrandSelect();
    setupModelSelect();
    setupAddButton();

    // Carregar marcas iniciais (carro)
    populateBrands('car');
    populateYears();

    console.log('✅ Seletor de veículos inicializado');
}

// ==================== TABS (Carro/Moto) ====================
function setupTabListeners() {
    const tabs = document.querySelectorAll('.vehicle-selector-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remover active de todos e resetar estilos
            tabs.forEach(t => {
                t.classList.remove('active');
                // Resetar estilo para inativo
                if (t.dataset.type === 'car') {
                    t.style.background = 'white';
                    t.style.color = '#ff6600';
                    t.style.border = '2px solid #ff6600';
                } else {
                    t.style.background = 'white';
                    t.style.color = '#17a2b8';
                    t.style.border = '2px solid #17a2b8';
                }
            });

            // Adicionar active ao clicado e estilo ativo
            this.classList.add('active');
            if (this.dataset.type === 'car') {
                this.style.background = '#ff6600';
                this.style.color = 'white';
            } else {
                this.style.background = '#17a2b8';
                this.style.color = 'white';
            }

            // Atualizar tipo
            currentVehicleType = this.dataset.type;
            console.log(`🔄 Tipo alterado para: ${currentVehicleType}`);

            // Resetar e recarregar MARCAS do tipo selecionado
            resetSelects();
            populateBrands(currentVehicleType);

            // Atualizar checkboxes de tipo de veículo (para retrocompatibilidade)
            updateVehicleTypeCheckboxes(currentVehicleType);
        });
    });
}

// Atualizar checkboxes de retrocompatibilidade
function updateVehicleTypeCheckboxes(type) {
    const carroCheckbox = document.getElementById('vehicleTypeCarro');
    const motoCheckbox = document.getElementById('vehicleTypeMoto');
    // Não fazemos nada aqui, os checkboxes são preenchidos baseados nos veículos adicionados
}

// ==================== POPULATE MARCAS ====================
function populateBrands(vehicleType) {
    const brandSelect = document.getElementById('vehicleBrandSelect');
    if (!brandSelect) return;

    const brands = window.vehicleData.getBrands(vehicleType);

    brandSelect.innerHTML = '<option value="">Selecione a marca</option>';

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
    const brandSelect = document.getElementById('vehicleBrandSelect');
    const modelSelect = document.getElementById('vehicleModelSelect');

    if (!brandSelect || !modelSelect) return;

    brandSelect.addEventListener('change', function () {
        const selectedBrand = this.value;

        if (selectedBrand) {
            modelSelect.disabled = false;
            populateModels(currentVehicleType, selectedBrand);
        } else {
            modelSelect.disabled = true;
            modelSelect.innerHTML = '<option value="">Selecione o modelo</option>';
        }
    });
}

// ==================== POPULATE MODELOS ====================
function populateModels(vehicleType, brandKey) {
    const modelSelect = document.getElementById('vehicleModelSelect');
    if (!modelSelect) return;

    const models = window.vehicleData.getModels(vehicleType, brandKey);

    modelSelect.innerHTML = '<option value="">Selecione o modelo</option>';

    models.sort().forEach(model => {
        const option = document.createElement('option');
        // Normalizar o valor para slug
        option.value = model.toLowerCase()
            .replace(/\s+/g, '-')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        option.textContent = model;
        option.dataset.modelName = model; // Guardar nome original
        modelSelect.appendChild(option);
    });

    console.log(`📋 ${models.length} modelos carregados para ${brandKey}`);
}

// ==================== SETUP MODEL SELECT ====================
function setupModelSelect() {
    const modelSelect = document.getElementById('vehicleModelSelect');

    if (!modelSelect) return;

    modelSelect.addEventListener('change', function () {
        // Habilitar seleção de anos quando modelo for selecionado
        const yearsContainer = document.getElementById('vehicleYearsContainer');
        if (yearsContainer) {
            yearsContainer.style.opacity = this.value ? '1' : '0.5';
        }
    });
}

// ==================== POPULATE ANOS ====================
function populateYears() {
    const container = document.getElementById('vehicleYearsContainer');
    if (!container) return;

    const years = window.vehicleData.getYears();

    let html = `
        <div class="years-grid" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
            <label class="year-checkbox-label" style="display: flex; align-items: center; gap: 4px; padding: 6px 12px; background: #f8f9fa; border-radius: 6px; cursor: pointer; font-size: 13px;">
                <input type="checkbox" id="yearAll" value="all" style="width: 14px; height: 14px;">
                <span>Todos</span>
            </label>
    `;

    // Mostrar apenas os últimos 10 anos + próximo ano
    const recentYears = years.slice(0, 11);
    recentYears.forEach(year => {
        html += `
            <label class="year-checkbox-label" style="display: flex; align-items: center; gap: 4px; padding: 6px 12px; background: #f8f9fa; border-radius: 6px; cursor: pointer; font-size: 13px;">
                <input type="checkbox" class="year-checkbox" value="${year}" style="width: 14px; height: 14px;">
                <span>${year}</span>
            </label>
        `;
    });

    html += `
        </div>
        <div style="margin-top: 8px;">
            <button type="button" id="showAllYears" class="btn-link" style="background: none; border: none; color: #007bff; cursor: pointer; font-size: 13px; padding: 0;">
                Ver mais anos ▼
            </button>
            <div id="olderYearsContainer" style="display: none; margin-top: 8px;"></div>
        </div>
    `;

    container.innerHTML = html;

    // Setup "Todos" checkbox
    const allCheckbox = document.getElementById('yearAll');
    if (allCheckbox) {
        allCheckbox.addEventListener('change', function () {
            const yearCheckboxes = document.querySelectorAll('.year-checkbox');
            yearCheckboxes.forEach(cb => {
                cb.checked = this.checked;
                cb.disabled = this.checked;
            });
        });
    }

    // Setup "Ver mais anos"
    const showMoreBtn = document.getElementById('showAllYears');
    const olderContainer = document.getElementById('olderYearsContainer');
    if (showMoreBtn && olderContainer) {
        showMoreBtn.addEventListener('click', function () {
            const olderYears = years.slice(11);
            let olderHtml = '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
            olderYears.forEach(year => {
                olderHtml += `
                    <label class="year-checkbox-label" style="display: flex; align-items: center; gap: 4px; padding: 6px 12px; background: #f0f0f0; border-radius: 6px; cursor: pointer; font-size: 13px;">
                        <input type="checkbox" class="year-checkbox" value="${year}" style="width: 14px; height: 14px;">
                        <span>${year}</span>
                    </label>
                `;
            });
            olderHtml += '</div>';
            olderContainer.innerHTML = olderHtml;
            olderContainer.style.display = 'block';
            this.style.display = 'none';
        });
    }
}

// ==================== SETUP ADD BUTTON ====================
function setupAddButton() {
    const addBtn = document.getElementById('addVehicleBtn');
    if (!addBtn) return;

    addBtn.addEventListener('click', function (e) {
        e.preventDefault();
        addVehicle();
    });
}

// ==================== ADD VEHICLE ====================
function addVehicle() {
    const brandSelect = document.getElementById('vehicleBrandSelect');
    const modelSelect = document.getElementById('vehicleModelSelect');
    const allCheckbox = document.getElementById('yearAll');

    if (!brandSelect || !modelSelect) return;

    // Validar seleções
    if (!brandSelect.value) {
        showVehicleSelectorMessage('Selecione uma marca', 'warning');
        brandSelect.focus();
        return;
    }
    if (!modelSelect.value) {
        showVehicleSelectorMessage('Selecione um modelo', 'warning');
        modelSelect.focus();
        return;
    }

    // Coletar anos selecionados
    const selectedYears = [];
    const isAllYears = allCheckbox && allCheckbox.checked;

    if (!isAllYears) {
        const yearCheckboxes = document.querySelectorAll('.year-checkbox:checked');
        yearCheckboxes.forEach(cb => {
            selectedYears.push(parseInt(cb.value));
        });

        if (selectedYears.length === 0) {
            showVehicleSelectorMessage('Selecione pelo menos um ano', 'warning');
            return;
        }
    }

    // Obter nomes para exibição
    const brandName = brandSelect.options[brandSelect.selectedIndex].text;
    const modelName = modelSelect.options[modelSelect.selectedIndex].dataset.modelName ||
        modelSelect.options[modelSelect.selectedIndex].text;

    // Criar objeto do veículo
    const vehicle = {
        type: currentVehicleType === 'car' ? 'carro' : 'moto',
        brand: brandSelect.value,
        brandName: brandName,
        model: modelSelect.value,
        modelName: modelName,
        years: isAllYears ? 'all' : selectedYears.sort((a, b) => a - b)
    };

    // Verificar se já existe
    const exists = selectedVehicles.some(v =>
        v.type === vehicle.type &&
        v.brand === vehicle.brand &&
        v.model === vehicle.model
    );

    if (exists) {
        showVehicleSelectorMessage('Este veículo já foi adicionado', 'warning');
        return;
    }

    // Adicionar à lista
    selectedVehicles.push(vehicle);
    console.log('➕ Veículo adicionado:', vehicle);

    // Atualizar UI
    renderSelectedVehicles();
    resetSelects();

    showVehicleSelectorMessage(`${brandName} ${modelName} adicionado!`, 'success');
}

// ==================== RENDER SELECTED VEHICLES ====================
function renderSelectedVehicles() {
    const container = document.getElementById('selectedVehiclesList');
    if (!container) return;

    if (selectedVehicles.length === 0) {
        container.innerHTML = '<p style="color: #999; font-size: 14px; margin: 0;">Nenhum veículo adicionado</p>';
        return;
    }

    container.innerHTML = selectedVehicles.map((vehicle, index) => {
        const typeIcon = vehicle.type === 'carro' ? '🚗' : '🏍️';
        const yearsText = vehicle.years === 'all'
            ? 'Todos os anos'
            : formatYearsRange(vehicle.years);

        return `
            <div class="selected-vehicle-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid ${vehicle.type === 'carro' ? '#ff6600' : '#17a2b8'};">
                <div>
                    <span style="font-weight: 600;">${typeIcon} ${vehicle.brandName} ${vehicle.modelName}</span>
                    <span style="color: #666; font-size: 13px; margin-left: 8px;">(${yearsText})</span>
                </div>
                <button type="button" onclick="removeVehicle(${index})" style="background: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px;" title="Remover">×</button>
            </div>
        `;
    }).join('');
}

// ==================== FORMAT YEARS RANGE ====================
function formatYearsRange(years) {
    if (!years || years.length === 0) return '';
    if (years.length === 1) return years[0].toString();

    years.sort((a, b) => a - b);

    // Verificar se são anos consecutivos
    let isConsecutive = true;
    for (let i = 1; i < years.length; i++) {
        if (years[i] !== years[i - 1] + 1) {
            isConsecutive = false;
            break;
        }
    }

    if (isConsecutive && years.length > 2) {
        return `${years[0]}-${years[years.length - 1]}`;
    } else if (years.length <= 4) {
        return years.join(', ');
    } else {
        return `${years[0]}, ${years[1]}, ... ${years[years.length - 1]}`;
    }
}

// ==================== REMOVE VEHICLE ====================
window.removeVehicle = function (index) {
    selectedVehicles.splice(index, 1);
    renderSelectedVehicles();
    console.log('🗑️ Veículo removido, total:', selectedVehicles.length);
};

// ==================== RESET SELECTS ====================
function resetSelects() {
    const brandSelect = document.getElementById('vehicleBrandSelect');
    const modelSelect = document.getElementById('vehicleModelSelect');
    const allCheckbox = document.getElementById('yearAll');
    const yearCheckboxes = document.querySelectorAll('.year-checkbox');

    if (brandSelect) brandSelect.selectedIndex = 0;
    if (modelSelect) {
        modelSelect.innerHTML = '<option value="">Selecione o modelo</option>';
        modelSelect.disabled = true;
    }
    if (allCheckbox) allCheckbox.checked = false;
    yearCheckboxes.forEach(cb => {
        cb.checked = false;
        cb.disabled = false;
    });
}

// ==================== GET SELECTED VEHICLES ====================
window.getSelectedVehicles = function () {
    // Também incluir compatibilidade manual se houver
    const manualInput = document.getElementById('manualCompatibility');
    const manualVehicles = [];

    if (manualInput && manualInput.value.trim()) {
        const lines = manualInput.value.trim().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                manualVehicles.push({
                    type: 'manual',
                    text: line.trim()
                });
            }
        });
    }

    return {
        structured: selectedVehicles,
        manual: manualVehicles
    };
};

// ==================== SET SELECTED VEHICLES ====================
window.setSelectedVehicles = function (data) {
    selectedVehicles = [];

    if (!data) {
        renderSelectedVehicles();
        return;
    }

    // Carregar dados estruturados
    if (data.structured && Array.isArray(data.structured)) {
        selectedVehicles = data.structured;
    }

    // Carregar dados manuais
    const manualInput = document.getElementById('manualCompatibility');
    if (manualInput && data.manual && Array.isArray(data.manual)) {
        manualInput.value = data.manual.map(v => v.text || v).join('\n');
    }

    renderSelectedVehicles();
    console.log('📥 Veículos carregados:', selectedVehicles.length, 'estruturados');
};

// ==================== CLEAR ALL VEHICLES ====================
window.clearAllVehicles = function () {
    selectedVehicles = [];
    const manualInput = document.getElementById('manualCompatibility');
    if (manualInput) manualInput.value = '';
    renderSelectedVehicles();
    resetSelects();
};

// ==================== SHOW MESSAGE ====================
function showVehicleSelectorMessage(message, type = 'info') {
    const existing = document.querySelector('.vehicle-selector-message');
    if (existing) existing.remove();

    const colors = {
        info: '#3498db',
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c'
    };

    const msgEl = document.createElement('div');
    msgEl.className = 'vehicle-selector-message';
    msgEl.textContent = message;
    msgEl.style.cssText = `
        background: ${colors[type] || colors.info};
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        margin-top: 12px;
        animation: fadeIn 0.3s ease;
    `;

    const container = document.getElementById('vehicleSelectorContainer');
    if (container) container.appendChild(msgEl);

    setTimeout(() => {
        msgEl.style.opacity = '0';
        setTimeout(() => msgEl.remove(), 300);
    }, 3000);
}

// ==================== EXPORT PARA USO GLOBAL ====================
window.initVehicleSelector = initVehicleSelector;
window.getSelectedVehicles = window.getSelectedVehicles;
window.setSelectedVehicles = window.setSelectedVehicles;
window.clearAllVehicles = window.clearAllVehicles;
