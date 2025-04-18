
-- Ativar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para leitura dos próprios dados
CREATE POLICY "Users can read their own profiles"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Política para leitura de todos os perfis para mentores
CREATE POLICY "Mentors can read all profiles"
ON public.profiles FOR SELECT
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'mentor');

-- Política para atualização dos próprios dados
CREATE POLICY "Users can update their own profiles"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Política para inserção de perfis
CREATE POLICY "Users can insert their own profiles"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);
