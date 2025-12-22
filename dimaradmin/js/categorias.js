/**
 * Categories Management - VERSÃO CORRIGIDA E DEBUGADA
 * Todas as operações CRUD funcionando perfeitamente
 */

// State
let categories = [];
let editingCategoryId = null;

// UUID Validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(uuid) {
    return UUID_REGEX.test(uuid);
}

// Gerar UUID v4 válido
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function validateCategoryID(id, operation) {
    if (!isValidUUID(id)) {
        const error = `❌ ID inválido para ${operation}!\n\n` +
            `Esperado: UUID (ex: 550e8400-e29b-...)\n` +
            `Recebido: "${id}"\n\n` +
            `Este é um erro do sistema. Recarregue a página.`;
        showCustomAlert('Erro de Sistema', error);
        console.error('❌ UUID inválido:', { id, operation });
        return false;
    }
    return true;
}

console.log('📦 categorias.js carregado (VERSÃO CORRIGIDA COM UUID VALIDATION)!');

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

            // ✅ VALIDAR UUIDs ao carregar
            const invalidIds = categories.filter(c => !isValidUUID(c.id));
            if (invalidIds.length > 0) {
                console.error('❌ IDs inválidos detectados:', invalidIds.map(c => c.id));
                throw new Error('Dados corrompidos no banco. IDs inválidos: ' + invalidIds.map(c => c.name).join(', '));
            }

            console.log(`✅ ${categories.length} categorias carregadas do Supabase (todas com UUID válido)`);
        } else {
            // ✅ FALLBACK: Usar localStorage com UUIDs válidos
            console.warn('⚠️ Supabase não disponível, usando localStorage...');
            const stored = localStorage.getItem('dimar_categories');
            if (stored) {
                categories = JSON.parse(stored);
                // Validar e corrigir IDs inválidos
                categories = categories.map(cat => {
                    if (!isValidUUID(cat.id)) {
                        console.warn(`⚠️ Corrigindo ID inválido para categoria ${cat.name}`);
                        return { ...cat, id: generateUUID() };
                    }
                    return cat;
                });
                localStorage.setItem('dimar_categories', JSON.stringify(categories));
            } else {
                categories = getDefaultCategories();
            }
            console.log(`✅ ${categories.length} categorias carregadas do localStorage`);
        }

        renderCategories();
    } catch (error) {
        console.error('❌ Erro CRÍTICO ao carregar categorias:', error);
        showCustomAlert('Erro Crítico',
            '❌ Não foi possível carregar categorias!\n\n' +
            'Motivo: ' + error.message + '\n\n' +
            '🔧 Ações:\n' +
            '• Verifique se está logado\n' +
            '• Recarregue a página (Ctrl+Shift+R)\n' +
            '• Se persistir, contate o suporte'
        );
        categories = [];
        renderCategories(); // Mostrar tabela vazia com mensagem
    }
}

// ==================== DEFAULT CATEGORIES (COM UUIDs VÁLIDOS) ====================
function getDefaultCategories() {
    return [
        { id: generateUUID(), name: 'Motor', slug: 'motor', description: 'Peças para motor', is_active: true },
        { id: generateUUID(), name: 'Freios', slug: 'freios', description: 'Sistemas de freio', is_active: true },
        { id: generateUUID(), name: 'Suspensão', slug: 'suspensao', description: 'Peças de suspensão', is_active: true },
        { id: generateUUID(), name: 'Elétrica', slug: 'eletrica', description: 'Componentes elétricos', is_active: true },
        { id: generateUUID(), name: 'Filtros', slug: 'filtros', description: 'Filtros automotivos', is_active: true },
        { id: generateUUID(), name: 'Iluminação', slug: 'iluminacao', description: 'Lâmpadas e faróis', is_active: true },
        { id: generateUUID(), name: 'Acessórios', slug: 'acessorios', description: 'Acessórios diversos', is_active: true }
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
        <tr data-category-id="${category.id}" data-category-name="${category.name}" data-category-slug="${category.slug}">
            <td><strong>${category.name}</strong></td>
            <td><code>${category.slug}</code></td>
            <td>${category.description || '-'}</td>
            <td>
                <span class="badge ${category.is_active ? 'badge-success' : 'badge-danger'}">
                    ${category.is_active ? 'Ativa' : 'Inativa'}
                </span>
            </td>
            <td style="white-space: nowrap;">
                <button 
                    class="btn btn-sm btn-warning edit-category-btn"
                    data-category-id="${category.id}"
                    title="Editar categoria"
                    style="margin-right: 4px; min-width: 38px; transition: all 0.2s;"
                    onmouseover="this.style.transform='scale(1.05)'"
                    onmouseout="this.style.transform='scale(1)'"
                >
                    ✏️ Editar
                </button>
                <button 
                    class="btn btn-sm btn-danger delete-category-btn"
                    data-category-id="${category.id}"
                    title="Excluir categoria permanentemente"
                    style="min-width: 38px; transition: all 0.2s;"
                    onmouseover="this.style.transform='scale(1.05)'; this.style.backgroundColor='#c0392b'"
                    onmouseout="this.style.transform='scale(1)'; this.style.backgroundColor=''"
                >
                    🗑️ Excluir
                </button>
            </td>
        </tr>
    `).join('');

    console.log('✅ Tabela renderizada com', categories.length, 'categorias');
    setupActionButtons();
}

// ==================== SETUP ACTION BUTTONS ====================
function setupActionButtons() {
    const tbody = document.getElementById('categoriesTableBody');
    if (!tbody) return;

    // Remove existing listeners to avoid duplicates
    const existingClone = tbody.cloneNode(true);
    tbody.parentNode.replaceChild(existingClone, tbody);
    const newTbody = document.getElementById('categoriesTableBody');

    // Event delegation for Edit buttons
    newTbody.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-category-btn');
        if (editBtn) {
            e.preventDefault();
            const categoryId = editBtn.dataset.categoryId;
            console.log('✏️ Botão EDITAR clicado!', categoryId);
            window.editCategory(categoryId);
        }
    });

    // Event delegation for Delete buttons
    newTbody.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-category-btn');
        if (deleteBtn) {
            e.preventDefault();
            const categoryId = deleteBtn.dataset.categoryId;
            const row = deleteBtn.closest('tr');
            const categoryName = row.dataset.categoryName;
            console.log('🗑️ Botão EXCLUIR clicado!', categoryId, categoryName);
            window.deleteCategory(categoryId, categoryName);
        }
    });

    console.log('✅ Event listeners dos botões configurados');
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
            showCustomAlert('Aviso', '⚠️ Imagem muito grande!\n\nTamanho máximo permitido: 2MB\nTamanho da imagem: ' + (file.size / 1024 / 1024).toFixed(2) + 'MB');
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
    console.log('📝 editingCategoryId:', editingCategoryId);

    // Validação
    const name = document.getElementById('categoryName').value.trim();
    const slug = document.getElementById('categorySlug').value.trim();

    if (!name || !slug) {
        showCustomAlert('Erro de Validação', '⚠️ Campos obrigatórios não preenchidos!\n\n• Nome da categoria\n• Slug\n\nPor favor, preencha ambos os campos.');
        return;
    }

    // Verificar se já existe uma categoria com este nome (exceto a que estamos editando)
    const existingCategory = categories.find(c =>
        c.name.toLowerCase() === name.toLowerCase() &&
        c.id !== editingCategoryId
    );

    if (existingCategory) {
        showCustomAlert('Nome Duplicado', `⚠️ Já existe uma categoria com o nome "${name}"!\n\nPor favor, escolha outro nome.`);
        return;
    }

    // Verificar se já existe uma categoria com este slug (exceto a que estamos editando)
    const existingSlug = categories.find(c =>
        c.slug.toLowerCase() === slug.toLowerCase() &&
        c.id !== editingCategoryId
    );

    if (existingSlug) {
        showCustomAlert('Slug Duplicado', `⚠️ Já existe uma categoria com o slug "${slug}"!\n\nPor favor, escolha outro slug.`);
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
    } else if (editingCategoryId) {
        // Manter imagem existente se não foi alterada
        const existingCat = categories.find(c => c.id === editingCategoryId);
        if (existingCat && existingCat.image_url) {
            categoryData.image_url = existingCat.image_url;
        }
    }

    console.log('📦 Dados preparados:', { ...categoryData, image_url: categoryData.image_url ? '[imagem]' : null });

    try {
        const useSupabase = checkSupabaseConfig();
        console.log('🔌 Usando:', useSupabase ? 'Supabase' : 'localStorage');

        if (useSupabase) {
            if (editingCategoryId) {
                console.log('✏️ ATUALIZANDO categoria ID:', editingCategoryId);
                const { data, error } = await supabaseClient
                    .from('categories')
                    .update(categoryData)
                    .eq('id', editingCategoryId)
                    .select();

                if (error) throw error;
                console.log('✅ Categoria atualizada:', data);
            } else {
                console.log('➕ INSERINDO nova categoria');
                const { data, error } = await supabaseClient
                    .from('categories')
                    .insert([categoryData])
                    .select();

                if (error) throw error;
                console.log('✅ Categoria criada:', data);
            }
        } else {
            // ✅ FALLBACK: Usar localStorage
            if (editingCategoryId) {
                const index = categories.findIndex(c => c.id === editingCategoryId);
                if (index !== -1) {
                    categories[index] = { ...categoryData, id: editingCategoryId };
                }
            } else {
                categoryData.id = generateUUID();
                categories.push(categoryData);
            }
            localStorage.setItem('dimar_categories', JSON.stringify(categories));
            console.log('✅ Categoria salva no localStorage');
        }

        showCustomAlert('Sucesso', '✅ ' + (editingCategoryId ? 'Categoria atualizada com sucesso!' : 'Categoria adicionada com sucesso!') + '\n\nA tabela será atualizada automaticamente.');
        window.closeCategoryModal();
        await loadCategories();

    } catch (error) {
        console.error('❌ ERRO ao salvar:', error);

        let errorMsg = '❌ Erro ao salvar categoria!\n\n';

        // Tratamento específico para erros comuns
        if (error.code === '23505') {
            if (error.message.includes('name')) {
                errorMsg += `O nome "${name}" já está sendo usado por outra categoria.\n\nEscolha um nome diferente.`;
            } else if (error.message.includes('slug')) {
                errorMsg += `O slug "${slug}" já está sendo usado por outra categoria.\n\nEscolha um slug diferente.`;
            } else {
                errorMsg += 'Já existe uma categoria com esses dados.\n\nVerifique nome e slug.';
            }
        } else {
            errorMsg += error.message;
            if (error.code) errorMsg += '\n\nCódigo: ' + error.code;
        }

        showCustomAlert('Erro', errorMsg);
    }
}

// ==================== EDIT CATEGORY ====================
window.editCategory = function (categoryId) {
    console.log('✏️ Editar categoria:', categoryId);

    // ✅ VALIDAR UUID antes de editar
    if (!validateCategoryID(categoryId, 'edição')) {
        console.error('❌ Operação de edição bloqueada: ID inválido');
        return;
    }

    window.openCategoryModal(categoryId);
};

// ==================== DELETE CATEGORY ====================
window.deleteCategory = async function (categoryId, categoryName) {
    console.log('🗑️ Deletar categoria:', categoryId, categoryName);

    // ✅ VALIDAR UUID antes de deletar
    if (!validateCategoryID(categoryId, 'exclusão')) {
        console.error('❌ Operação de exclusão bloqueada: ID inválido');
        return;
    }

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
// ==================== CUSTOM MODAL DIALOGS ====================
function showCustomConfirm(title, message) {
    return new Promise((resolve) => {
        // Remove existing modal if any
        const existing = document.getElementById('customConfirmModal');
        if (existing) existing.remove();

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'customConfirmModal';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;';

        modal.innerHTML = `
            <div style="background: white; border-radius: 16px; padding: 30px; max-width: 500px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <h2 style="margin: 0 0 20px 0; color: #e74c3c; font-size: 24px; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 32px;">⚠️</span>
                    ${title}
                </h2>
                <div style="white-space: pre-wrap; line-height: 1.6; color: #2c3e50; margin-bottom: 30px; font-size: 16px;">
                    ${message}
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button id="confirmCancel" style="padding: 12px 24px; border: 2px solid #95a5a6; background: white; color: #2c3e50; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">
                        Cancelar
                    </button>
                    <button id="confirmOk" style="padding: 12px 24px; border: none; background: #e74c3c; color: white; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">
                        Sim, Excluir
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('confirmOk').onclick = () => {
            modal.remove();
            resolve(true);
        };

        document.getElementById('confirmCancel').onclick = () => {
            modal.remove();
            resolve(false);
        };

        // Close on backdrop click
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
                resolve(false);
            }
        };

        // Focus OK button
        setTimeout(() => document.getElementById('confirmOk').focus(), 100);
    });
}

function showCustomAlert(title, message) {
    // Remove existing modal if any
    const existing = document.getElementById('customAlertModal');
    if (existing) existing.remove();

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'customAlertModal';
    modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;';

    const icon = title.includes('Sucesso') ? '✅' : title.includes('Erro') ? '❌' : 'ℹ️';
    const color = title.includes('Sucesso') ? '#2ecc71' : title.includes('Erro') ? '#e74c3c' : '#3498db';

    modal.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 30px; max-width: 500px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
            <h2 style="margin:  0 0 20px 0; color: ${color}; font-size: 24px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 32px;">${icon}</span>
                ${title}
            </h2>
            <div style="white-space: pre-wrap; line-height: 1.6; color: #2c3e50; margin-bottom: 30px; font-size: 16px;">
                ${message}
            </div>
            <div style="display: flex; justify-content: flex-end;">
                <button id="alertOk" style="padding: 12px 32px; border: none; background: ${color}; color: white; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">
                    OK
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listener
    document.getElementById('alertOk').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    // Focus OK button
    setTimeout(() => document.getElementById('alertOk').focus(), 100);
}

console.log('✅ categorias.js totalmente carregado!');
