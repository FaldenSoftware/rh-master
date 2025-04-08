
-- Ativar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir ao usuário ver seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);
  
-- Criar política para permitir ao usuário atualizar seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Criar política para permitir ao usuário inserir seu próprio perfil
CREATE POLICY "Usuários podem inserir seu próprio perfil" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
  
-- Criar política para mentores verem os perfis de seus clientes
CREATE POLICY "Mentores podem ver perfis de seus clientes" ON public.profiles
  FOR SELECT
  USING (auth.uid() = mentor_id);
