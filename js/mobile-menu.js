/**
 * Mobile Menu Handler
 * Controls the hamburger menu, mobile drawer, and overlay
 */

(function () {
    'use strict';

    // DOM Elements
    let mobileMenuBtn = null;
    let mobileDrawer = null;
    let mobileOverlay = null;
    let closeBtn = null;

    /**
     * Initialize mobile menu
     */
    function init() {
        // Get elements
        mobileMenuBtn = document.getElementById('mobileMenuBtn');
        mobileDrawer = document.getElementById('mobileDrawer');
        mobileOverlay = document.getElementById('mobileOverlay');
        closeBtn = document.getElementById('mobileCloseBtn');

        if (!mobileMenuBtn || !mobileDrawer || !mobileOverlay) {
            console.log('Mobile menu elements not found - waiting for headerLoaded event');
            return false;
        }

        // Add event listeners
        mobileMenuBtn.addEventListener('click', openMenu);
        mobileOverlay.addEventListener('click', closeMenu);
        if (closeBtn) {
            closeBtn.addEventListener('click', closeMenu);
        }

        // Close on escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu on link click
        const menuLinks = mobileDrawer.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        console.log('✅ Mobile menu initialized successfully');
        return true;
    }

    /**
     * Open the mobile menu
     */
    function openMenu() {
        mobileDrawer.classList.add('active');
        mobileOverlay.classList.add('active');
        mobileMenuBtn.classList.add('active');
        document.body.classList.add('mobile-menu-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }

    /**
     * Close the mobile menu
     */
    function closeMenu() {
        mobileDrawer.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.classList.remove('mobile-menu-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    // Try to initialize immediately if elements exist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // If elements not found on initial run, wait for headerLoaded event
        if (!init()) {
            document.addEventListener('headerLoaded', function () {
                console.log('headerLoaded event received - reinitializing mobile menu');
                init();
            });
        }
    }

    // Also listen for headerLoaded event in case template loads after this script
    document.addEventListener('headerLoaded', function () {
        if (!mobileMenuBtn) {
            console.log('headerLoaded event received - initializing mobile menu');
            init();
        }
    });

    // Expose functions globally if needed
    window.MobileMenu = {
        open: openMenu,
        close: closeMenu,
        init: init
    };
})();
