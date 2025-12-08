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
            // Warnings sempre aparecem (inclusive em produção)
            console.warn(...args);
        },
        
        error: function(...args) {
            // Errors sempre aparecem (inclusive em produção)
            console.error(...args);
        },
        
        success: function(message) {
            // Success sempre aparece em desenvolvimento, e como log simples em produção
            if (isDevelopment) {
                console.log(`%c✅ ${message}`, 'color: #27ae60; font-weight: bold;');
            } else {
                console.log(`✅ ${message}`);
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

    // NÃO desabilitar console em produção - causa mais problemas do que resolve
    // Mantemos para debug se necessário

    logger.success('Logger system initialized');
})();

