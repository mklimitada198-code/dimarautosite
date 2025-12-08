document.addEventListener('DOMContentLoaded', function () {

    // ==================== Vehicle Filter Logic ====================
    const tabButtons = document.querySelectorAll('.tab-button');
    const brandSelect = document.getElementById('brandSelect');
    const modelSelect = document.getElementById('modelSelect');
    const yearSelect = document.getElementById('yearSelect');
    const vehicleForm = document.getElementById('vehicleFilterForm');

    // Verificar se elementos existem (podem não existir em todas as páginas)
    if (!brandSelect || !modelSelect || !yearSelect) {
        // Elementos de filtro não existem nesta página
        return;
    }

    // Tab switching
    if (tabButtons && tabButtons.length > 0) {
        tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all tabs
            tabButtons.forEach(tab => tab.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Reset form when switching tabs
            if (brandSelect) {
                brandSelect.selectedIndex = 0;
                modelSelect.selectedIndex = 0;
                modelSelect.disabled = true;
                yearSelect.selectedIndex = 0;
                yearSelect.disabled = true;
            }
        });
        });
    }

    // Cascading select functionality
    if (brandSelect) {
        brandSelect.addEventListener('change', function () {
            if (this.value) {
                // Enable model select when brand is chosen
                modelSelect.disabled = false;
                populateModels(this.value);
            } else {
                modelSelect.disabled = true;
                yearSelect.disabled = true;
                modelSelect.selectedIndex = 0;
                yearSelect.selectedIndex = 0;
            }
        });
    }

    if (modelSelect) {
        modelSelect.addEventListener('change', function () {
            if (this.value) {
                // Enable year select when model is chosen
                yearSelect.disabled = false;
                populateYears();
            } else {
                yearSelect.disabled = true;
                yearSelect.selectedIndex = 0;
            }
        });
    }

    // Helper function to populate models
    function populateModels(brand) {
        const models = {
            'chevrolet': ['Onix', 'Tracker', 'S10', 'Cruze', 'Spin'],
            'ford': ['Ka', 'Ranger', 'EcoSport', 'Fusion', 'Focus'],
            'volkswagen': ['Gol', 'Polo', 'T-Cross', 'Amarok', 'Saveiro'],
            'fiat': ['Argo', 'Mobi', 'Toro', 'Strada', 'Cronos'],
            'honda': ['Civic', 'City', 'HR-V', 'Fit', 'CR-V'],
            'toyota': ['Corolla', 'Hilux', 'SW4', 'Yaris', 'RAV4'],
            'jeep': ['Renegade', 'Compass', 'Commander', 'Wrangler', 'Grand Cherokee']
        };

        modelSelect.innerHTML = '<option value="">Selecione o Modelo</option>';

        if (models[brand]) {
            models[brand].forEach(model => {
                const option = document.createElement('option');
                option.value = model.toLowerCase().replace(' ', '-');
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }
    }

    // Helper function to populate years
    function populateYears() {
        const currentYear = new Date().getFullYear();
        yearSelect.innerHTML = '<option value="">Selecione o Ano</option>';

        for (let year = currentYear; year >= 2000; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }

    // Form submission
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const brand = brandSelect.value;
            const model = modelSelect.value;
            const year = yearSelect.value;
            const vehicleType = document.querySelector('.tab-button.active').dataset.vehicle;
            alert(`Buscando peças para ${vehicleType}: ${brand} ${model} ${year}`);
        });
    }

    // ==================== Categories Dropdown Logic ====================
    const categoriesBtn = document.getElementById('categoriesBtn');
    const categoriesMenu = document.getElementById('categoriesMenu');

    if (categoriesBtn && categoriesMenu) {
        // Toggle dropdown on button click
        categoriesBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            categoriesBtn.classList.toggle('active');
            categoriesMenu.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!categoriesBtn.contains(e.target) && !categoriesMenu.contains(e.target)) {
                categoriesBtn.classList.remove('active');
                categoriesMenu.classList.remove('active');
            }
        });

        // Close dropdown when clicking a menu item
        const menuLinks = categoriesMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function () {
                categoriesBtn.classList.remove('active');
                categoriesMenu.classList.remove('active');
            });
        });
    }

    // ==================== Banner Carousel Logic ====================
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    const prevBtn = document.querySelector('.carousel-button.prev');
    const nextBtn = document.querySelector('.carousel-button.next');
    const carouselContainer = document.querySelector('.banner-carousel');

    if (slides.length > 0) {
        let currentSlide = 0;
        let autoRotateInterval = null;
        let isHovering = false;

        /**
         * Mostra um slide específico
         * @param {number} index - Índice do slide a ser exibido
         */
        function showSlide(index) {
            // Remove classe 'active' de todos os slides e indicadores
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));

            // Adiciona classe 'active' ao slide e indicador corretos
            slides[index].classList.add('active');
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }
            
            currentSlide = index;
        }

        /**
         * Avança para o próximo slide
         */
        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        /**
         * Volta para o slide anterior
         */
        function prevSlide() {
            let prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
        }

        /**
         * Inicia a rotação automática
         * Só inicia se não estiver com hover
         */
        function startAutoRotate() {
            // Limpa qualquer intervalo existente primeiro
            stopAutoRotate();
            
            // Só inicia se não estiver com hover
            if (!isHovering) {
                autoRotateInterval = setInterval(nextSlide, 3000);
            }
        }

        /**
         * Para a rotação automática
         */
        function stopAutoRotate() {
            if (autoRotateInterval !== null) {
                clearInterval(autoRotateInterval);
                autoRotateInterval = null;
            }
        }

        // ==================== Event Listeners ====================

        // Navegação com botões (prev/next)
        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                prevSlide();
                stopAutoRotate();
                startAutoRotate(); // Reinicia timer após navegação manual
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                nextSlide();
                stopAutoRotate();
                startAutoRotate(); // Reinicia timer após navegação manual
            });
        }

        // Navegação com indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function () {
                showSlide(index);
                stopAutoRotate();
                startAutoRotate(); // Reinicia timer após navegação manual
            });
        });

        // Pausa ao passar o mouse (hover)
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', function () {
                isHovering = true;
                stopAutoRotate();
            });

            carouselContainer.addEventListener('mouseleave', function () {
                isHovering = false;
                startAutoRotate(); // Retoma a rotação quando o mouse sai
            });
        }

        // Inicia a rotação automática quando a página carrega
        startAutoRotate();
    }

    // ==================== Main Offers Navigation ====================
    const offersGrid = document.querySelector('.offers-grid');
    const offersPrevBtn = document.querySelector('.offers-nav-button.prev');
    const offersNextBtn = document.querySelector('.offers-nav-button.next');

    if (offersGrid && offersPrevBtn && offersNextBtn) {
        let scrollAmount = 0;

        offersNextBtn.addEventListener('click', function() {
            const cardWidth = offersGrid.querySelector('.product-card').offsetWidth;
            const gap = 24;
            scrollAmount = cardWidth + gap;
            offersGrid.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        offersPrevBtn.addEventListener('click', function() {
            const cardWidth = offersGrid.querySelector('.product-card').offsetWidth;
            const gap = 24;
            scrollAmount = cardWidth + gap;
            offersGrid.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        // Optional: Hide/show buttons based on scroll position
        function updateNavigationButtons() {
            const scrollLeft = offersGrid.scrollLeft;
            const scrollWidth = offersGrid.scrollWidth;
            const clientWidth = offersGrid.clientWidth;

            // Hide prev button if at start
            if (scrollLeft <= 0) {
                offersPrevBtn.style.opacity = '0.5';
                offersPrevBtn.style.cursor = 'not-allowed';
            } else {
                offersPrevBtn.style.opacity = '1';
                offersPrevBtn.style.cursor = 'pointer';
            }

            // Hide next button if at end
            if (scrollLeft + clientWidth >= scrollWidth - 10) {
                offersNextBtn.style.opacity = '0.5';
                offersNextBtn.style.cursor = 'not-allowed';
            } else {
                offersNextBtn.style.opacity = '1';
                offersNextBtn.style.cursor = 'pointer';
            }
        }

        offersGrid.addEventListener('scroll', updateNavigationButtons);
        updateNavigationButtons(); // Initial check
    }

    // ==================== Categories Carousel Navigation ====================
    const categoriesCarousel = document.querySelector('.categories-carousel');
    const categoriesNavPrev = document.querySelector('.categories-nav-button.prev');
    const categoriesNavNext = document.querySelector('.categories-nav-button.next');
    const categoryIndicators = document.querySelectorAll('.category-indicator');

    if (categoriesCarousel && categoriesNavPrev && categoriesNavNext) {
        const scrollAmount = categoriesCarousel.offsetWidth * 0.8; // Scroll 80% of visible width

        // Next button
        categoriesNavNext.addEventListener('click', () => {
            categoriesCarousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Previous button
        categoriesNavPrev.addEventListener('click', () => {
            categoriesCarousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        // Update indicators based on scroll position
        if (categoryIndicators.length > 0) {
            categoriesCarousel.addEventListener('scroll', () => {
                const scrollLeft = categoriesCarousel.scrollLeft;
                const scrollWidth = categoriesCarousel.scrollWidth - categoriesCarousel.offsetWidth;
                const currentIndex = Math.round((scrollLeft / scrollWidth) * (categoryIndicators.length - 1));

                categoryIndicators.forEach((indicator, index) => {
                    if (index === currentIndex) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
            });

            // Indicator click to scroll to position
            categoryIndicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    const scrollWidth = categoriesCarousel.scrollWidth - categoriesCarousel.offsetWidth;
                    const scrollPosition = (scrollWidth / (categoryIndicators.length - 1)) * index;
                    
                    categoriesCarousel.scrollTo({
                        left: scrollPosition,
                        behavior: 'smooth'
                    });
                });
            });
        }
    }

    // ==================== Newsletter Form ====================
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const email = emailInput.value.trim();
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email) {
                alert('❌ Por favor, digite seu e-mail');
                emailInput.focus();
                return;
            }
            
            if (!emailRegex.test(email)) {
                alert('❌ Por favor, digite um e-mail válido');
                emailInput.focus();
                return;
            }
            
            // Simular envio (em produção, enviar para backend)
            emailInput.disabled = true;
            const button = newsletterForm.querySelector('.newsletter-button');
            const originalHTML = button.innerHTML;
            button.innerHTML = '✓';
            
            setTimeout(() => {
                alert(`✅ Obrigado por se cadastrar!\n\nE-mail: ${email}\n\nVocê receberá nossas ofertas exclusivas!`);
                emailInput.value = '';
                emailInput.disabled = false;
                button.innerHTML = originalHTML;
            }, 500);
        });
    }

    // ==================== Vehicle Filter Form ====================
    const vehicleSearchBtn = document.querySelector('.vehicle-search-button');
    
    if (vehicleSearchBtn) {
        vehicleSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const brand = document.getElementById('brand-select')?.value;
            const model = document.getElementById('model-select')?.value;
            const year = document.getElementById('year-select')?.value;
            
            if (!brand || brand === '') {
                alert('❌ Selecione uma marca');
                return;
            }
            
            if (!model || model === '') {
                alert('❌ Selecione um modelo');
                return;
            }
            
            if (!year || year === '') {
                alert('❌ Selecione um ano');
                return;
            }
            
            // Redirecionar para produtos com filtros
            window.location.href = `pages/produtos.html?marca=${encodeURIComponent(brand)}&modelo=${encodeURIComponent(model)}&ano=${year}`;
        });
    }

    // ==================== Mais Procurados Carousel ====================
    const mostSearchedGrid = document.querySelector('.most-searched-grid');
    const mostSearchedPrevBtn = document.querySelector('.most-searched-nav-button.prev');
    const mostSearchedNextBtn = document.querySelector('.most-searched-nav-button.next');

    if (mostSearchedGrid && mostSearchedPrevBtn && mostSearchedNextBtn) {
        let scrollAmount = 0;
        const cardWidth = 270; // Card width + gap

        mostSearchedNextBtn.addEventListener('click', () => {
            scrollAmount += cardWidth;
            if (scrollAmount > mostSearchedGrid.scrollWidth - mostSearchedGrid.clientWidth) {
                scrollAmount = mostSearchedGrid.scrollWidth - mostSearchedGrid.clientWidth;
            }
            mostSearchedGrid.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        mostSearchedPrevBtn.addEventListener('click', () => {
            scrollAmount -= cardWidth;
            if (scrollAmount < 0) {
                scrollAmount = 0;
            }
            mostSearchedGrid.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Update scroll amount on manual scroll
        mostSearchedGrid.addEventListener('scroll', () => {
            scrollAmount = mostSearchedGrid.scrollLeft;
        });

        // Keyboard navigation
        mostSearchedGrid.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                mostSearchedPrevBtn.click();
            } else if (e.key === 'ArrowRight') {
                mostSearchedNextBtn.click();
            }
        });
    }
});
