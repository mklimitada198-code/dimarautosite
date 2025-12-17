/**
 * Customer Authentication System
 * Login, Cadastro, Logout para clientes
 */

(function () {
    'use strict';

    // ==================== INICIALIZAÇÃO ====================
    document.addEventListener('DOMContentLoaded', () => {
        initAuthForms();
        checkAuthState();
    });

    // ==================== FORMULÁRIOS ====================
    function initAuthForms() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        // Register form  
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);

            // Validar confirmação de senha
            const confirmPassword = document.getElementById('confirmPassword');
            if (confirmPassword) {
                confirmPassword.addEventListener('input', validatePasswordMatch);
            }
        }

        // Recovery form
        const recoveryForm = document.getElementById('recoveryForm');
        if (recoveryForm) {
            recoveryForm.addEventListener('submit', handleRecovery);
        }
    }

    // ==================== LOGIN ====================
    async function handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');

        // Validar
        if (!email || !password) {
            showError('loginError', 'Preencha todos os campos');
            return;
        }

        // Loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        hideMessages();

        try {
            // Aguardar supabase estar pronto
            await waitForSupabase();

            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            console.log('✅ Login realizado:', data.user.email);
            showSuccess('loginSuccess');

            // Redirecionar após 1 segundo
            setTimeout(() => {
                const redirectTo = getRedirectUrl();
                window.location.href = redirectTo;
            }, 1000);

        } catch (error) {
            console.error('❌ Erro no login:', error);
            console.error('❌ Mensagem completa:', error.message);

            let errorMsg = 'Erro ao fazer login';

            if (error.message.includes('Invalid login credentials')) {
                errorMsg = 'Email ou senha incorretos';
            } else if (error.message.includes('Email not confirmed')) {
                errorMsg = 'Você precisa confirmar seu email antes de entrar. Verifique sua caixa de entrada.';
            } else if (error.message.includes('User not found')) {
                errorMsg = 'Usuário não encontrado. Verifique o email ou crie uma conta.';
            } else if (error.message.includes('Too many requests')) {
                errorMsg = 'Muitas tentativas. Aguarde alguns minutos.';
            } else if (error.message.includes('Network') || error.message.includes('fetch')) {
                errorMsg = 'Erro de conexão. Verifique sua internet.';
            } else {
                // Mostrar erro original para debug
                errorMsg = `Erro: ${error.message}`;
            }

            showError('loginError', errorMsg);
        } finally {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }

    // ==================== CADASTRO ====================
    async function handleRegister(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone')?.value.trim() || '';
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        const registerBtn = document.getElementById('registerBtn');

        // Validações
        if (!fullName || fullName.length < 3) {
            showError('registerError', 'Digite seu nome completo');
            return;
        }

        if (!email || !isValidEmail(email)) {
            showError('registerError', 'Digite um email válido');
            return;
        }

        if (!password || password.length < 8) {
            showError('registerError', 'A senha deve ter no mínimo 8 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            showError('registerError', 'As senhas não coincidem');
            return;
        }

        if (!terms) {
            showError('registerError', 'Você precisa aceitar os termos de uso');
            return;
        }

        // Loading state
        registerBtn.classList.add('loading');
        registerBtn.disabled = true;
        hideMessages();

        try {
            await waitForSupabase();

            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone
                    }
                }
            });

            if (error) throw error;

            console.log('✅ Cadastro realizado:', data);
            console.log('📧 Session:', data.session);
            console.log('👤 User:', data.user);

            // Verificar se precisa confirmar email
            if (data.user && !data.session) {
                // Confirm email está ATIVADO - usuário precisa confirmar
                console.log('📧 Confirmação de email necessária');

                // Mostrar mensagem de sucesso com instrução
                const successElement = document.getElementById('registerSuccess');
                if (successElement) {
                    successElement.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/>
                            <path d="M6 10L9 13L14 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Conta criada! Verifique seu email para confirmar o cadastro.</span>
                    `;
                }
                showSuccess('registerSuccess');

                // Não redirecionar - usuário precisa confirmar email primeiro
            } else if (data.session) {
                // Confirm email DESATIVADO - usuário já está logado
                console.log('✅ Usuário logado automaticamente');
                showSuccess('registerSuccess');

                // Redirecionar após 1.5 segundos
                // Redirecionar após 1.5 segundos
                setTimeout(() => {
                    if (window.location.hostname !== 'localhost') {
                        window.location.href = '/pages/minha-conta.html';
                    } else {
                        window.location.href = 'minha-conta.html';
                    }
                }, 1500);
            } else {
                // Caso inesperado
                console.warn('⚠️ Resposta inesperada do Supabase:', data);
                showSuccess('registerSuccess');
            }

        } catch (error) {
            console.error('❌ Erro no cadastro:', error);
            console.error('❌ Mensagem completa:', error.message);

            let errorMsg = 'Erro ao criar conta';
            if (error.message.includes('already registered') || error.message.includes('already been registered')) {
                errorMsg = 'Este email já está cadastrado. Tente fazer login.';
            } else if (error.message.includes('Password')) {
                errorMsg = 'Senha muito fraca. Use letras, números e caracteres especiais.';
            } else if (error.message.includes('Signups not allowed') || error.message.includes('signups not allowed')) {
                errorMsg = 'O cadastro de novos usuários está temporariamente desabilitado. Entre em contato conosco.';
            } else if (error.message.includes('Invalid email')) {
                errorMsg = 'Email inválido. Verifique e tente novamente.';
            } else if (error.message.includes('Email rate limit') || error.message.includes('rate limit')) {
                errorMsg = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
            } else if (error.message.includes('Network') || error.message.includes('fetch')) {
                errorMsg = 'Erro de conexão. Verifique sua internet e tente novamente.';
            } else {
                // Mostrar erro original para debug
                errorMsg = `Erro: ${error.message}`;
            }

            showError('registerError', errorMsg);
        } finally {
            registerBtn.classList.remove('loading');
            registerBtn.disabled = false;
        }
    }

    // ==================== RECUPERAR SENHA ====================
    async function handleRecovery(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const recoveryBtn = document.getElementById('recoveryBtn');

        if (!email || !isValidEmail(email)) {
            showError('recoveryError', 'Digite um email válido');
            return;
        }

        recoveryBtn.classList.add('loading');
        recoveryBtn.disabled = true;
        hideMessages();

        try {
            await waitForSupabase();

            const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/pages/nova-senha.html'
            });

            if (error) throw error;

            showSuccess('recoverySuccess');

        } catch (error) {
            console.error('❌ Erro na recuperação:', error);
            showError('recoveryError', 'Erro ao enviar email de recuperação');
        } finally {
            recoveryBtn.classList.remove('loading');
            recoveryBtn.disabled = false;
        }
    }

    // ==================== LOGOUT ====================
    window.customerLogout = async function () {
        try {
            await waitForSupabase();
            await window.supabaseClient.auth.signOut();

            console.log('✅ Logout realizado');
            console.log('✅ Logout realizado');
            if (window.location.hostname !== 'localhost') {
                window.location.href = '/';
            } else {
                window.location.href = '../index.html';
            }
        } catch (error) {
            console.error('❌ Erro no logout:', error);
        }
    };

    // ==================== VERIFICAR ESTADO ====================
    async function checkAuthState() {
        try {
            await waitForSupabase();

            const { data: { session } } = await window.supabaseClient.auth.getSession();

            if (session) {
                console.log('👤 Usuário logado:', session.user.email);
                updateHeaderForLoggedUser(session.user);

                // Se está na página de login/cadastro, redirecionar
                const currentPage = window.location.pathname;
                if (currentPage.includes('login.html') || currentPage.includes('cadastro.html') ||
                    currentPage.includes('/login') || currentPage.includes('/cadastro')) {
                    if (window.location.hostname !== 'localhost') {
                        window.location.href = '/pages/minha-conta.html';
                    } else {
                        window.location.href = 'minha-conta.html';
                    }
                }
            } else {
                console.log('👤 Usuário não logado');

                // Proteger páginas que requerem login
                // Verificar tanto URLs limpas (produção) quanto .html (local)
                const protectedPages = ['minha-conta', 'meus-pedidos'];
                const currentPage = window.location.pathname;

                const isProtectedPage = protectedPages.some(page =>
                    currentPage.includes(page + '.html') ||
                    currentPage.endsWith('/' + page) ||
                    currentPage === '/' + page
                );

                if (isProtectedPage) {
                    if (window.location.hostname !== 'localhost') {
                        window.location.href = '/pages/login.html';
                    } else {
                        window.location.href = 'login.html';
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao verificar auth:', error);
        }
    }

    // ==================== ATUALIZAR HEADER ====================
    function updateHeaderForLoggedUser(user) {
        // Encontrar o link "Entre ou Cadastre-se" e atualizar
        const authLink = document.querySelector('.header-action[href*="login"], .header-action[href="#login"]');

        if (authLink) {
            const userName = user.user_metadata?.full_name || user.email.split('@')[0];
            const firstName = userName.split(' ')[0];

            authLink.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" fill="white"/>
                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" fill="white"/>
                </svg>
                <div class="action-text">
                    <span class="action-label">Olá,</span>
                    <span class="action-value">${firstName}</span>
                </div>
            `;

            if (window.location.hostname !== 'localhost') {
                authLink.href = '/pages/minha-conta.html';
            } else {
                authLink.href = 'minha-conta.html';
                // Ajustar path se não estiver em /pages/
                if (!window.location.pathname.includes('/pages/')) {
                    authLink.href = 'pages/minha-conta.html';
                }
            }
        }
    }

    // ==================== HELPERS ====================
    function waitForSupabase() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50;

            const check = setInterval(() => {
                attempts++;

                if (window.supabaseClient) {
                    clearInterval(check);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    clearInterval(check);
                    reject(new Error('Supabase não carregou'));
                }
            }, 100);
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmGroup = document.getElementById('confirmPassword').closest('.form-group');

        if (confirmPassword && password !== confirmPassword) {
            confirmGroup.classList.add('has-error');
        } else {
            confirmGroup.classList.remove('has-error');
        }
    }

    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        const textElement = document.getElementById(elementId + 'Text');

        if (element) {
            if (textElement) textElement.textContent = message;
            element.classList.add('show');
        }
    }

    function showSuccess(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('show');
        }
    }

    function hideMessages() {
        document.querySelectorAll('.auth-alert').forEach(el => {
            el.classList.remove('show');
        });
    }

    function getRedirectUrl() {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect');

        if (redirect) {
            // Se o redirect já tem o path correto, usar ele
            const decoded = decodeURIComponent(redirect);
            // Se está em produção e não começa com /, adicionar /pages/ e .html
            if (window.location.hostname !== 'localhost') {
                if (!decoded.startsWith('/')) {
                    return '/pages/' + decoded + (decoded.endsWith('.html') ? '' : '.html');
                }
                return decoded;
            }
            return decoded;
        }

        if (window.location.hostname !== 'localhost') {
            return '/pages/minha-conta.html';
        }
        return 'minha-conta.html';
    }

    // Toggle password visibility
    window.togglePassword = function (inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    };

    // Expor função para uso em outras páginas
    window.customerAuth = {
        checkAuthState,
        updateHeaderForLoggedUser,
        logout: window.customerLogout
    };

})();
