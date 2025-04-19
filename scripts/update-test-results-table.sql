-- Verificar se a tabela 'test_results' existe e criar se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'test_results') THEN
        CREATE TABLE public.test_results (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            client_test_id UUID NOT NULL,
            score_tubarao INTEGER DEFAULT 0,
            score_gato INTEGER DEFAULT 0,
            score_lobo INTEGER DEFAULT 0,
            score_aguia INTEGER DEFAULT 0,
            answers JSONB DEFAULT '{}'::jsonb,
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Habilitar RLS na tabela
        ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
        
        -- Criar índices para otimizar consultas
        CREATE INDEX idx_test_results_user_id ON public.test_results(user_id);
        CREATE INDEX idx_test_results_client_test_id ON public.test_results(client_test_id);
        CREATE INDEX idx_test_results_user_test ON public.test_results(user_id, client_test_id);
        
        RAISE NOTICE 'Tabela test_results criada com sucesso';
    ELSE
        RAISE NOTICE 'Tabela test_results já existe, verificando colunas...';
    END IF;
END
$$;

-- Verificar e adicionar as colunas necessárias se não existirem
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Verificar coluna score_tubarao
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'test_results' AND column_name = 'score_tubarao'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.test_results ADD COLUMN score_tubarao INTEGER DEFAULT 0;
        RAISE NOTICE 'Coluna score_tubarao adicionada';
    END IF;
    
    -- Verificar coluna score_gato
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'test_results' AND column_name = 'score_gato'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.test_results ADD COLUMN score_gato INTEGER DEFAULT 0;
        RAISE NOTICE 'Coluna score_gato adicionada';
    END IF;
    
    -- Verificar coluna score_lobo
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'test_results' AND column_name = 'score_lobo'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.test_results ADD COLUMN score_lobo INTEGER DEFAULT 0;
        RAISE NOTICE 'Coluna score_lobo adicionada';
    END IF;
    
    -- Verificar coluna score_aguia
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'test_results' AND column_name = 'score_aguia'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.test_results ADD COLUMN score_aguia INTEGER DEFAULT 0;
        RAISE NOTICE 'Coluna score_aguia adicionada';
    END IF;
    
    -- Verificar coluna answers
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'test_results' AND column_name = 'answers'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.test_results ADD COLUMN answers JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE 'Coluna answers adicionada';
    END IF;
    
    -- Verificar coluna metadata
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'test_results' AND column_name = 'metadata'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.test_results ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE 'Coluna metadata adicionada';
    END IF;
    
    -- Verificar coluna updated_at
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'test_results' AND column_name = 'updated_at'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.test_results ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Coluna updated_at adicionada';
    END IF;
    
    -- Verificar coluna user_id (se estiver como client_id)
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'test_results' AND column_name = 'user_id'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        -- Verificar se existe client_id para migrar
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'test_results' AND column_name = 'client_id'
        ) INTO column_exists;
        
        IF column_exists THEN
            ALTER TABLE public.test_results RENAME COLUMN client_id TO user_id;
            RAISE NOTICE 'Coluna client_id renomeada para user_id';
        ELSE
            ALTER TABLE public.test_results ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
            RAISE NOTICE 'Coluna user_id adicionada';
        END IF;
    END IF;
    
    -- Verificar se a coluna client_test_id existe
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'test_results' AND column_name = 'client_test_id'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE public.test_results ADD COLUMN client_test_id UUID;
        RAISE NOTICE 'Coluna client_test_id adicionada';
    END IF;
    
    -- Verificar índices
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'test_results' AND indexname = 'idx_test_results_user_id') THEN
        CREATE INDEX idx_test_results_user_id ON public.test_results(user_id);
        RAISE NOTICE 'Índice idx_test_results_user_id criado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'test_results' AND indexname = 'idx_test_results_client_test_id') THEN
        CREATE INDEX idx_test_results_client_test_id ON public.test_results(client_test_id);
        RAISE NOTICE 'Índice idx_test_results_client_test_id criado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'test_results' AND indexname = 'idx_test_results_user_test') THEN
        CREATE INDEX idx_test_results_user_test ON public.test_results(user_id, client_test_id);
        RAISE NOTICE 'Índice idx_test_results_user_test criado';
    END IF;
END
$$;

-- Remover políticas RLS existentes para test_results para evitar duplicidade
DROP POLICY IF EXISTS "Usuários podem ver seus próprios resultados" ON public.test_results;
DROP POLICY IF EXISTS "Mentores podem ver resultados de seus clientes" ON public.test_results;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios resultados" ON public.test_results;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios resultados" ON public.test_results;
DROP POLICY IF EXISTS "Administradores podem ver todos os resultados" ON public.test_results;

-- Habilitar RLS para a tabela se não estiver habilitado
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Adicionar políticas RLS
CREATE POLICY "Usuários podem ver seus próprios resultados" ON public.test_results
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Mentores podem ver resultados de seus clientes" ON public.test_results
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles AS p
            WHERE p.id = auth.uid() 
            AND p.role = 'mentor'
            AND EXISTS (
                SELECT 1 FROM public.profiles AS client
                WHERE client.id = test_results.user_id
                AND client.mentor_id = p.id
            )
        )
    );

CREATE POLICY "Usuários podem inserir seus próprios resultados" ON public.test_results
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios resultados" ON public.test_results
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Adicionar política para administradores
CREATE POLICY "Administradores podem ver todos os resultados" ON public.test_results
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles AS p
            WHERE p.id = auth.uid() 
            AND p.role = 'admin'
        )
    );
