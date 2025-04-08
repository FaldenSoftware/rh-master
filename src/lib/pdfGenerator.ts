
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { AnimalProfileResult } from "./animalProfileService";
import { animalProfiles } from "./animalProfileService";

// Define types for data needed to generate PDFs
interface UserProfile {
  id: string;
  name: string;
  company?: string;
  email?: string;
}

export const generateAnimalProfilePDF = async (
  result: AnimalProfileResult,
  user: UserProfile
): Promise<void> => {
  // Create a new PDF document
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  // Document title
  const title = "Relatório de Perfil Comportamental";
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  // Define colors
  const primaryColor = "#8B5CF6"; // Purple
  const secondaryColor = "#6D28D9"; // Darker purple
  const textColor = "#1F2937"; // Dark gray
  const mutedColor = "#6B7280"; // Medium gray
  
  // Set up margins
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Helper functions
  const addPageHeader = () => {
    pdf.setFillColor(primaryColor);
    pdf.rect(0, 0, pageWidth, 30, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(title, pageWidth / 2, 17, { align: "center" });
  };
  
  const addPageFooter = () => {
    pdf.setFillColor(245, 245, 245);
    pdf.rect(0, pageHeight - 15, pageWidth, 15, "F");
    pdf.setTextColor(120, 120, 120);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(
      `Gerado em ${currentDate} | Avaliação de Perfil Comportamental Animal | Página ${pdf.internal.getCurrentPageInfo().pageNumber}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: "center" }
    );
  };
  
  // Add the first page header
  addPageHeader();
  addPageFooter();
  
  // Add user information section
  pdf.setTextColor(textColor);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Informações do Participante", margin, 45);
  
  pdf.setDrawColor(220, 220, 220);
  pdf.line(margin, 50, pageWidth - margin, 50);
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text(`Nome: ${user.name || "Não informado"}`, margin, 60);
  pdf.text(`Empresa: ${user.company || "Não informada"}`, margin, 70);
  pdf.text(`Data de Avaliação: ${new Date(result.completed_at).toLocaleDateString('pt-BR')}`, margin, 80);
  
  // Parse the animal predominante (handling ties)
  const animals = result.animal_predominante.split('-');
  
  // Get data for the predominant animal(s)
  const mainResults = animals.map(animal => {
    const animalKey = animal as keyof typeof animalProfiles;
    return animalProfiles[animalKey];
  });
  
  // Add result summary section
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(secondaryColor);
  pdf.text("Resultado da Avaliação", margin, 100);
  
  pdf.setDrawColor(secondaryColor);
  pdf.setLineWidth(0.5);
  pdf.line(margin, 105, pageWidth - margin, 105);
  
  pdf.setTextColor(textColor);
  pdf.setFontSize(14);
  
  let yPos = 120;
  
  if (animals.length > 1) {
    pdf.text(`Seu perfil é híbrido: ${animals.map(a => animalProfiles[a as keyof typeof animalProfiles].name).join(' e ')}`, margin, yPos);
    yPos += 10;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(`Você possui uma combinação de perfis: ${animals.map(a => animalProfiles[a as keyof typeof animalProfiles].title).join(' e ')}`, margin, yPos);
    yPos += 15;
    pdf.text("Por ter pontuações iguais em mais de um perfil, você apresenta uma combinação única dessas características.", margin, yPos, { 
      maxWidth: contentWidth 
    });
  } else {
    pdf.text(`Seu perfil é: ${mainResults[0].name} (${mainResults[0].title})`, margin, yPos);
    yPos += 15;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(mainResults[0].description, margin, yPos, { 
      maxWidth: contentWidth 
    });
  }
  
  // Add scores summary
  yPos += 25;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Distribuição de Pontuações", margin, yPos);
  yPos += 10;
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  
  // Calculate score metrics
  const totalPoints = result.score_tubarao + result.score_gato + result.score_lobo + result.score_aguia;
  const scores = [
    { name: "Tubarão (Executor)", score: result.score_tubarao, percentage: Math.round((result.score_tubarao / totalPoints) * 100) },
    { name: "Gato (Comunicador)", score: result.score_gato, percentage: Math.round((result.score_gato / totalPoints) * 100) },
    { name: "Lobo (Organizador)", score: result.score_lobo, percentage: Math.round((result.score_lobo / totalPoints) * 100) },
    { name: "Águia (Idealizador)", score: result.score_aguia, percentage: Math.round((result.score_aguia / totalPoints) * 100) },
  ];
  
  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);
  
  // Draw score bars
  scores.forEach((item, index) => {
    const y = yPos + (index * 20);
    
    // Draw label
    pdf.text(`${item.name}:`, margin, y);
    
    // Draw bar background
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin + 60, y - 5, 100, 10, "F");
    
    // Draw filled bar
    pdf.setFillColor(primaryColor);
    pdf.rect(margin + 60, y - 5, item.percentage, 10, "F");
    
    // Draw percentage
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${item.percentage}%`, margin + 170, y);
  });
  
  // Add a page break for detailed descriptions
  pdf.addPage();
  addPageHeader();
  
  // Detailed profile descriptions
  yPos = 45;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(secondaryColor);
  pdf.text("Detalhamento do Perfil", margin, yPos);
  yPos += 5;
  
  pdf.setDrawColor(secondaryColor);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;
  
  // Create sections for each profile in the result
  mainResults.forEach((profile, profileIndex) => {
    if (yPos > pageHeight - 50) {
      pdf.addPage();
      addPageHeader();
      addPageFooter();
      yPos = 45;
    }
    
    if (mainResults.length > 1) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(textColor);
      pdf.text(`${profile.name} (${profile.title})`, margin, yPos);
      yPos += 10;
    }
    
    // Characteristics section
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Principais Características:", margin, yPos);
    yPos += 10;
    
    pdf.setFont("helvetica", "normal");
    profile.characteristics.forEach((char, i) => {
      pdf.text(`• ${char}`, margin + 5, yPos);
      yPos += 7;
    });
    
    yPos += 5;
    
    // Create a two-column layout for strengths and challenges
    if (yPos > pageHeight - 80) {
      pdf.addPage();
      addPageHeader();
      addPageFooter();
      yPos = 45;
    }
    
    const colWidth = (contentWidth - 10) / 2;
    let leftColY = yPos;
    let rightColY = yPos;
    
    // Left column - Strengths
    pdf.setFont("helvetica", "bold");
    pdf.text("Pontos Fortes:", margin, leftColY);
    leftColY += 10;
    
    pdf.setFont("helvetica", "normal");
    profile.strengths.forEach((strength) => {
      pdf.text(`• ${strength}`, margin + 5, leftColY, { 
        maxWidth: colWidth - 10 
      });
      const textHeight = pdf.getTextDimensions(`• ${strength}`, { maxWidth: colWidth - 10 }).h;
      leftColY += textHeight + 5;
    });
    
    // Right column - Challenges
    pdf.setFont("helvetica", "bold");
    pdf.text("Desafios:", margin + colWidth + 10, rightColY);
    rightColY += 10;
    
    pdf.setFont("helvetica", "normal");
    profile.challenges.forEach((challenge) => {
      pdf.text(`• ${challenge}`, margin + colWidth + 15, rightColY, { 
        maxWidth: colWidth - 10 
      });
      const textHeight = pdf.getTextDimensions(`• ${challenge}`, { maxWidth: colWidth - 10 }).h;
      rightColY += textHeight + 5;
    });
    
    // Update yPos to the maximum of the two columns
    yPos = Math.max(leftColY, rightColY) + 10;
    
    // Check if we need a new page for recommendations
    if (yPos > pageHeight - 60) {
      pdf.addPage();
      addPageHeader();
      addPageFooter();
      yPos = 45;
    }
    
    // Recommendations section
    pdf.setFont("helvetica", "bold");
    pdf.text("Recomendações para Desenvolvimento:", margin, yPos);
    yPos += 10;
    
    pdf.setFont("helvetica", "normal");
    profile.recommendations.forEach((rec) => {
      pdf.text(`• ${rec}`, margin + 5, yPos, { 
        maxWidth: contentWidth - 10 
      });
      const textHeight = pdf.getTextDimensions(`• ${rec}`, { maxWidth: contentWidth - 10 }).h;
      yPos += textHeight + 5;
    });
    
    // Add spacing between profiles
    if (profileIndex < mainResults.length - 1) {
      yPos += 15;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(margin, yPos - 7, pageWidth - margin, yPos - 7);
    }
  });
  
  // Add footer to the last page
  const lastPage = pdf.internal.pages.length; // Fixed: use pages.length instead of getNumberOfPages()
  pdf.setPage(lastPage);
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`© ${new Date().getFullYear()} - Todos os direitos reservados`, pageWidth / 2, pageHeight - 20, { align: "center" });
  
  // Save the PDF
  pdf.save(`Perfil_Comportamental_${user.name?.replace(/\s+/g, '_') || 'Usuario'}.pdf`);
};
