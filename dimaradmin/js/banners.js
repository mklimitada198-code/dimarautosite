/**
 * Banners Management
 */

// State
let banners = [];
let selectedBannerImage = null;
let editingBannerId = null;

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
    try {
        if (checkSupabaseConfig()) {
            const { data, error } = await supabaseClient
                .from('banners')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            banners = data || [];
        } else {
            const stored = localStorage.getItem('dimar_banners');
            banners = stored ? JSON.parse(stored) : getDefaultBanners();
        }

        renderBanners();
    } catch (error) {
        console.error('Erro ao carregar banners:', error);
        alert('Erro ao carregar banners: ' + error.message);
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
                    Nenhum banner cadastrado.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = banners.map(banner => `
        <tr>
            <td>
                <img src="${banner.image_url}" alt="${banner.title}" style="width: 120px; height: 60px; object-fit: cover; border-radius: 8px;">
            </td>
            <td><strong>${banner.title}</strong></td>
            <td><a href="${banner.link_url}" target="_blank" style="color: var(--primary-color);">${banner.link_url}</a></td>
            <td>${banner.display_order}</td>
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
    `).join('');
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

    if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        selectedBannerImage = event.target.result;
        renderBannerImagePreview();
    };
    reader.readAsDataURL(file);
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
        <div style="position: relative; margin-top: 20px;">
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
    editingBannerId = bannerId;
    selectedBannerImage = null;

    if (bannerId) {
        const banner = banners.find(b => b.id === bannerId);
        if (banner) {
            document.getElementById('bannerId').value = banner.id;
            document.getElementById('bannerTitle').value = banner.title;
            document.getElementById('bannerLink').value = banner.link_url || '';
            document.getElementById('bannerOrder').value = banner.display_order;
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

    const bannerData = {
        title: document.getElementById('bannerTitle').value,
        image_url: selectedBannerImage,
        link_url: document.getElementById('bannerLink').value,
        display_order: parseInt(document.getElementById('bannerOrder').value),
        is_active: document.getElementById('bannerStatus').value === 'active'
    };

    try {
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
            if (editingBannerId) {
                const index = banners.findIndex(b => b.id === editingBannerId);
                banners[index] = { ...bannerData, id: editingBannerId };
            } else {
                bannerData.id = 'banner_' + Date.now();
                banners.push(bannerData);
            }

            localStorage.setItem('dimar_banners', JSON.stringify(banners));
        }

        alert(editingBannerId ? 'Banner atualizado!' : 'Banner adicionado!');
        closeBannerModal();
        await loadBanners();

    } catch (error) {
        console.error('Erro ao salvar banner:', error);
        alert('Erro ao salvar banner: ' + error.message);
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
