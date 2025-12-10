-- =====================================================
-- SCRIPT: Criar Usuário Admin no Supabase
-- Descrição: Cria usuário administrativo para acesso ao painel
-- Data: 2024-12-10
-- =====================================================

-- IMPORTANTE: Execute este script no SQL Editor do Supabase Dashboard
-- Acesse: https://supabase.com/dashboard > seu projeto > SQL Editor

-- =====================================================
-- OPÇÃO 1: Criar usuário com senha (RECOMENDADO)
-- =====================================================

-- ❗ ALTERE O EMAIL E SENHA ANTES DE EXECUTAR
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  email_change_confirm_status,
  created_at,
  updated_at,
  confirmation_sent_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@dimar.com.br',                           -- ✏️ ALTERE O EMAIL
  crypt('SuaSenhaSegura123', gen_salt('bf')),     -- ✏️ ALTERE A SENHA
  NOW(),
  0,
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

-- =====================================================
-- OPÇÃO 2: Verificar se usuário foi criado
-- =====================================================

SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  role
FROM auth.users
WHERE email = 'admin@dimar.com.br';

-- =====================================================
-- OPÇÃO 3: Atualizar senha de usuário existente
-- =====================================================

-- Se precisar alterar a senha de um usuário existente:
UPDATE auth.users
SET 
  encrypted_password = crypt('NovaSenhaSegura456', gen_salt('bf')),  -- ✏️ ALTERE A SENHA
  updated_at = NOW()
WHERE email = 'admin@dimar.com.br';

-- =====================================================
-- OPÇÃO 4: Confirmar email manualmente (se necessário)
-- =====================================================

UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  email_change_confirm_status = 0
WHERE email = 'admin@dimar.com.br';

-- =====================================================
-- OPÇÃO 5: Deletar usuário (se precisar recriar)
-- =====================================================

-- ⚠️ CUIDADO: Isso deleta permanentemente o usuário
DELETE FROM auth.users 
WHERE email = 'admin@dimar.com.br';

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Listar todos os usuários do sistema:
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  role,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

-- 1. A senha deve ter no mínimo 6 caracteres
-- 2. O email deve ser único no sistema
-- 3. email_confirmed_at = NOW() confirma o email automaticamente
-- 4. role = 'authenticated' dá permissões de usuário autenticado
-- 5. A função crypt() usa bcrypt para hash da senha

-- =====================================================
-- APÓS CRIAR O USUÁRIO
-- =====================================================

-- 1. Teste o login em: http://localhost:8000/dimaradmin/login.html
-- 2. Use o email e senha definidos acima
-- 3. Verifique se consegue acessar o dashboard
-- 4. Se funcionar local, faça o mesmo teste em produção
