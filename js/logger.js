/**
 * Logger System
 * Sistema de logs que só aparece em desenvolvimento
 */

(function() {
    'use strict';

    // Detectar se está em desenvolvimento (localhost ou arquivo local)
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' || 
                         window.location.protocol === 'file:';

    // Logger wrapper
    window.logger = {
        log: function(...args) {
            if (isDevelopment) {
                console.log(...args);
            }
        },
        
        info: function(...args) {
            if (isDevelopment) {
                console.info(...args);
            }
        },
        
        warn: function(...args) {
            // Warnings sempre aparecem
            console.warn(...args);
        },
        
        error: function(...args) {
            // Errors sempre aparecem
            console.error(...args);
        },
        
        success: function(message) {
            if (isDevelopment) {
                console.log(`%c✅ ${message}`, 'color: #27ae60; font-weight: bold;');
            }
        },
        
        debug: function(label, data) {
            if (isDevelopment) {
                console.group(`🔍 ${label}`);
                console.log(data);
                console.groupEnd();
            }
        }
    };

    // Substituir console global em produção
    if (!isDevelopment) {
        const noop = function() {};
        console.log = noop;
        console.info = noop;
        console.debug = noop;
    }

    logger.success('Logger system initialized');
})();

