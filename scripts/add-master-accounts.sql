-- Script para implementação de contas mestres
-- Este script adiciona a coluna is_master_account à tabela profiles
-- e cria as contas mestres para mentor e cliente

-- Adicionar a coluna is_master_account à tabela profiles se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'is_master_account'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN is_master_account BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Coluna is_master_account adicionada à tabela profiles';
    ELSE
        RAISE NOTICE 'Coluna is_master_account já existe na tabela profiles';
    END IF;
END
$$;

-- Atualizar todos os registros existentes para is_master_account = FALSE
UPDATE public.profiles
SET is_master_account = FALSE
WHERE is_master_account IS NULL;

-- Atualização das políticas RLS para tabela profiles
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Mentores podem ver perfis dos seus clientes" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Contas mestres podem ver perfis" ON public.profiles;

-- Política para usuários verem seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil" ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Política para mentores verem perfis dos seus clientes
CREATE POLICY "Mentores podem ver perfis dos seus clientes" ON public.profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles AS p
            WHERE p.id = auth.uid() 
            AND p.role = 'mentor'
            AND profiles.mentor_id = p.id
        )
    );

-- Política para contas mestres verem perfis
CREATE POLICY "Contas mestres podem ver perfis" ON public.profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles AS p
            WHERE p.id = auth.uid() 
            AND p.is_master_account = TRUE
            AND (
                -- Contas mestres de mentor podem ver todos os perfis
                (p.role = 'mentor') OR
                -- Contas mestres de cliente podem ver apenas perfis de clientes
                (p.role = 'client' AND profiles.role = 'client')
            )
        )
    );

-- Política para usuários atualizarem seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Política para administradores (se existir esse papel)
CREATE POLICY "Administradores podem ver todos os perfis" ON public.profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles AS p
            WHERE p.id = auth.uid() 
            AND p.role = 'admin'
        )
    );

-- Atualização das políticas RLS para tabela test_results
DROP POLICY IF EXISTS "Contas mestres podem ver resultados de testes" ON public.test_results;

-- Política para contas mestres verem resultados de testes
CREATE POLICY "Contas mestres podem ver resultados de testes" ON public.test_results
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles AS p
            WHERE p.id = auth.uid() 
            AND p.is_master_account = TRUE
            AND (
                -- Contas mestres de mentor podem ver todos os resultados
                (p.role = 'mentor') OR
                -- Contas mestres de cliente podem ver resultados de todos os clientes
                (p.role = 'client')
            )
        )
    );

-- Atualização das políticas RLS para tabela invites (invitation_codes)
DROP POLICY IF EXISTS "Contas mestres podem gerenciar convites" ON public.invitation_codes;

-- Política para contas mestres gerenciarem convites
CREATE POLICY "Contas mestres podem gerenciar convites" ON public.invitation_codes
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles AS p
            WHERE p.id = auth.uid() 
            AND p.is_master_account = TRUE
            AND p.role = 'mentor'
        )
    );

-- Função para criar as contas mestre
-- Note: Esta função não cria diretamente usuários no Auth,
-- isso deve ser feito pelo dashboard do Supabase ou via API
CREATE OR REPLACE FUNCTION create_master_accounts()
RETURNS VOID AS $$
DECLARE
    mentor_id UUID;
    client_id UUID;
BEGIN
    -- Placeholder para IDs que serão gerados no Auth
    -- Essas variáveis devem ser substituídas pelos IDs reais após criação no Auth
    mentor_id := '00000000-0000-0000-0000-000000000001'::UUID;
    client_id := '00000000-0000-0000-0000-000000000002'::UUID;
    
    -- Verificar e inserir mentor mestre
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'mentor.mestre@rhmaster.space') THEN
        INSERT INTO public.profiles (
            id, name, email, role, is_master_account,
            bio, company, phone, position, created_at, updated_at
        )
        VALUES (
            mentor_id, 'Mentor Mestre', 'mentor.mestre@rhmaster.space', 'mentor', TRUE,
            'Conta mestre para demonstração e suporte técnico', 'RH Master', '+55 11 99999-9999',
            'Mentor Sênior', NOW(), NOW()
        );
        RAISE NOTICE 'Perfil de Mentor Mestre criado com sucesso';
    ELSE
        RAISE NOTICE 'Perfil de Mentor Mestre já existe';
    END IF;
    
    -- Verificar e inserir cliente mestre
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'cliente.mestre@rhmaster.space') THEN
        INSERT INTO public.profiles (
            id, name, email, role, is_master_account, mentor_id,
            bio, company, phone, position, created_at, updated_at
        )
        VALUES (
            client_id, 'Cliente Mestre', 'cliente.mestre@rhmaster.space', 'client', TRUE, mentor_id,
            'Conta mestre para demonstração e suporte técnico', 'RH Master', '+55 11 88888-8888',
            'Cliente Demonstração', NOW(), NOW()
        );
        RAISE NOTICE 'Perfil de Cliente Mestre criado com sucesso';
    ELSE
        RAISE NOTICE 'Perfil de Cliente Mestre já existe';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Instruções para uso:
-- 1. Primeiro execute este script para adicionar a coluna e atualizar as políticas RLS
-- 2. Crie os usuários no Auth do Supabase com os emails e senhas especificados:
--    - Email: mentor.mestre@rhmaster.space / Senha: RHMentor2025!
--    - Email: cliente.mestre@rhmaster.space / Senha: RHCliente2025!
-- 3. Obtenha os UUIDs dos usuários criados
-- 4. Substitua os placeholders de UUID na função create_master_accounts
-- 5. Execute a função create_master_accounts() para criar os perfis
