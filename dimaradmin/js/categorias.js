/**
 * Categories Management - VERSÃO CORRIGIDA E DEBUGADA
 * Todas as operações CRUD funcionando perfeitamente
 */

// State
let categories = [];
let editingCategoryId = null;

console.log('📦 categorias.js carregado (VERSÃO CORRIGIDA)!');

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando categorias...');

    // Setup de todas as funcionalidades
    setupCategoryForm();
    setupSlugGenerator();
    setupImagePreview();

    // Carregar categorias
    loadCategories();

    console.log('✅ Categorias inicializadas');
});

// ==================== CARREGAR CATEGORIAS ====================
async function loadCategories() {
    console.log('📥 Carregando categorias...');

    try {
        if (checkSupabaseConfig()) {
            const { data, error } = await supabaseClient
                .from('categories')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            categories = data || [];
            console.log(`✅ ${categories.length} categorias carregadas do Supabase`);
        } else {
            const stored = localStorage.getItem('dimar_categories');
            categories = stored ? JSON.parse(stored) : getDefaultCategories();
            console.log(`✅ ${categories.length} categorias carregadas do localStorage`);
        }

        renderCategories();
    } catch (error) {
        console.error('❌ Erro ao carregar categorias:', error);
        alert('Erro ao carregar categorias: ' + error.message);
    }
}

// ==================== DEFAULT CATEGORIES ====================
function getDefaultCategories() {
    return [
        { id: 'cat_1', name: 'Motor', slug: 'motor', description: 'Peças para motor', is_active: true },
        { id: 'cat_2', name: 'Freios', slug: 'freios', description: 'Sistemas de freio', is_active: true },
        { id: 'cat_3', name: 'Suspensão', slug: 'suspensao', description: 'Peças de suspensão', is_active: true },
        { id: 'cat_4', name: 'Elétrica', slug: 'eletrica', description: 'Componentes elétricos', is_active: true },
        { id: 'cat_5', name: 'Filtros', slug: 'filtros', description: 'Filtros automotivos', is_active: true },
        { id: 'cat_6', name: 'Iluminação', slug: 'iluminacao', description: 'Lâmpadas e faróis', is_active: true },
        { id: 'cat_7', name: 'Acessórios', slug: 'acessorios', description: 'Acessórios diversos', is_active: true }
    ];
}

// ==================== RENDERIZAR TABELA ====================
function renderCategories() {
    const tbody = document.getElementById('categoriesTableBody');
    const countEl = document.getElementById('categoryCount');

    if (!tbody || !countEl) {
        console.error('❌ Elementos da tabela não encontrados');
        return;
    }

    countEl.textContent = categories.length;

    if (categories.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #7f8c8d;">
                    Nenhuma categoria cadastrada.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = categories.map(category => `
        <tr>
            <td><strong>${category.name}</strong></td>
            <td><code>${category.slug}</code></td>
            <td>${category.description || '-'}</td>
            <td>
                <span class="badge ${category.is_active ? 'badge-success' : 'badge-danger'}">
                    ${category.is_active ? 'Ativa' : 'Inativa'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="window.editCategory('${category.id}')" title="Editar">
                    ✏️
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.deleteCategory('${category.id}')" title="Excluir">
                    🗑️
                </button>
            </td>
        </tr>
    `).join('');

    console.log('✅ Tabela renderizada com', categories.length, 'categorias');
}

// ==================== SETUP FORM ====================
function setupCategoryForm() {
    const form = document.getElementById('categoryForm');

    if (!form) {
        console.error('❌ Formulário não encontrado!');
        return;
    }

    form.addEventListener('submit', async (e) => {
        console.log('🎯 Form submit disparado!');
        e.preventDefault();
        await saveCategory();
    });

    console.log('✅ Form listener configurado');
}

// ==================== SETUP SLUG GENERATOR ====================
function setupSlugGenerator() {
    const nameInput = document.getElementById('categoryName');
    const slugInput = document.getElementById('categorySlug');

    if (nameInput && slugInput) {
        nameInput.addEventListener('input', (e) => {
            if (!editingCategoryId) {
                const slug = e.target.value
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
                slugInput.value = slug;
            }
        });
        console.log('✅ Gerador de slug configurado');
    }
}

// ==================== SETUP IMAGE PREVIEW ====================
function setupImagePreview() {
    console.log('✅ Preview de imagem configurado');
}

// ==================== PREVIEW IMAGE ====================
window.previewCategoryImage = function (event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            alert('⚠️ Imagem muito grande! Tamanho máximo: 2MB');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
};

// ==================== OPEN MODAL ====================
window.openCategoryModal = function (categoryId = null) {
    console.log('🔓 Abrindo modal...', categoryId ? `Editar: ${categoryId}` : 'Nova categoria');

    editingCategoryId = categoryId;

    if (categoryId) {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
            document.getElementById('categoryId').value = category.id;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categorySlug').value = category.slug;
            document.getElementById('categoryDescription').value = category.description || '';
            document.getElementById('categoryStatus').value = category.is_active ? 'active' : 'inactive';

            if (category.image_url) {
                document.getElementById('previewImg').src = category.image_url;
                document.getElementById('imagePreview').style.display = 'block';
            }

            document.querySelector('#categoryModal h2').textContent = 'Editar Categoria';
            console.log('✅ Categoria carregada para edição:', category.name);
        }
    } else {
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryId').value = '';
        document.getElementById('imagePreview').style.display = 'none';
        document.querySelector('#categoryModal h2').textContent = 'Adicionar Categoria';
        console.log('✅ Formulário limpo para nova categoria');
    }

    document.getElementById('categoryModal').style.display = 'block';
};

// ==================== CLOSE MODAL ====================
window.closeCategoryModal = function () {
    console.log('🔒 Fechando modal...');
    document.getElementById('categoryModal').style.display = 'none';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('categoryImage').value = '';
    editingCategoryId = null;
};

// ==================== SAVE CATEGORY ====================
async function saveCategory() {
    console.log('💾 Salvando categoria...');

    // Validação
    const name = document.getElementById('categoryName').value.trim();
    const slug = document.getElementById('categorySlug').value.trim();

    if (!name || !slug) {
        alert('⚠️ Nome e Slug são obrigatórios!');
        return;
    }

    // Preparar dados
    const categoryData = {
        name: name,
        slug: slug,
        description: document.getElementById('categoryDescription').value,
        is_active: document.getElementById('categoryStatus').value === 'active',
        image_url: null
    };

    // Adicionar imagem se houver
    const imageFile = document.getElementById('categoryImage').files[0];
    if (imageFile) {
        console.log('📷 Processando imagem...');
        const reader = new FileReader();
        const base64Image = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(imageFile);
        });
        categoryData.image_url = base64Image;
    }

    console.log('📦 Dados preparados:', { ...categoryData, image_url: categoryData.image_url ? '[imagem base64]' : null });

    try {
        const useSupabase = checkSupabaseConfig();
        console.log('🔌 Usando:', useSupabase ? 'Supabase' : 'localStorage');

        if (useSupabase) {
            if (editingCategoryId) {
                console.log('✏️ Atualizando categoria ID:', editingCategoryId);
                const { data, error } = await supabaseClient
                    .from('categories')
                    .update(categoryData)
                    .eq('id', editingCategoryId)
                    .select();

                if (error) throw error;
                console.log('✅ Categoria atualizada:', data);
            } else {
                console.log('➕ Inserindo nova categoria');
                const { data, error } = await supabaseClient
                    .from('categories')
                    .insert([categoryData])
                    .select();

                if (error) throw error;
                console.log('✅ Categoria criada:', data);
            }
        } else {
            if (editingCategoryId) {
                const index = categories.findIndex(c => c.id === editingCategoryId);
                categories[index] = { ...categoryData, id: editingCategoryId };
            } else {
                categoryData.id = 'cat_' + Date.now();
                categories.push(categoryData);
            }
            localStorage.setItem('dimar_categories', JSON.stringify(categories));
            console.log('✅ Salvo no localStorage');
        }

        alert('✅ ' + (editingCategoryId ? 'Categoria atualizada!' : 'Categoria adicionada!'));
        window.closeCategoryModal();
        await loadCategories();

    } catch (error) {
        console.error('❌ ERRO ao salvar:', error);
        let errorMsg = '❌ Erro ao salvar categoria:\n\n' + error.message;
        if (error.code) errorMsg += '\n\nCódigo: ' + error.code;
        if (error.hint) errorMsg += '\nDica: ' + error.hint;
        alert(errorMsg);
    }
}

// ==================== EDIT CATEGORY ====================
window.editCategory = function (categoryId) {
    console.log('✏️ Editar categoria:', categoryId);
    window.openCategoryModal(categoryId);
};

// ==================== DELETE CATEGORY ====================
window.deleteCategory = async function (categoryId) {
    console.log('🗑️ Deletar categoria:', categoryId);

    const category = categories.find(c => c.id === categoryId);
    if (!category) {
        alert('❌ Categoria não encontrada!');
        return;
    }

    if (!confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
        console.log('❌ Exclusão cancelada');
        return;
    }

    try {
        if (checkSupabaseConfig()) {
            console.log('🗑️ Deletando do Supabase...');
            const { error } = await supabaseClient
                .from('categories')
                .delete()
                .eq('id', categoryId);

            if (error) throw error;
            console.log('✅ Categoria deletada do Supabase');
        } else {
            categories = categories.filter(c => c.id !== categoryId);
            localStorage.setItem('dimar_categories', JSON.stringify(categories));
            console.log('✅ Categoria deletada do localStorage');
        }

        alert('✅ Categoria excluída com sucesso!');
        await loadCategories();

    } catch (error) {
        console.error('❌ Erro ao excluir:', error);
        alert('❌ Erro ao excluir categoria:\n\n' + error.message);
    }
};

console.log('✅ categorias.js totalmente carregado!');
