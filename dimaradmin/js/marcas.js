/**
 * Brands Management
 */

// State
let brands = [];
let selectedBrandLogo = null;
let editingBrandId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadBrands();
    setupBrandLogoUpload();
    setupBrandForm();
});

/**
 * Load brands from Supabase
 */
async function loadBrands() {
    try {
        if (checkSupabaseConfig()) {
            const { data, error } = await supabaseClient
                .from('brands')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            brands = data || [];
        } else {
            const stored = localStorage.getItem('dimar_brands');
            brands = stored ? JSON.parse(stored) : getDefaultBrands();
        }

        renderBrands();
    } catch (error) {
        console.error('Erro ao carregar marcas:', error);
        alert('Erro ao carregar marcas: ' + error.message);
    }
}

/**
 * Default brands
 */
function getDefaultBrands() {
    return [
        { id: 'brand_1', name: 'Bosch', logo_url: '../assets/images/bosch.png', is_active: true },
        { id: 'brand_2', name: 'Fiat', logo_url: '../assets/images/fiat.png', is_active: true },
        { id: 'brand_3', name: 'Hyundai', logo_url: '../assets/images/hyundai.png', is_active: true },
        { id: 'brand_4', name: 'NGK', logo_url: '../assets/images/ngk.png', is_active: true },
        { id: 'brand_5', name: 'Toyota', logo_url: '../assets/images/toyota.png', is_active: true },
        { id: 'brand_6', name: 'Ford', logo_url: '../assets/images/ford.png', is_active: true },
        { id: 'brand_7', name: 'Tete', logo_url: '../assets/images/tete.png', is_active: true },
        { id: 'brand_8', name: 'Mobil', logo_url: '../assets/images/mobil.png', is_active: true },
        { id: 'brand_9', name: 'Dayco', logo_url: '../assets/images/dayco.png', is_active: true }
    ];
}

/**
 * Render brands table
 */
function renderBrands() {
    const tbody = document.getElementById('brandsTableBody');
    const countEl = document.getElementById('brandCount');

    countEl.textContent = brands.length;

    if (brands.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #7f8c8d;">
                    Nenhuma marca cadastrada.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = brands.map(brand => `
        <tr>
            <td>
                <img src="${brand.logo_url}" alt="${brand.name}" style="height: 40px; object-fit: contain;">
            </td>
            <td><strong>${brand.name}</strong></td>
            <td>
                <span class="badge ${brand.is_active ? 'badge-success' : 'badge-danger'}">
                    ${brand.is_active ? 'Ativa' : 'Inativa'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editBrand('${brand.id}')" title="Editar">
                    ✏️
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteBrand('${brand.id}')" title="Excluir">
                    🗑️
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Setup brand logo upload
 */
function setupBrandLogoUpload() {
    const uploadArea = document.getElementById('brandLogoUploadArea');
    const input = document.getElementById('brandLogoInput');

    uploadArea.addEventListener('click', () => input.click());

    input.addEventListener('change', handleBrandLogoSelect);

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
        handleBrandLogoSelect({ target: { files: e.dataTransfer.files } });
    });
}

/**
 * Handle brand logo selection
 */
function handleBrandLogoSelect(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 2MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        selectedBrandLogo = event.target.result;
        renderBrandLogoPreview();
    };
    reader.readAsDataURL(file);
}

/**
 * Render brand logo preview
 */
function renderBrandLogoPreview() {
    const preview = document.getElementById('brandLogoPreview');

    if (!selectedBrandLogo) {
        preview.innerHTML = '';
        return;
    }

    preview.innerHTML = `
        <div style="position: relative; margin-top: 20px; text-align: center;">
            <img src="${selectedBrandLogo}" alt="Preview" style="max-width: 200px; max-height: 100px; object-fit: contain; border: 2px solid var(--border-color); border-radius: 8px; padding: 10px; background: white;">
            <button type="button" onclick="removeBrandLogo()" style="position: absolute; top: -5px; right: calc(50% - 100px - 16px); background: var(--danger); color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 20px;">×</button>
        </div>
    `;
}

/**
 * Remove brand logo
 */
function removeBrandLogo() {
    selectedBrandLogo = null;
    renderBrandLogoPreview();
    document.getElementById('brandLogoInput').value = '';
}

/**
 * Setup brand form
 */
function setupBrandForm() {
    document.getElementById('brandForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveBrand();
    });
}

/**
 * Open brand modal
 */
function openBrandModal(brandId = null) {
    editingBrandId = brandId;
    selectedBrandLogo = null;

    if (brandId) {
        const brand = brands.find(b => b.id === brandId);
        if (brand) {
            document.getElementById('brandId').value = brand.id;
            document.getElementById('brandName').value = brand.name;
            document.getElementById('brandStatus').value = brand.is_active ? 'active' : 'inactive';

            selectedBrandLogo = brand.logo_url;
            renderBrandLogoPreview();

            document.querySelector('#brandModal h2').textContent = 'Editar Marca';
        }
    } else {
        document.getElementById('brandForm').reset();
        document.getElementById('brandId').value = '';
        renderBrandLogoPreview();
        document.querySelector('#brandModal h2').textContent = 'Adicionar Marca';
    }

    document.getElementById('brandModal').style.display = 'block';
}

/**
 * Close brand modal
 */
function closeBrandModal() {
    document.getElementById('brandModal').style.display = 'none';
    editingBrandId = null;
    selectedBrandLogo = null;
}

/**
 * Save brand
 */
// Função auxiliar para gerar slug único
async function generateUniqueSlug(baseSlug, currentId = null) {
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
        // Verificar se slug existe
        let query = supabaseClient
            .from('brands')
            .select('id')
            .eq('slug', slug);

        if (currentId) {
            query = query.neq('id', currentId);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data.length === 0) {
            isUnique = true;
        } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }
    return slug;
}

/**
 * Save brand
 */
async function saveBrand() {
    if (!selectedBrandLogo) {
        alert('Por favor, adicione um logo para a marca.');
        return;
    }

    const name = document.getElementById('brandName').value.trim();
    if (!name) {
        alert('Por favor, informe o nome da marca.');
        return;
    }

    // Gerar slug base
    let baseSlug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífen
        .replace(/-+/g, '-') // Remove hífens duplicados
        .replace(/^-+|-+$/g, ''); // Remove hífen do início/fim

    const brandData = {
        name: name,
        logo_url: selectedBrandLogo,
        is_active: document.getElementById('brandStatus').value === 'active'
    };

    try {
        if (checkSupabaseConfig()) {
            // Garantir slug único
            const uniqueSlug = await generateUniqueSlug(baseSlug, editingBrandId);
            brandData.slug = uniqueSlug;

            if (editingBrandId) {
                const { error } = await supabaseClient
                    .from('brands')
                    .update(brandData)
                    .eq('id', editingBrandId);

                if (error) throw error;
            } else {
                const { error } = await supabaseClient
                    .from('brands')
                    .insert([brandData]);

                if (error) throw error;
            }
        } else {
            // LocalStorage fallback
            if (editingBrandId) {
                const index = brands.findIndex(b => b.id === editingBrandId);
                // Atualizar slug também se local, mas sem verificação complexa
                brandData.slug = baseSlug;
                brands[index] = { ...brandData, id: editingBrandId };
            } else {
                brandData.slug = baseSlug;
                brandData.id = 'brand_' + Date.now();
                brands.push(brandData);
            }

            localStorage.setItem('dimar_brands', JSON.stringify(brands));
        }

        alert(editingBrandId ? 'Marca atualizada!' : 'Marca adicionada!');
        closeBrandModal();
        await loadBrands();

    } catch (error) {
        console.error('Erro ao salvar marca:', error);

        if (error.code === '23505' || error.message.includes('duplicate key')) {
            alert('Erro: Já existe uma marca com este nome/identificador.');
        } else {
            alert('Erro ao salvar marca: ' + error.message);
        }
    }
}

/**
 * Edit brand
 */
function editBrand(brandId) {
    openBrandModal(brandId);
}

/**
 * Delete brand
 */
async function deleteBrand(brandId) {
    if (!confirm('Tem certeza que deseja excluir esta marca?')) {
        return;
    }

    try {
        if (checkSupabaseConfig()) {
            const { error } = await supabaseClient
                .from('brands')
                .delete()
                .eq('id', brandId);

            if (error) throw error;
        } else {
            brands = brands.filter(b => b.id !== brandId);
            localStorage.setItem('dimar_brands', JSON.stringify(brands));
        }

        alert('Marca excluída!');
        await loadBrands();

    } catch (error) {
        console.error('Erro ao excluir marca:', error);
        alert('Erro ao excluir marca: ' + error.message);
    }
}
