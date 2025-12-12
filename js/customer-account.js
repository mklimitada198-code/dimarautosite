/**
 * Customer Account Management
 * Gerenciamento de dados, endereços e pedidos
 */

(function () {
    'use strict';

    // ==================== INICIALIZAÇÃO ====================
    document.addEventListener('DOMContentLoaded', () => {
        loadUserProfile();
        loadAddresses();
        loadOrders();
        initProfileForm();
    });

    // ==================== CARREGAR PERFIL ====================
    async function loadUserProfile() {
        try {
            await waitForSupabase();

            const { data: { user } } = await window.supabaseClient.auth.getUser();

            if (!user) {
                console.log('Usuário não logado');
                return;
            }

            // Atualizar UI
            const fullName = user.user_metadata?.full_name || user.email.split('@')[0];
            const firstName = fullName.split(' ')[0];

            // Avatar
            const avatarEl = document.getElementById('userAvatar');
            if (avatarEl) {
                avatarEl.textContent = firstName.charAt(0).toUpperCase();
            }

            // Nome
            const nameEl = document.getElementById('userName');
            if (nameEl) {
                nameEl.textContent = fullName;
            }

            // Email
            const emailEl = document.getElementById('userEmail');
            if (emailEl) {
                emailEl.textContent = user.email;
            }

            // Form fields
            const editName = document.getElementById('editName');
            if (editName) {
                editName.value = fullName;
            }

            const editEmail = document.getElementById('editEmail');
            if (editEmail) {
                editEmail.value = user.email;
            }

            const editPhone = document.getElementById('editPhone');
            if (editPhone && user.user_metadata?.phone) {
                editPhone.value = user.user_metadata.phone;
            }

            console.log('✅ Perfil carregado');
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    }

    // ==================== EDITAR PERFIL ====================
    let isEditMode = false;

    window.enableEditMode = function () {
        isEditMode = !isEditMode;

        const editName = document.getElementById('editName');
        const editPhone = document.getElementById('editPhone');
        const saveBtn = document.getElementById('saveProfileBtn');
        const editLink = document.querySelector('.info-card-edit');

        if (isEditMode) {
            editName.disabled = false;
            editPhone.disabled = false;
            saveBtn.style.display = 'block';
            editLink.textContent = 'Cancelar';
        } else {
            editName.disabled = true;
            editPhone.disabled = true;
            saveBtn.style.display = 'none';
            editLink.textContent = 'Editar';
            loadUserProfile(); // Reset values
        }
    };

    function initProfileForm() {
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', handleProfileUpdate);
        }
    }

    async function handleProfileUpdate(e) {
        e.preventDefault();

        const fullName = document.getElementById('editName').value.trim();
        const phone = document.getElementById('editPhone').value.trim();
        const saveBtn = document.getElementById('saveProfileBtn');

        if (!fullName) {
            alert('Digite seu nome completo');
            return;
        }

        saveBtn.classList.add('loading');
        saveBtn.disabled = true;

        try {
            await waitForSupabase();

            const { error } = await window.supabaseClient.auth.updateUser({
                data: {
                    full_name: fullName,
                    phone: phone
                }
            });

            if (error) throw error;

            console.log('✅ Perfil atualizado');
            alert('Dados atualizados com sucesso!');

            window.enableEditMode(); // Exit edit mode
            loadUserProfile(); // Reload

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar dados');
        } finally {
            saveBtn.classList.remove('loading');
            saveBtn.disabled = false;
        }
    }

    // ==================== ENDEREÇOS ====================
    async function loadAddresses() {
        const container = document.getElementById('addressesList');
        if (!container) return;

        try {
            await waitForSupabase();

            const { data: { user } } = await window.supabaseClient.auth.getUser();
            if (!user) return;

            // Buscar customer_id
            const { data: customer } = await window.supabaseClient
                .from('customers')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!customer) {
                console.log('Customer não encontrado');
                return;
            }

            // Buscar endereços
            const { data: addresses, error } = await window.supabaseClient
                .from('customer_addresses')
                .select('*')
                .eq('customer_id', customer.id)
                .order('is_default', { ascending: false });

            if (error) throw error;

            if (!addresses || addresses.length === 0) {
                container.innerHTML = '<p style="color: #999; font-size: 14px;">Nenhum endereço cadastrado</p>';
                return;
            }

            container.innerHTML = addresses.map(addr => `
                <div style="padding: 16px; background: #fff; border: 1px solid #e8e8e8; border-radius: 8px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <strong>${addr.label || 'Endereço'}</strong>
                            ${addr.is_default ? '<span style="background: #ff6600; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 8px;">Principal</span>' : ''}
                            <p style="margin: 8px 0 0; color: #666; font-size: 14px;">
                                ${addr.street}, ${addr.number}${addr.complement ? ' - ' + addr.complement : ''}<br>
                                ${addr.neighborhood} - ${addr.city}/${addr.state}<br>
                                CEP: ${addr.cep}
                            </p>
                        </div>
                        <button onclick="deleteAddress('${addr.id}')" style="background: none; border: none; color: #dc3545; cursor: pointer;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M3 6H21M5 6V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Erro ao carregar endereços:', error);
        }
    }

    window.openAddressModal = function () {
        alert('Modal de endereço em desenvolvimento');
        // TODO: Implementar modal de adicionar endereço
    };

    window.deleteAddress = async function (addressId) {
        if (!confirm('Deseja remover este endereço?')) return;

        try {
            await waitForSupabase();

            const { error } = await window.supabaseClient
                .from('customer_addresses')
                .delete()
                .eq('id', addressId);

            if (error) throw error;

            loadAddresses();
        } catch (error) {
            console.error('Erro ao deletar endereço:', error);
            alert('Erro ao remover endereço');
        }
    };

    // ==================== PEDIDOS ====================
    async function loadOrders() {
        const listContainer = document.getElementById('ordersList');
        const loadingEl = document.getElementById('ordersLoading');
        const emptyEl = document.getElementById('ordersEmpty');
        const recentContainer = document.getElementById('recentOrders');

        if (!listContainer && !recentContainer) return;

        try {
            await waitForSupabase();

            const { data: { user } } = await window.supabaseClient.auth.getUser();
            if (!user) return;

            // Buscar customer_id
            const { data: customer } = await window.supabaseClient
                .from('customers')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!customer) {
                if (loadingEl) loadingEl.style.display = 'none';
                if (emptyEl) emptyEl.style.display = 'block';
                return;
            }

            // Buscar pedidos
            const { data: orders, error } = await window.supabaseClient
                .from('orders')
                .select('*')
                .eq('customer_id', customer.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (loadingEl) loadingEl.style.display = 'none';

            if (!orders || orders.length === 0) {
                if (emptyEl) emptyEl.style.display = 'block';
                if (recentContainer) {
                    recentContainer.innerHTML = '<p style="color: #999; font-size: 14px;">Nenhum pedido realizado</p>';
                }
                return;
            }

            // Renderizar pedidos
            const ordersHtml = orders.map(order => renderOrderCard(order)).join('');

            if (listContainer) {
                listContainer.innerHTML = ordersHtml;
            }

            if (recentContainer) {
                // Mostrar apenas os 3 primeiros
                recentContainer.innerHTML = orders.slice(0, 3).map(order => renderOrderCard(order)).join('');
            }

        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            if (loadingEl) loadingEl.style.display = 'none';
        }
    }

    function renderOrderCard(order) {
        const statusLabels = {
            pending: 'Aguardando',
            processing: 'Processando',
            shipped: 'Enviado',
            delivered: 'Entregue',
            cancelled: 'Cancelado'
        };

        const statusLabel = statusLabels[order.status] || order.status;
        const date = new Date(order.created_at).toLocaleDateString('pt-BR');

        return `
            <div class="order-card">
                <div class="order-card-header">
                    <span class="order-number">Pedido #${order.order_number || order.id.slice(0, 8)}</span>
                    <span class="order-status ${order.status}">${statusLabel}</span>
                </div>
                <div class="order-card-body">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span class="order-date">${date}</span>
                        </div>
                        <span class="order-total">R$ ${order.total?.toFixed(2).replace('.', ',') || '0,00'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== HELPERS ====================
    function waitForSupabase() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50;

            const check = setInterval(() => {
                attempts++;

                if (window.supabaseClient) {
                    clearInterval(check);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    clearInterval(check);
                    reject(new Error('Supabase não carregou'));
                }
            }, 100);
        });
    }

})();
