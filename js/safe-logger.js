/**
 * SAFE LOGGER WRAPPER
 * Garante que logs sempre funcionem, mesmo se logger.js não carregou
 */

(function() {
    'use strict';

    // Criar logger seguro que sempre funciona
    window.safeLog = {
        log: function(...args) {
            if (typeof logger !== 'undefined' && logger.log) {
                logger.log(...args);
            } else {
                console.log(...args);
            }
        },
        
        info: function(...args) {
            if (typeof logger !== 'undefined' && logger.info) {
                logger.info(...args);
            } else {
                console.info(...args);
            }
        },
        
        warn: function(...args) {
            if (typeof logger !== 'undefined' && logger.warn) {
                logger.warn(...args);
            } else {
                console.warn(...args);
            }
        },
        
        error: function(...args) {
            if (typeof logger !== 'undefined' && logger.error) {
                logger.error(...args);
            } else {
                console.error(...args);
            }
        },
        
        success: function(message) {
            if (typeof logger !== 'undefined' && logger.success) {
                logger.success(message);
            } else {
                console.log(`✅ ${message}`);
            }
        },
        
        debug: function(label, data) {
            if (typeof logger !== 'undefined' && logger.debug) {
                logger.debug(label, data);
            } else {
                console.group(`🔍 ${label}`);
                console.log(data);
                console.groupEnd();
            }
        }
    };

    // Se logger já existe, usar ele diretamente
    if (typeof logger !== 'undefined') {
        window.safeLog = logger;
    }

})();


