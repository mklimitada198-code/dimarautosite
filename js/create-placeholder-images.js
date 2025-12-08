// ==================== CREATE PLACEHOLDER IMAGES ====================
// Cria imagens placeholder usando canvas para produtos

(function() {
    'use strict';

    const products = [
        { id: 1, name: 'Pastilha de Freio', color: '#FF6B00' },
        { id: 2, name: 'Filtro de Óleo', color: '#1a1a1a' },
        { id: 3, name: 'Amortecedor', color: '#666' },
        { id: 4, name: 'Bateria', color: '#FF0000' },
        { id: 5, name: 'Vela de Ignição', color: '#0066FF' }
    ];

    function createPlaceholder(product) {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, 400, 400);

        // Product color
        ctx.fillStyle = product.color;
        ctx.fillRect(50, 50, 300, 300);

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(product.name, 200, 180);
        ctx.font = '18px Inter';
        ctx.fillText(`ID: ${product.id}`, 200, 220);

        return canvas.toDataURL('image/png');
    }

    // Expor globalmente
    window.createProductPlaceholder = createPlaceholder;
    window.productPlaceholders = products;

})();

