/**
 * PLACEHOLDER GENERATOR
 * Cria imagens placeholder SVG para produtos, categorias e marcas
 */

(function() {
    'use strict';

    // Criar SVG placeholder para produto
    const productPlaceholderSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#f5f5f5"/>
        <g transform="translate(150, 150)">
            <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="#ddd" stroke="#bbb" stroke-width="2"/>
            <text x="50" y="55" text-anchor="middle" font-size="12" fill="#999">PRODUTO</text>
        </g>
    </svg>`;

    // Criar SVG placeholder para categoria
    const categoryPlaceholderSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <rect width="300" height="300" fill="#e8e8e8"/>
        <g transform="translate(100, 120)">
            <rect width="100" height="60" rx="5" fill="#ccc" stroke="#999" stroke-width="2"/>
            <text x="50" y="40" text-anchor="middle" font-size="14" fill="#666">CATEGORIA</text>
        </g>
    </svg>`;

    // Criar SVG placeholder para marca
    const brandPlaceholderSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100">
        <rect width="200" height="100" fill="#fafafa"/>
        <text x="100" y="55" text-anchor="middle" font-size="18" fill="#aaa" font-weight="bold">MARCA</text>
    </svg>`;

    // Criar SVG placeholder para banner
    const bannerPlaceholderSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
        <rect width="1200" height="400" fill="#e0e0e0"/>
        <text x="600" y="200" text-anchor="middle" font-size="32" fill="#999" font-weight="bold">BANNER</text>
        <text x="600" y="240" text-anchor="middle" font-size="16" fill="#aaa">1200 x 400</text>
    </svg>`;

    // Função para criar data URL do SVG
    function createSVGDataURL(svg) {
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    // Exportar URLs
    window.placeholders = {
        product: createSVGDataURL(productPlaceholderSVG),
        category: createSVGDataURL(categoryPlaceholderSVG),
        brand: createSVGDataURL(brandPlaceholderSVG),
        banner: createSVGDataURL(bannerPlaceholderSVG)
    };

    // Log
    if (typeof logger !== 'undefined') {
        logger.success('✅ Placeholders SVG criados');
    }

})();


