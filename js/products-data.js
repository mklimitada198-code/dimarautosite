/**
 * Products Data - AUTO PEÇAS E MOTO PEÇAS
 * Dados dos produtos exibidos na home
 */

const productsData = [
    {
        id: 'prod_001',
        name: 'Kit Pastilha de Freio Dianteira Cerâmica',
        sku: 'FRE-001',
        price: 149.90,
        salePrice: 119.90,
        image: 'https://via.placeholder.com/400x400/FF6B00/FFFFFF?text=Pastilha+Freio',
        category: 'Freios',
        brand: 'Fras-le',
        vehicleType: 'Carro',
        compatibility: ['Gol', 'Palio', 'Uno', 'Corsa'],
        fastShipping: true,
        inStock: true,
        featured: true,
        badge: 'NOVO',
        description: 'Kit completo de pastilhas de freio dianteiras em material cerâmico de alta performance.',
        specs: {
            'Material': 'Cerâmica',
            'Posição': 'Dianteira',
            'Aplicação': 'Carros leves',
            'Garantia': '1 ano'
        }
    },
    {
        id: 'prod_002',
        name: 'Filtro de Óleo Mann W950/26',
        sku: 'MOT-002',
        price: 45.90,
        salePrice: 34.90,
        image: 'https://via.placeholder.com/400x400/1a1a1a/FFFFFF?text=Filtro+Oleo',
        category: 'Motor',
        brand: 'Mann Filter',
        vehicleType: 'Universal',
        compatibility: ['Diversos modelos'],
        fastShipping: true,
        inStock: true,
        featured: true,
        badge: 'PROMOÇÃO',
        description: 'Filtro de óleo original Mann Filter com alta eficiência de filtragem.',
        specs: {
            'Tipo': 'Cartucho',
            'Rosca': 'M20 x 1.5',
            'Altura': '90mm',
            'Diâmetro': '76mm'
        }
    },
    {
        id: 'prod_003',
        name: 'Amortecedor Traseiro Cofap Honda CG 125/150',
        sku: 'SUS-003',
        price: 189.90,
        salePrice: 159.90,
        image: 'https://via.placeholder.com/400x400/FF0000/FFFFFF?text=Amortecedor',
        category: 'Suspensão',
        brand: 'Cofap',
        vehicleType: 'Moto',
        compatibility: ['CG 125', 'CG 150', 'CG Titan'],
        fastShipping: true,
        inStock: true,
        featured: false,
        badge: null,
        description: 'Amortecedor traseiro original Cofap para motos Honda CG.',
        specs: {
            'Posição': 'Traseiro',
            'Comprimento': '340mm',
            'Curso': '80mm',
            'Aplicação': 'Honda CG'
        }
    },
    {
        id: 'prod_004',
        name: 'Bateria Moura 60Ah Selada',
        sku: 'ELE-004',
        price: 459.90,
        salePrice: 399.90,
        image: 'https://via.placeholder.com/400x400/0066FF/FFFFFF?text=Bateria',
        category: 'Elétrica',
        brand: 'Moura',
        vehicleType: 'Carro',
        compatibility: ['Gol', 'Fox', 'Polo', 'Voyage'],
        fastShipping: false,
        inStock: true,
        featured: true,
        badge: 'DESTAQUE',
        description: 'Bateria automotiva Moura 60Ah selada livre de manutenção.',
        specs: {
            'Amperagem': '60Ah',
            'Voltagem': '12V',
            'CCA': '500A',
            'Tecnologia': 'Selada'
        }
    },
    {
        id: 'prod_005',
        name: 'Kit Correia Dentada Gates com Tensor',
        sku: 'MOT-005',
        price: 289.90,
        salePrice: 249.90,
        image: 'https://via.placeholder.com/400x400/27ae60/FFFFFF?text=Correia',
        category: 'Motor',
        brand: 'Gates',
        vehicleType: 'Carro',
        compatibility: ['Gol 1.0', 'Palio 1.0', 'Uno 1.0'],
        fastShipping: true,
        inStock: true,
        featured: false,
        badge: null,
        description: 'Kit completo de correia dentada Gates com tensor e rolamentos.',
        specs: {
            'Número de dentes': '123',
            'Largura': '25mm',
            'Inclui': 'Correia + Tensor + Rolamento',
            'Material': 'Borracha reforçada'
        }
    }
];

/**
 * Inicializar produtos na página
 */
function initializeProducts() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach((card, index) => {
        if (productsData[index]) {
            setupProductCard(card, productsData[index]);
        }
    });

    logger.success(`Produtos de AUTO PEÇAS inicializados: ${productsData.length}`);
}

/**
 * Configurar card do produto
 */
function setupProductCard(card, product) {
    // Adicionar data-product-id
    card.setAttribute('data-product-id', product.id);

    // Encontrar botão e adicionar evento
    const button = card.querySelector('.product-buy-button');
    
    if (button) {
        // Atualizar texto do botão
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Adicionar ao Carrinho
        `;

        // Adicionar evento de clique
        button.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(product, button);
        });

        // Hover effect
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    }
}

/**
 * Adicionar produto ao carrinho
 */
function addToCart(product, button) {
    // Animação do botão
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);

    // Adicionar ao carrinho
    const added = window.cart.addItem({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        salePrice: product.salePrice,
        image: product.image,
        quantity: 1
    });

    if (added) {
        // Feedback visual temporário no botão
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13l4 4L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Adicionado!
        `;
        button.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
        }, 2000);
    }
}

/**
 * Obter produto por ID
 */
function getProductById(productId) {
    return productsData.find(p => p.id === productId);
}

/**
 * Obter todos os produtos
 */
function getAllProducts() {
    return [...productsData];
}

// Inicializar quando TUDO estiver pronto (incluindo cart.js)
window.addEventListener('load', () => {
    // Pequeno delay para garantir que o cart.js inicializou
    setTimeout(initializeProducts, 100);
});

// Export para uso global
window.productsData = productsData;
window.getProductById = getProductById;
window.getAllProducts = getAllProducts;
