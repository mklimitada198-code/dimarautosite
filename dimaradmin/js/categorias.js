/**
 * Categories Management
 */

// State
let categories = [];
let editingCategoryId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    setupCategoryForm();
});

/**
 * Load categories from Supabase
 */
async function loadCategories() {
    try {
        if (checkSupabaseConfig()) {
            const { data, error } = await supabaseClient
                .from('categories')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            categories = data || [];
        } else {
            const stored = localStorage.getItem('dimar_categories');
            categories = stored ? JSON.parse(stored) : getDefaultCategories();
        }

        renderCategories();
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        alert('Erro ao carregar categorias: ' + error.message);
    }
}

/**
 * Default categories
 */
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

/**
 * Render categories table
 */
function renderCategories() {
    const tbody = document.getElementById('categoriesTableBody');
    const countEl = document.getElementById('categoryCount');

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
                <button class="btn btn-sm btn-warning" onclick="editCategory('${category.id}')" title="Editar">
                    ✏️
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCategory('${category.id}')" title="Excluir">
                    🗑️
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Setup category form
 */
function setupCategoryForm() {
    document.getElementById('categoryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveCategory();
    });
}

/**
 * Open category modal
 */
function openCategoryModal(categoryId = null) {
    editingCategoryId = categoryId;

    if (categoryId) {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
            document.getElementById('categoryId').value = category.id;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categorySlug').value = category.slug;
            document.getElementById('categoryDescription').value = category.description || '';
            document.getElementById('categoryStatus').value = category.is_active ? 'active' : 'inactive';

            document.querySelector('#categoryModal h2').textContent = 'Editar Categoria';
        }
    } else {
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryId').value = '';
        document.querySelector('#categoryModal h2').textContent = 'Adicionar Categoria';
    }

    document.getElementById('categoryModal').style.display = 'block';
}

/**
 * Close category modal
 */
function closeCategoryModal() {
    document.getElementById('categoryModal').style.display = 'none';
    editingCategoryId = null;
}

/**
 * Save category
 */
async function saveCategory() {
    const categoryData = {
        name: document.getElementById('categoryName').value,
        slug: document.getElementById('categorySlug').value,
        description: document.getElementById('categoryDescription').value,
        is_active: document.getElementById('categoryStatus').value === 'active'
    };

    try {
        if (checkSupabaseConfig()) {
            if (editingCategoryId) {
                const { error } = await supabaseClient
                    .from('categories')
                    .update(categoryData)
                    .eq('id', editingCategoryId);

                if (error) throw error;
            } else {
                const { error } = await supabaseClient
                    .from('categories')
                    .insert([categoryData]);

                if (error) throw error;
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
        }

        alert(editingCategoryId ? 'Categoria atualizada!' : 'Categoria adicionada!');
        closeCategoryModal();
        await loadCategories();

    } catch (error) {
        console.error('Erro ao salvar categoria:', error);
        alert('Erro ao salvar categoria: ' + error.message);
    }
}

/**
 * Edit category
 */
function editCategory(categoryId) {
    openCategoryModal(categoryId);
}

/**
 * Delete category
 */
async function deleteCategory(categoryId) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
        return;
    }

    try {
        if (checkSupabaseConfig()) {
            const { error } = await supabaseClient
                .from('categories')
                .delete()
                .eq('id', categoryId);

            if (error) throw error;
        } else {
            categories = categories.filter(c => c.id !== categoryId);
            localStorage.setItem('dimar_categories', JSON.stringify(categories));
        }

        alert('Categoria excluída!');
        await loadCategories();

    } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        alert('Erro ao excluir categoria: ' + error.message);
    }
}

// Auto-generate slug from name
document.addEventListener('DOMContentLoaded', () => {
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
    }
});
