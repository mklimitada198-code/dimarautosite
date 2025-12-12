/**
 * Clientes Management Script
 * Gerencia a listagem e visualização de clientes
 */

(function () {
    'use strict';

    // State
    let customers = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let searchTerm = '';

    // ==================== INITIALIZATION ====================

    /**
     * Initialize the customers page
     */
    async function init() {
        console.log('🚀 Initializing Customers Page...');

        // Load initial data
        await Promise.all([
            loadStats(),
            loadCustomers()
        ]);

        console.log('✅ Customers page initialized');
    }

    // ==================== STATS ====================

    /**
     * Load customer statistics
     */
    async function loadStats() {
        try {
            // Total customers
            const { count: totalCustomers, error: err1 } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true });

            if (!err1) {
                document.getElementById('statTotalCustomers').textContent = totalCustomers || 0;
            }

            // New customers this month
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const { count: newCustomers, error: err2 } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', startOfMonth.toISOString());

            if (!err2) {
                document.getElementById('statNewCustomers').textContent = newCustomers || 0;
            }

            // Customers with orders - count unique customer_ids in orders
            const { data: ordersData, error: err3 } = await supabase
                .from('orders')
                .select('customer_id');

            if (!err3 && ordersData) {
                const uniqueCustomers = new Set(ordersData.map(o => o.customer_id));
                document.getElementById('statCustomersWithOrders').textContent = uniqueCustomers.size;
            }

            // Total orders
            const { count: totalOrders, error: err4 } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            if (!err4) {
                document.getElementById('statTotalOrders').textContent = totalOrders || 0;
            }

        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    // ==================== CUSTOMERS LIST ====================

    /**
     * Load customers from database
     */
    async function loadCustomers() {
        const tbody = document.getElementById('customersTableBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #7f8c8d;">
                    <div class="loading-spinner"></div>
                    Carregando clientes...
                </td>
            </tr>
        `;

        try {
            let query = supabase
                .from('customers')
                .select(`
                    *,
                    orders:orders(count)
                `)
                .order('created_at', { ascending: false });

            // Apply search filter
            if (searchTerm) {
                query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error loading customers:', error);
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 40px; color: #e74c3c;">
                            ❌ Erro ao carregar clientes: ${error.message}
                        </td>
                    </tr>
                `;
                return;
            }

            customers = data || [];
            renderCustomersTable();
            updatePagination();

        } catch (error) {
            console.error('Error:', error);
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #e74c3c;">
                        ❌ Erro de conexão
                    </td>
                </tr>
            `;
        }
    }

    /**
     * Render customers table
     */
    function renderCustomersTable() {
        const tbody = document.getElementById('customersTableBody');
        const countBadge = document.getElementById('customerCount');

        if (customers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #7f8c8d;">
                        ${searchTerm ? '🔍 Nenhum cliente encontrado para essa busca' : '👥 Nenhum cliente cadastrado'}
                    </td>
                </tr>
            `;
            countBadge.textContent = '0 clientes';
            return;
        }

        // Paginate
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedCustomers = customers.slice(startIndex, endIndex);

        tbody.innerHTML = paginatedCustomers.map(customer => {
            const initials = getInitials(customer.full_name || customer.email);
            const ordersCount = customer.orders?.[0]?.count || 0;
            const createdAt = formatDate(customer.created_at);

            return `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div class="customer-avatar" style="
                                width: 40px;
                                height: 40px;
                                border-radius: 50%;
                                background: linear-gradient(135deg, #ff6600 0%, #ff8800 100%);
                                color: white;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: 600;
                                font-size: 14px;
                            ">${initials}</div>
                            <div>
                                <div style="font-weight: 600; color: #2c3e50;">${customer.full_name || 'Sem nome'}</div>
                                <div style="font-size: 12px; color: #7f8c8d;">ID: ${customer.id.substring(0, 8)}...</div>
                            </div>
                        </div>
                    </td>
                    <td style="color: #3498db;">${customer.email || '-'}</td>
                    <td>${customer.phone || '-'}</td>
                    <td>${createdAt}</td>
                    <td>
                        <span class="badge ${ordersCount > 0 ? 'badge-success' : 'badge-secondary'}">
                            ${ordersCount} pedido${ordersCount !== 1 ? 's' : ''}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewCustomerDetails('${customer.id}')">
                            👁️ Detalhes
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        countBadge.textContent = `${customers.length} cliente${customers.length !== 1 ? 's' : ''}`;
    }

    // ==================== PAGINATION ====================

    /**
     * Update pagination controls
     */
    function updatePagination() {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(customers.length / itemsPerPage);

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '';

        // Previous button
        html += `
            <button class="btn btn-sm ${currentPage === 1 ? 'btn-secondary' : 'btn-primary'}" 
                    onclick="changePage(${currentPage - 1})" 
                    ${currentPage === 1 ? 'disabled' : ''}>
                ← Anterior
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `
                    <button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-secondary'}" 
                            onclick="changePage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += '<span style="padding: 0 8px;">...</span>';
            }
        }

        // Next button
        html += `
            <button class="btn btn-sm ${currentPage === totalPages ? 'btn-secondary' : 'btn-primary'}" 
                    onclick="changePage(${currentPage + 1})" 
                    ${currentPage === totalPages ? 'disabled' : ''}>
                Próximo →
            </button>
        `;

        pagination.innerHTML = html;
    }

    /**
     * Change page
     */
    function changePage(page) {
        const totalPages = Math.ceil(customers.length / itemsPerPage);
        if (page < 1 || page > totalPages) return;

        currentPage = page;
        renderCustomersTable();
        updatePagination();
    }

    // ==================== SEARCH ====================

    /**
     * Handle search input
     */
    function handleSearch(event) {
        if (event.key === 'Enter') {
            searchCustomers();
        }
    }

    /**
     * Search customers
     */
    function searchCustomers() {
        searchTerm = document.getElementById('searchInput').value.trim();
        currentPage = 1;
        loadCustomers();
    }

    /**
     * Clear search
     */
    function clearSearch() {
        document.getElementById('searchInput').value = '';
        searchTerm = '';
        currentPage = 1;
        loadCustomers();
    }

    // ==================== CUSTOMER DETAILS ====================

    /**
     * View customer details in modal
     */
    async function viewCustomerDetails(customerId) {
        const modal = document.getElementById('customerModal');
        const modalBody = document.getElementById('customerModalBody');

        modalBody.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div class="loading-spinner"></div>
                <p>Carregando detalhes...</p>
            </div>
        `;

        modal.classList.add('show');

        try {
            // Load customer data
            const { data: customer, error: customerError } = await supabase
                .from('customers')
                .select('*')
                .eq('id', customerId)
                .single();

            if (customerError) throw customerError;

            // Load addresses
            const { data: addresses, error: addressError } = await supabase
                .from('customer_addresses')
                .select('*')
                .eq('customer_id', customerId);

            // Load orders
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .eq('customer_id', customerId)
                .order('created_at', { ascending: false })
                .limit(5);

            // Render modal content
            const initials = getInitials(customer.full_name || customer.email);

            modalBody.innerHTML = `
                <!-- Customer Info -->
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #eee;">
                    <div style="
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #ff6600 0%, #ff8800 100%);
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 700;
                        font-size: 24px;
                    ">${initials}</div>
                    <div>
                        <h3 style="margin: 0; color: #2c3e50;">${customer.full_name || 'Sem nome'}</h3>
                        <p style="margin: 4px 0 0; color: #7f8c8d; font-size: 14px;">
                            Cliente desde ${formatDate(customer.created_at)}
                        </p>
                    </div>
                </div>

                <!-- Contact Info -->
                <div class="info-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
                    <div class="info-item">
                        <label style="font-size: 12px; color: #7f8c8d; display: block;">Email</label>
                        <span style="font-weight: 500; color: #3498db;">${customer.email || '-'}</span>
                    </div>
                    <div class="info-item">
                        <label style="font-size: 12px; color: #7f8c8d; display: block;">Telefone</label>
                        <span style="font-weight: 500;">${customer.phone || '-'}</span>
                    </div>
                </div>

                <!-- Addresses -->
                <div style="margin-bottom: 24px;">
                    <h4 style="margin: 0 0 12px; color: #2c3e50; display: flex; align-items: center; gap: 8px;">
                        📍 Endereços (${addresses?.length || 0})
                    </h4>
                    ${renderAddresses(addresses)}
                </div>

                <!-- Orders -->
                <div>
                    <h4 style="margin: 0 0 12px; color: #2c3e50; display: flex; align-items: center; gap: 8px;">
                        📦 Últimos Pedidos (${orders?.length || 0})
                    </h4>
                    ${renderOrders(orders)}
                </div>
            `;

        } catch (error) {
            console.error('Error loading customer details:', error);
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #e74c3c;">
                    ❌ Erro ao carregar detalhes: ${error.message}
                </div>
            `;
        }
    }

    /**
     * Render addresses list
     */
    function renderAddresses(addresses) {
        if (!addresses || addresses.length === 0) {
            return '<p style="color: #7f8c8d; font-size: 14px;">Nenhum endereço cadastrado</p>';
        }

        return addresses.map(addr => `
            <div style="
                background: #f8f9fa;
                padding: 12px 16px;
                border-radius: 8px;
                margin-bottom: 8px;
                border-left: 3px solid ${addr.is_default ? '#ff6600' : '#ddd'};
            ">
                <div style="font-weight: 500; margin-bottom: 4px;">
                    ${addr.label || 'Endereço'} ${addr.is_default ? '<span style="color: #ff6600; font-size: 12px;">(Padrão)</span>' : ''}
                </div>
                <div style="font-size: 14px; color: #666;">
                    ${addr.street}, ${addr.number}${addr.complement ? ` - ${addr.complement}` : ''}<br>
                    ${addr.neighborhood} - ${addr.city}/${addr.state}<br>
                    CEP: ${addr.cep}
                </div>
            </div>
        `).join('');
    }

    /**
     * Render orders list
     */
    function renderOrders(orders) {
        if (!orders || orders.length === 0) {
            return '<p style="color: #7f8c8d; font-size: 14px;">Nenhum pedido realizado</p>';
        }

        return `
            <table class="table" style="font-size: 14px;">
                <thead>
                    <tr>
                        <th>Pedido</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td>#${order.order_number || order.id.substring(0, 8)}</td>
                            <td>${formatDate(order.created_at)}</td>
                            <td>
                                <span class="badge ${getStatusClass(order.status)}">
                                    ${translateStatus(order.status)}
                                </span>
                            </td>
                            <td style="font-weight: 600; color: #27ae60;">
                                ${formatCurrency(order.total)}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // ==================== HELPERS ====================

    /**
     * Get initials from name
     */
    function getInitials(name) {
        if (!name) return '?';
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    /**
     * Format date
     */
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    /**
     * Format currency
     */
    function formatCurrency(value) {
        if (!value) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    /**
     * Get status badge class
     */
    function getStatusClass(status) {
        const classes = {
            'pending': 'badge-warning',
            'processing': 'badge-info',
            'shipped': 'badge-primary',
            'delivered': 'badge-success',
            'cancelled': 'badge-danger'
        };
        return classes[status] || 'badge-secondary';
    }

    /**
     * Translate order status
     */
    function translateStatus(status) {
        const translations = {
            'pending': 'Pendente',
            'processing': 'Processando',
            'shipped': 'Enviado',
            'delivered': 'Entregue',
            'cancelled': 'Cancelado'
        };
        return translations[status] || status;
    }

    // ==================== EXPOSE GLOBAL FUNCTIONS ====================

    window.loadCustomers = loadCustomers;
    window.searchCustomers = searchCustomers;
    window.clearSearch = clearSearch;
    window.handleSearch = handleSearch;
    window.viewCustomerDetails = viewCustomerDetails;
    window.changePage = changePage;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
