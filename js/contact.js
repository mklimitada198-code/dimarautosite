/**
 * Contact Form Validation and Submission
 * Handles form validation, mask inputs, and submission
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const telefoneInput = document.getElementById('telefone');

    // Phone mask
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }

    // Form validation
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear previous errors
            clearErrors();

            // Validate fields
            let isValid = true;

            // Nome
            const nome = document.getElementById('nome');
            if (!nome.value.trim()) {
                showError('nome', 'Por favor, informe seu nome');
                isValid = false;
            } else if (nome.value.trim().length < 3) {
                showError('nome', 'Nome deve ter pelo menos 3 caracteres');
                isValid = false;
            }

            // Telefone
            const telefone = document.getElementById('telefone');
            const telefoneClean = telefone.value.replace(/\D/g, '');
            if (!telefone.value.trim()) {
                showError('telefone', 'Por favor, informe seu telefone');
                isValid = false;
            } else if (telefoneClean.length < 10) {
                showError('telefone', 'Telefone inválido');
                isValid = false;
            }

            // Email
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showError('email', 'Por favor, informe seu e-mail');
                isValid = false;
            } else if (!emailRegex.test(email.value)) {
                showError('email', 'E-mail inválido');
                isValid = false;
            }

            // Assunto
            const assunto = document.getElementById('assunto');
            if (!assunto.value) {
                showError('assunto', 'Por favor, selecione um assunto');
                isValid = false;
            }

            // Mensagem
            const mensagem = document.getElementById('mensagem');
            if (!mensagem.value.trim()) {
                showError('mensagem', 'Por favor, escreva sua mensagem');
                isValid = false;
            } else if (mensagem.value.trim().length < 10) {
                showError('mensagem', 'Mensagem deve ter pelo menos 10 caracteres');
                isValid = false;
            }

            // Aceite
            const aceite = document.getElementById('aceite');
            if (!aceite.checked) {
                showError('aceite', 'Você precisa aceitar receber contato');
                isValid = false;
            }

            // If form is valid, submit
            if (isValid) {
                submitForm();
            }
        });
    }

    /**
     * Show error message
     */
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorSpan = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.add('error');
        }
        
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add('visible');
        }
    }

    /**
     * Clear all errors
     */
    function clearErrors() {
        const errorFields = document.querySelectorAll('.form-input.error');
        const errorSpans = document.querySelectorAll('.form-error.visible');
        
        errorFields.forEach(field => field.classList.remove('error'));
        errorSpans.forEach(span => {
            span.classList.remove('visible');
            span.textContent = '';
        });
    }

    /**
     * Submit form (mock submission)
     */
    function submitForm() {
        const formData = {
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            assunto: document.getElementById('assunto').value,
            mensagem: document.getElementById('mensagem').value
        };

        console.log('Form submitted:', formData);

        // Show success message
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');

        // Reset form
        form.reset();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Remove error on input
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorSpan = document.getElementById(this.id + 'Error');
                if (errorSpan) {
                    errorSpan.classList.remove('visible');
                    errorSpan.textContent = '';
                }
            }
        });
    });

    // Remove error on checkbox change
    const aceite = document.getElementById('aceite');
    if (aceite) {
        aceite.addEventListener('change', function() {
            const errorSpan = document.getElementById('aceiteError');
            if (errorSpan && errorSpan.classList.contains('visible')) {
                errorSpan.classList.remove('visible');
                errorSpan.textContent = '';
            }
        });
    }
});

