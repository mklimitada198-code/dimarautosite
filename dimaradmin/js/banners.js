/**
 * Banners Management
 */

// State
let banners = [];
let selectedBannerImage = null;      // URL ou base64 para preview
let selectedBannerFile = null;       // Arquivo para upload
let editingBannerId = null;
let isUploading = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadBanners();
    setupBannerImageUpload();
    setupBannerForm();
});

/**
 * Load banners from Supabase
 */
async function loadBanners() {
    const tbody = document.getElementById('bannersTableBody');

    // Mostrar loading
    tbody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center; padding: 40px; color: #7f8c8d;">
                ⏳ Carregando banners...
            </td>
        </tr>
    `;

    try {
        console.log('🔄 Carregando banners...');
        console.log('📡 Supabase configurado:', checkSupabaseConfig());

        if (checkSupabaseConfig()) {
            // Buscar TODOS os banners do Supabase (sem filtro de status)
            const { data, error } = await supabaseClient
                .from('banners')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) {
                console.error('❌ Erro Supabase:', error);
                throw error;
            }

            console.log('✅ Banners carregados do Supabase:', data?.length || 0);
            console.log('📦 Dados:', data);

            banners = data || [];

            // Se não há banners no Supabase, usar fallback local
            if (banners.length === 0) {
                console.log('⚠️ Nenhum banner no Supabase, usando fallback local');
                const stored = localStorage.getItem('dimar_banners');
                banners = stored ? JSON.parse(stored) : getDefaultBanners();
            }
        } else {
            console.log('⚠️ Supabase não configurado, usando localStorage');
            const stored = localStorage.getItem('dimar_banners');
            banners = stored ? JSON.parse(stored) : getDefaultBanners();
        }

        console.log('📊 Total de banners para exibir:', banners.length);
        renderBanners();

    } catch (error) {
        console.error('❌ Erro ao carregar banners:', error);
        // Em caso de erro, usar fallback
        const stored = localStorage.getItem('dimar_banners');
        banners = stored ? JSON.parse(stored) : getDefaultBanners();
        renderBanners();
        alert('⚠️ Erro ao carregar banners do servidor. Mostrando banners locais.');
    }
}

/**
 * Default banners
 */
function getDefaultBanners() {
    return [
        {
            id: 'banner_1',
            title: 'Banner Principal 1',
            image_url: '../assets/images/bannner01.png',
            link_url: '#',
            display_order: 1,
            is_active: true
        },
        {
            id: 'banner_2',
            title: 'Banner Principal 2',
            image_url: '../assets/images/bannner02.png',
            link_url: '#',
            display_order: 2,
            is_active: true
        }
    ];
}

/**
 * Render banners table
 */
function renderBanners() {
    const tbody = document.getElementById('bannersTableBody');
    const countEl = document.getElementById('bannerCount');

    countEl.textContent = banners.length;

    if (banners.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #7f8c8d;">
                    Nenhum banner cadastrado. Clique em "Adicionar Banner" para criar o primeiro.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = banners.map(banner => {
        // Tratamento de valores nulos
        const title = banner.title || 'Sem título';
        const linkUrl = banner.link_url || '';
        const displayOrder = banner.display_order ?? 0;
        const imageUrl = banner.image_url || '../assets/images/bannner01.png';

        // Exibição do link
        const linkDisplay = linkUrl
            ? `<a href="${linkUrl}" target="_blank" style="color: var(--primary-color);">${linkUrl}</a>`
            : '<span style="color: #999;">Sem link</span>';

        return `
        <tr data-banner-id="${banner.id}">
            <td>
                <img src="${imageUrl}" alt="${title}" 
                     style="width: 120px; height: 60px; object-fit: cover; border-radius: 8px;"
                     onerror="this.src='../assets/images/bannner01.png'">
            </td>
            <td><strong>${title}</strong></td>
            <td>${linkDisplay}</td>
            <td>${displayOrder}</td>
            <td>
                <span class="badge ${banner.is_active ? 'badge-success' : 'badge-danger'}">
                    ${banner.is_active ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editBanner('${banner.id}')" title="Editar">
                    ✏️
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteBanner('${banner.id}')" title="Excluir">
                    🗑️
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

/**
 * Setup banner image upload
 */
function setupBannerImageUpload() {
    const uploadArea = document.getElementById('bannerImageUploadArea');
    const input = document.getElementById('bannerImageInput');

    uploadArea.addEventListener('click', () => input.click());

    input.addEventListener('change', handleBannerImageSelect);

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
        handleBannerImageSelect({ target: { files: e.dataTransfer.files } });
    });
}

/**
 * Handle banner image selection
 */
function handleBannerImageSelect(e) {
    const file = e.target.files[0];

    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida.');
        return;
    }

    // Validar tamanho (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
    }

    // Guardar arquivo para upload posterior
    selectedBannerFile = file;

    // Criar preview
    const reader = new FileReader();
    reader.onload = (event) => {
        selectedBannerImage = event.target.result;
        renderBannerImagePreview();
    };
    reader.readAsDataURL(file);
}

/**
 * Upload banner image to Supabase Storage
 * @param {File} file - Arquivo de imagem
 * @returns {Promise<string|null>} - URL pública da imagem ou null se falhar
 */
async function uploadBannerToStorage(file) {
    try {
        if (!checkSupabaseConfig() || !supabaseClient) {
            console.warn('⚠️ Supabase não configurado, usando base64');
            return null;
        }

        // Gerar nome único para o arquivo
        const fileExt = file.name.split('.').pop();
        const fileName = `banner_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt} `;
        const filePath = `banners / ${fileName} `;

        console.log('📤 Uploading banner to Storage:', filePath);

        // Upload para Storage
        const { data, error } = await supabaseClient.storage
            .from('banners')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('❌ Erro no upload:', error);
            // Se bucket não existe, retorna null para fallback base64
            if (error.message.includes('Bucket not found') || error.statusCode === '404') {
                console.warn('⚠️ Bucket "banners" não existe no Supabase Storage');
                return null;
            }
            throw error;
        }

        // Obter URL pública
        const { data: urlData } = supabaseClient.storage
            .from('banners')
            .getPublicUrl(filePath);

        console.log('✅ Banner uploaded:', urlData.publicUrl);
        return urlData.publicUrl;

    } catch (error) {
        console.error('❌ Erro ao fazer upload do banner:', error);
        return null;
    }
}

/**
 * Render banner image preview
 */
function renderBannerImagePreview() {
    const preview = document.getElementById('bannerImagePreview');

    if (!selectedBannerImage) {
        preview.innerHTML = '';
        return;
    }

    preview.innerHTML = `
    < div style = "position: relative; margin-top: 20px;" >
        <img src="${selectedBannerImage}" alt="Preview" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px;">
            <button type="button" onclick="removeBannerImage()" style="position: absolute; top: 10px; right: 10px; background: var(--danger); color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 20px;">×</button>
        </div>
`;
}

/**
 * Remove banner image
 */
function removeBannerImage() {
    selectedBannerImage = null;
    selectedBannerFile = null;
    renderBannerImagePreview();
    document.getElementById('bannerImageInput').value = '';
}

/**
 * Setup banner form
 */
function setupBannerForm() {
    document.getElementById('bannerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveBanner();
    });
}

/**
 * Open banner modal
 */
function openBannerModal(bannerId = null) {
    // Resetar estado
    editingBannerId = bannerId;
    selectedBannerImage = null;
    selectedBannerFile = null; // Importante: resetar arquivo

    // Limpar input de arquivo
    const fileInput = document.getElementById('bannerImageInput');
    if (fileInput) fileInput.value = '';

    console.log('📝 Abrindo modal:', bannerId ? `Editando ${bannerId} ` : 'Novo banner');

    if (bannerId) {
        const banner = banners.find(b => b.id === bannerId);
        console.log('📦 Banner encontrado:', banner);

        if (banner) {
            document.getElementById('bannerId').value = banner.id;
            document.getElementById('bannerTitle').value = banner.title || '';
            document.getElementById('bannerLink').value = banner.link_url || '';
            document.getElementById('bannerOrder').value = banner.display_order || 0;
            document.getElementById('bannerStatus').value = banner.is_active ? 'active' : 'inactive';

            selectedBannerImage = banner.image_url;
            renderBannerImagePreview();

            document.querySelector('#bannerModal h2').textContent = 'Editar Banner';
        }
    } else {
        document.getElementById('bannerForm').reset();
        document.getElementById('bannerId').value = '';
        renderBannerImagePreview();
        document.querySelector('#bannerModal h2').textContent = 'Adicionar Banner';
    }

    document.getElementById('bannerModal').style.display = 'block';
}

/**
 * Close banner modal
 */
function closeBannerModal() {
    document.getElementById('bannerModal').style.display = 'none';
    editingBannerId = null;
    selectedBannerImage = null;
}

/**
 * Save banner
 */
async function saveBanner() {
    if (!selectedBannerImage) {
        alert('Por favor, adicione uma imagem para o banner.');
        return;
    }

    // Evitar duplo clique
    if (isUploading) {
        console.log('⏳ Upload em andamento...');
        return;
    }

    const saveBtn = document.querySelector('#bannerForm button[type="submit"]');
    const originalBtnHTML = saveBtn.innerHTML;

    try {
        isUploading = true;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '⏳ Salvando...';

        let imageUrl = selectedBannerImage;

        // Se tem arquivo novo para upload (não é URL existente)
        if (selectedBannerFile && checkSupabaseConfig()) {
            saveBtn.innerHTML = '📤 Enviando imagem...';
            const uploadedUrl = await uploadBannerToStorage(selectedBannerFile);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            } else {
                // Fallback: se upload falhar, avisar usuário
                console.warn('⚠️ Storage não disponível, usando base64 (não recomendado)');
                // Continuar com base64 do selectedBannerImage
            }
        }

        const bannerData = {
            title: document.getElementById('bannerTitle').value || 'Banner sem título',
            image_url: imageUrl,
            link_url: document.getElementById('bannerLink').value || null,
            display_order: parseInt(document.getElementById('bannerOrder').value) || 0,
            is_active: document.getElementById('bannerStatus').value === 'active'
        };

        saveBtn.innerHTML = '💾 Salvando dados...';

        if (checkSupabaseConfig()) {
            if (editingBannerId) {
                const { error } = await supabaseClient
                    .from('banners')
                    .update(bannerData)
                    .eq('id', editingBannerId);

                if (error) throw error;
            } else {
                const { error } = await supabaseClient
                    .from('banners')
                    .insert([bannerData]);

                if (error) throw error;
            }
        } else {
            // Fallback local storage
            if (editingBannerId) {
                const index = banners.findIndex(b => b.id === editingBannerId);
                banners[index] = { ...bannerData, id: editingBannerId };
            } else {
                bannerData.id = 'banner_' + Date.now();
                banners.push(bannerData);
            }
            localStorage.setItem('dimar_banners', JSON.stringify(banners));
        }

        alert(editingBannerId ? '✅ Banner atualizado com sucesso!' : '✅ Banner adicionado com sucesso!');
        closeBannerModal();
        await loadBanners();

    } catch (error) {
        console.error('❌ Erro ao salvar banner:', error);
        alert('❌ Erro ao salvar banner: ' + error.message);
    } finally {
        isUploading = false;
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnHTML;
        selectedBannerFile = null;
    }
}

/**
 * Edit banner
 */
function editBanner(bannerId) {
    openBannerModal(bannerId);
}

/**
 * Delete banner
 */
async function deleteBanner(bannerId) {
    if (!confirm('Tem certeza que deseja excluir este banner?')) {
        return;
    }

    try {
        if (checkSupabaseConfig()) {
            const { error } = await supabaseClient
                .from('banners')
                .delete()
                .eq('id', bannerId);

            if (error) throw error;
        } else {
            banners = banners.filter(b => b.id !== bannerId);
            localStorage.setItem('dimar_banners', JSON.stringify(banners));
        }

        alert('Banner excluído!');
        await loadBanners();

    } catch (error) {
        console.error('Erro ao excluir banner:', error);
        alert('Erro ao excluir banner: ' + error.message);
    }
}
