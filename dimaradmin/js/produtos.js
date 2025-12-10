/**
 * Products Management - VERSÃO CORRIGIDA E DEBUGADA
 * Todas as operações CRUD funcionando perfeitamente
 */

// State
let products = [];
let selectedImages = [];
let editingProductId = null;

console.log('📦 produtos.js carregado (VERSÃO CORRIGIDA)!');

// ==================== WAIT FOR SUPABASE ====================
function waitForSupabase(callback) {
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds max

    const checkInterval = setInterval(() => {
        attempts++;
        console.log(`⏳ Tentativa ${attempts}/${maxAttempts}: Aguardando Supabase...`);

        if (window.supabaseClient) {
            console.log('✅ Supabase detectado! Inicializando produtos...');
            clearInterval(checkInterval);
            callback();
        } else if (attempts >= maxAttempts) {
            console.warn('⚠️ Timeout aguardando Supabase, usando localStorage');
            clearInterval(checkInterval);
            callback(); // Continue anyway with localStorage
        }
    }, 100);
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM pronto, aguardando Supabase...');

    // ESPERAR Supabase estar pronto ANTES de inicializar
    waitForSupabase(() => {
        console.log('🎯 Iniciando produtos...');
        setupImageUpload();
        setupFilters();
        setupProductForm();
        setupBadgeTypeListener();
        loadProducts();
        console.log('✅ Produtos inicializados');
    });
});

// ==================== CARREGAR PRODUTOS ====================
async function loadProducts() {
    console.log('📥 Carregando produtos...');

    try {
        if (checkSupabaseConfig()) {
            console.log('🔌 Carregando do Supabase...');
            const { data, error } = await supabaseClient
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            products = data || [];
            console.log(`✅ ${products.length} produtos carregados do Supabase`);
        } else {
            console.log('💾 Carregando do localStorage...');
            const stored = localStorage.getItem('dimar_products');
            products = stored ? JSON.parse(stored) : [];
            console.log(`✅ ${products.length} produtos carregados do localStorage`);
        }

        renderProducts();
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos: ' + error.message);
    }
}

// ==================== RENDERIZAR PRODUTOS ====================
function renderProducts(filteredProducts = null) {
    const productsToRender = filteredProducts || products;
    const tbody = document.getElementById('productsTableBody');
    const countEl = document.getElementById('productCount');

    if (!tbody || !countEl) {
        console.error('❌ Elementos da tabela não encontrados');
        return;
    }

    countEl.textContent = productsToRender.length;

    if (productsToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #7f8c8d;">
                    ${filteredProducts ? 'Nenhum produto encontrado com os filtros aplicados.' : 'Nenhum produto cadastrado.<br>Clique em "Adicionar Produto" para começar.'}
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = productsToRender.map(product => {
        const imageUrl = product.images && product.images.length > 0
            ? product.images[0]
            : null;

        return `
        <tr>
            <td>
                ${imageUrl
                ? `<img src="${imageUrl}" class="product-image-preview" alt="${product.name}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">`
                : '<div style="width:80px;height:80px;background:#f0f0f0;border-radius:8px;display:flex;align-items:center;justify-content:center;">📦</div>'
            }
            </td>
            <td><strong>${product.name}</strong></td>
            <td>${product.sku}</td>
            <td><span class="badge badge-${getCategoryColor(product.category)}">${formatCategory(product.category)}</span></td>
            <td>
                ${product.sale_price
                ? `<span style="text-decoration: line-through; color: #999; margin-right: 8px;">R$ ${parseFloat(product.price).toFixed(2)}</span><strong style="color: var(--danger);">R$ ${parseFloat(product.sale_price).toFixed(2)}</strong>`
                : `R$ ${parseFloat(product.price).toFixed(2)}`
            }
            </td>
            <td>${product.stock} un</td>
            <td>
                ${product.badge_type ? `<span class="badge badge-info" style="margin-right: 4px;">${getBadgeLabel(product.badge_type, product.custom_badge_text)}</span>` : ''}
                <span class="badge ${product.status === 'active' ? 'badge-success' : 'badge-danger'}">
                    ${product.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="window.editProduct('${product.id}')" title="Editar">
                    ✏️
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.deleteProduct('${product.id}')" title="Excluir">
                    🗑️
                </button>
            </td>
        </tr>
    `}).join('');

    console.log('✅ Tabela renderizada com', productsToRender.length, 'produtos');
}

// ==================== SETUP IMAGE UPLOAD ====================
function setupImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const input = document.getElementById('imageInput');

    if (!uploadArea || !input) {
        console.warn('⚠️ Elementos de upload de imagem não encontrados');
        return;
    }

    uploadArea.addEventListener('click', () => input.click());
    input.addEventListener('change', handleImageSelect);

    // Drag & drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleImageSelect({ target: { files: e.dataTransfer.files } });
    });

    console.log('✅ Upload de imagem configurado');
}

// ==================== HANDLE IMAGE SELECT ====================
function handleImageSelect(e) {
    const files = Array.from(e.target.files);

    files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
            alert(`Arquivo ${file.name} muito grande. Máximo 5MB.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            selectedImages.push(event.target.result);
            renderImagePreviews();
        };
        reader.readAsDataURL(file);
    });
}

// ==================== RENDER IMAGE PREVIEWS ====================
function renderImagePreviews() {
    const grid = document.getElementById('imagePreviewGrid');

    if (!grid) return;

    if (selectedImages.length === 0) {
        grid.innerHTML = '';
        return;
    }

    grid.innerHTML = selectedImages.map((img, index) => `
        <div class="preview-item">
            <img src="${img}" alt="Preview ${index + 1}">
            <button type="button" class="remove-image" onclick="window.removeImage(${index})">×</button>
        </div>
    `).join('');
}

// ==================== REMOVE IMAGE ====================
window.removeImage = function (index) {
    selectedImages.splice(index, 1);
    renderImagePreviews();
};

// ==================== SETUP FILTERS ====================
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');

    if (!searchInput || !categoryFilter || !statusFilter) {
        console.warn('⚠️ Elementos de filtro não encontrados');
        return;
    }

    const applyFilters = () => {
        let filtered = products;

        // Search
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.sku.toLowerCase().includes(searchTerm) ||
                (p.description && p.description.toLowerCase().includes(searchTerm))
            );
        }

        // Category
        if (categoryFilter.value) {
            filtered = filtered.filter(p => p.category === categoryFilter.value);
        }

        // Status
        if (statusFilter.value) {
            filtered = filtered.filter(p => p.status === statusFilter.value);
        }

        renderProducts(filtered);
    };

    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);

    console.log('✅ Filtros configurados');
}

// ==================== SETUP PRODUCT FORM ====================
function setupProductForm() {
    const form = document.getElementById('productForm');

    if (!form) {
        console.error('❌ Formulário de produto não encontrado!');
        return;
    }

    form.addEventListener('submit', async (e) => {
        console.log('🎯 Form submit disparado!');
        e.preventDefault();
        await saveProduct();
    });

    console.log('✅ Form listener configurado');
}

// ==================== SETUP BADGE TYPE LISTENER ====================
function setupBadgeTypeListener() {
    const badgeTypeSelect = document.getElementById('productBadgeType');
    const customBadgeGroup = document.getElementById('customBadgeGroup');

    if (badgeTypeSelect && customBadgeGroup) {
        badgeTypeSelect.addEventListener('change', (e) => {
            customBadgeGroup.style.display = e.target.value === 'personalizado' ? 'block' : 'none';
        });
        console.log('✅ Badge type listener configurado');
    }
}

// ==================== OPEN PRODUCT MODAL ====================
window.openProductModal = function (productId = null) {
    console.log('🔓 Abrindo modal de produto...', productId ? `Editar: ${productId}` : 'Novo produto');

    editingProductId = productId;
    selectedImages = [];

    if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productSku').value = product.sku;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productBrand').value = product.brand || '';
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productSalePrice').value = product.sale_price || '';
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productStatus').value = product.status;
            document.getElementById('productShortDesc').value = product.short_description || '';
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productFeatured').checked = product.featured || false;
            document.getElementById('productFastShipping').checked = product.fast_shipping || false;
            document.getElementById('productBadgeType').value = product.badge_type || '';
            document.getElementById('productCustomBadge').value = product.custom_badge_text || '';

            const customGroup = document.getElementById('customBadgeGroup');
            customGroup.style.display = product.badge_type === 'personalizado' ? 'block' : 'none';

            selectedImages = product.images || [];
            renderImagePreviews();

            document.querySelector('#productModal h2').textContent = 'Editar Produto';
            console.log('✅ Produto carregado para edição:', product.name);
        }
    } else {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('customBadgeGroup').style.display = 'none';
        renderImagePreviews();
        document.querySelector('#productModal h2').textContent = 'Adicionar Produto';
        console.log('✅ Formulário limpo para novo produto');
    }

    document.getElementById('productModal').style.display = 'block';
};

// ==================== CLOSE PRODUCT MODAL ====================
window.closeProductModal = function () {
    console.log('🔒 Fechando modal...');
    document.getElementById('productModal').style.display = 'none';
    editingProductId = null;
    selectedImages = [];
};

// ==================== SAVE PRODUCT ====================
async function saveProduct() {
    console.log('💾 Salvando produto...');

    const productData = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSku').value,
        category: document.getElementById('productCategory').value,
        brand: document.getElementById('productBrand').value,
        price: parseFloat(document.getElementById('productPrice').value),
        sale_price: document.getElementById('productSalePrice').value ? parseFloat(document.getElementById('productSalePrice').value) : null,
        stock: parseInt(document.getElementById('productStock').value),
        status: document.getElementById('productStatus').value,
        short_description: document.getElementById('productShortDesc').value,
        description: document.getElementById('productDescription').value,
        featured: document.getElementById('productFeatured').checked,
        fast_shipping: document.getElementById('productFastShipping').checked,
        badge_type: document.getElementById('productBadgeType').value || null,
        custom_badge_text: document.getElementById('productCustomBadge').value || null,
        images: selectedImages
    };

    console.log('📦 Dados preparados:', { ...productData, images: `${selectedImages.length} imagens` });

    try {
        if (checkSupabaseConfig()) {
            console.log('🔌 Salvando no Supabase...');

            if (editingProductId) {
                console.log('✏️ Atualizando produto ID:', editingProductId);
                const { data, error } = await supabaseClient
                    .from('products')
                    .update(productData)
                    .eq('id', editingProductId)
                    .select();

                if (error) throw error;
                console.log('✅ Produto atualizado:', data);
            } else {
                console.log('➕ Inserindo novo produto');
                const { data, error } = await supabaseClient
                    .from('products')
                    .insert([productData])
                    .select();

                if (error) throw error;
                console.log('✅ Produto criado:', data);
            }
        } else {
            console.log('💾 Salvando no localStorage...');
            if (editingProductId) {
                const index = products.findIndex(p => p.id === editingProductId);
                products[index] = { ...productData, id: editingProductId };
            } else {
                productData.id = 'prod_' + Date.now();
                productData.created_at = new Date().toISOString();
                products.push(productData);
            }

            localStorage.setItem('dimar_products', JSON.stringify(products));
            console.log('✅ Salvo no localStorage');
        }

        alert('✅ ' + (editingProductId ? 'Produto atualizado!' : 'Produto adicionado!'));
        window.closeProductModal();
        await loadProducts();

    } catch (error) {
        console.error('❌ ERRO ao salvar:', error);
        let errorMsg = '❌ Erro ao salvar produto:\n\n' + error.message;
        if (error.code) errorMsg += '\n\nCódigo: ' + error.code;
        if (error.hint) errorMsg += '\nDica: ' + error.hint;
        alert(errorMsg);
    }
}

// ==================== EDIT PRODUCT ====================
window.editProduct = function (productId) {
    console.log('✏️ Editar produto:', productId);
    window.openProductModal(productId);
};

// ==================== DELETE PRODUCT ====================
window.deleteProduct = async function (productId) {
    console.log('🗑️ Deletar produto:', productId);

    const product = products.find(p => p.id === productId);
    if (!product) {
        alert('❌ Produto não encontrado!');
        return;
    }

    if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
        console.log('❌ Exclusão cancelada');
        return;
    }

    try {
        if (checkSupabaseConfig()) {
            console.log('🗑️ Deletando do Supabase...');
            const { error } = await supabaseClient
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) throw error;
            console.log('✅ Produto deletado do Supabase');
        } else {
            products = products.filter(p => p.id !== productId);
            localStorage.setItem('dimar_products', JSON.stringify(products));
            console.log('✅ Produto deletado do localStorage');
        }

        alert('✅ Produto excluído com sucesso!');
        await loadProducts();

    } catch (error) {
        console.error('❌ Erro ao excluir:', error);
        alert('❌ Erro ao excluir produto:\n\n' + error.message);
    }
};

// ==================== HELPER FUNCTIONS ====================
function formatCategory(category) {
    const categories = {
        motor: 'Motor',
        freios: 'Freios',
        suspensao: 'Suspensão',
        eletrica: 'Elétrica',
        filtros: 'Filtros',
        iluminacao: 'Iluminação',
        acessorios: 'Acessórios'
    };
    return categories[category] || category;
}

function getCategoryColor(category) {
    const colors = {
        motor: 'danger',
        freios: 'warning',
        suspensao: 'success',
        eletrica: 'danger',
        filtros: 'success',
        iluminacao: 'warning',
        acessorios: 'success'
    };
    return colors[category] || 'success';
}

function getBadgeLabel(badgeType, customText) {
    const labels = {
        'destaque': 'Destaque',
        'oferta': 'Oferta',
        'mais-vendido': 'Mais Vendido',
        'personalizado': customText || 'Badge'
    };
    return labels[badgeType] || badgeType;
}

console.log('✅ produtos.js totalmente carregado!');
