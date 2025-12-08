/**
 * Products Management
 */

// State
let products = [];
let selectedImages = [];
let editingProductId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupImageUpload();
    setupFilters();
    setupProductForm();
});

/**
 * Load products from Supabase or localStorage
 */
async function loadProducts() {
    try {
        if (checkSupabaseConfig()) {
            // Load from Supabase
            const { data, error } = await supabaseClient
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            products = data || [];
        } else {
            // Load from localStorage (fallback)
            const stored = localStorage.getItem('dimar_products');
            products = stored ? JSON.parse(stored) : [];
        }

        renderProducts();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos: ' + error.message);
    }
}

/**
 * Render products table
 */
function renderProducts(filteredProducts = null) {
    const productsToRender = filteredProducts || products;
    const tbody = document.getElementById('productsTableBody');
    const countEl = document.getElementById('productCount');

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

    tbody.innerHTML = productsToRender.map(product => `
        <tr>
            <td>
                ${product.images && product.images.length > 0 
                    ? `<img src="${product.images[0]}" class="product-image-preview" alt="${product.name}">`
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
                <span class="badge ${product.status === 'active' ? 'badge-success' : 'badge-danger'}">
                    ${product.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editProduct('${product.id}')" title="Editar">
                    ✏️
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')" title="Excluir">
                    🗑️
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Setup image upload
 */
function setupImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const input = document.getElementById('imageInput');

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
}

/**
 * Handle image selection
 */
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

/**
 * Render image previews
 */
function renderImagePreviews() {
    const grid = document.getElementById('imagePreviewGrid');

    if (selectedImages.length === 0) {
        grid.innerHTML = '';
        return;
    }

    grid.innerHTML = selectedImages.map((img, index) => `
        <div class="preview-item">
            <img src="${img}" alt="Preview ${index + 1}">
            <button type="button" class="remove-image" onclick="removeImage(${index})">×</button>
        </div>
    `).join('');
}

/**
 * Remove image from selection
 */
function removeImage(index) {
    selectedImages.splice(index, 1);
    renderImagePreviews();
}

/**
 * Setup filters
 */
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');

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
}

/**
 * Setup product form
 */
function setupProductForm() {
    document.getElementById('productForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveProduct();
    });
}

/**
 * Open product modal
 */
function openProductModal(productId = null) {
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
            document.getElementById('productFeatured').checked = product.is_featured || false;
            document.getElementById('productFastShipping').checked = product.fast_shipping || false;

            selectedImages = product.images || [];
            renderImagePreviews();

            document.querySelector('#productModal h2').textContent = 'Editar Produto';
        }
    } else {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        renderImagePreviews();
        document.querySelector('#productModal h2').textContent = 'Adicionar Produto';
    }

    document.getElementById('productModal').style.display = 'block';
}

/**
 * Close product modal
 */
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    editingProductId = null;
    selectedImages = [];
}

/**
 * Save product
 */
async function saveProduct() {
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
        is_featured: document.getElementById('productFeatured').checked,
        fast_shipping: document.getElementById('productFastShipping').checked,
        images: selectedImages
    };

    try {
        if (checkSupabaseConfig()) {
            // Save to Supabase
            if (editingProductId) {
                const { error } = await supabaseClient
                    .from('products')
                    .update(productData)
                    .eq('id', editingProductId);

                if (error) throw error;
            } else {
                const { error } = await supabaseClient
                    .from('products')
                    .insert([productData]);

                if (error) throw error;
            }
        } else {
            // Save to localStorage
            if (editingProductId) {
                const index = products.findIndex(p => p.id === editingProductId);
                products[index] = { ...productData, id: editingProductId };
            } else {
                productData.id = 'prod_' + Date.now();
                productData.created_at = new Date().toISOString();
                products.push(productData);
            }

            localStorage.setItem('dimar_products', JSON.stringify(products));
        }

        alert(editingProductId ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!');
        closeProductModal();
        await loadProducts();

    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto: ' + error.message);
    }
}

/**
 * Edit product
 */
function editProduct(productId) {
    openProductModal(productId);
}

/**
 * Delete product
 */
async function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }

    try {
        if (checkSupabaseConfig()) {
            const { error } = await supabaseClient
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) throw error;
        } else {
            products = products.filter(p => p.id !== productId);
            localStorage.setItem('dimar_products', JSON.stringify(products));
        }

        alert('Produto excluído com sucesso!');
        await loadProducts();

    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto: ' + error.message);
    }
}

/**
 * Helper functions
 */
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

