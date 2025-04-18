
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import useNotifications from '@/hooks/useNotifications';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TestResultExportProps {
  resultId: string;
}

export const TestResultExport = ({ resultId }: TestResultExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const notify = useNotifications();
  
  const { data: result, isLoading } = useQuery({
    queryKey: ['test-result', resultId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('test_results')
        .select(`
          *,
          client_test:client_test_id(
            client:client_id(name, email),
            test:test_id(title, description)
          )
        `)
        .eq('id', resultId)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    enabled: !!resultId
  });
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const renderResultContent = (data: any) => {
    if (!data) return '<p>Sem dados disponíveis</p>';
    
    let html = '<div>';
    
    Object.entries(data).forEach(([key, value]) => {
      html += `<p><strong>${key}:</strong> ${value}</p>`;
    });
    
    html += '</div>';
    return html;
  };

  const handleExportPDF = async () => {
    if (!result) return;
    
    setIsExporting(true);
    
    try {
      // Criar elemento temporário para renderizar o relatório
      const reportElement = document.createElement('div');
      reportElement.style.padding = '20px';
      reportElement.style.fontFamily = 'Arial, sans-serif';
      reportElement.style.width = '800px';
      reportElement.style.position = 'absolute';
      reportElement.style.left = '-9999px';
      
      const clientName = result.client_test?.client?.name || 'Cliente';
      const clientEmail = result.client_test?.client?.email || 'Email não disponível';
      const testTitle = result.client_test?.test?.title || 'Teste';
      const testDescription = result.client_test?.test?.description || 'Sem descrição';
      
      reportElement.innerHTML = `
        <div>
          <h1 style="text-align: center; color: #4f46e5;">Relatório de Resultado</h1>
          <h2>${testTitle}</h2>
          <p><strong>Cliente:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Data:</strong> ${formatDate(result.created_at)}</p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
          
          <h3>Descrição do Teste</h3>
          <p>${testDescription}</p>
          
          <h3>Resultados</h3>
          <div id="results-content">
            ${renderResultContent(result.data)}
          </div>
        </div>
      `;
      
      document.body.appendChild(reportElement);
      
      // Gerar PDF usando html2canvas e jsPDF
      const canvas = await html2canvas(reportElement);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`resultado_${testTitle}_${clientName}.pdf`);
      
      // Remover o elemento temporário
      document.body.removeChild(reportElement);
      
      notify.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      notify.error('Falha ao exportar relatório. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Button disabled className="flex items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Carregando...
      </Button>
    );
  }
  
  if (!result) {
    return <div>Resultado não encontrado</div>;
  }
  
  return (
    <div className="mb-4">
      <Button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="flex items-center"
      >
        {isExporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileText className="mr-2 h-4 w-4" />
        )}
        Exportar PDF
      </Button>
    </div>
  );
};

export default TestResultExport;
