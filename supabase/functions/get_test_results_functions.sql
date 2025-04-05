
-- Função para buscar informações de testes em lote
CREATE OR REPLACE FUNCTION public.get_test_info_batch(test_ids uuid[])
RETURNS SETOF tests
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT * FROM public.tests WHERE id = ANY(test_ids);
$$;

-- Função para buscar resultados de testes em lote
CREATE OR REPLACE FUNCTION public.get_test_results_batch(client_test_ids uuid[])
RETURNS SETOF test_results
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT * FROM public.test_results WHERE client_test_id = ANY(client_test_ids);
$$;
