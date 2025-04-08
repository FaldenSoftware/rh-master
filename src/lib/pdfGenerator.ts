
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { AnimalProfileResult, animalProfiles } from "./animalProfileService";
import { AuthUser } from "./authTypes";

export const generateAnimalProfilePDF = async (
  result: AnimalProfileResult,
  user: AuthUser
): Promise<void> => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Extract data
    const animals = result.animalPredominante.split("-");
    const completedDate = new Date(result.completedAt).toLocaleDateString('pt-BR');

    // Set document properties
    doc.setProperties({
      title: "Relatório de Perfil - Teste de Animais",
      subject: "Perfil comportamental baseado na metáfora de animais",
      author: "Mindstock",
      creator: "Mindstock"
    });

    // Utility functions for text positioning
    const pageWidth = doc.internal.pageSize.getWidth();
    const center = pageWidth / 2;
    
    // Add header
    doc.setFillColor(90, 49, 153); // Purple header
    doc.rect(0, 0, pageWidth, 30, "F");
    
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("Relatório de Perfil - Teste de Animais", center, 15, { align: "center" });

    // Add logo (commented out until we have an actual logo)
    // const logoDataUrl = "..."; // base64 encoded logo
    // doc.addImage(logoDataUrl, "PNG", 10, 5, 20, 20);

    // Add user info
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Nome: ${user.name}`, 20, 40);
    doc.text(`Data de conclusão: ${completedDate}`, 20, 48);
    
    // Add results info
    let yPosition = 60;
    
    doc.setFontSize(16);
    doc.setTextColor(90, 49, 153);
    
    if (animals.length > 1) {
      doc.text(
        `Perfil Híbrido: ${animals.map(a => animalProfiles[a as keyof typeof animalProfiles].name).join(' e ')}`, 
        center, 
        yPosition, 
        { align: "center" }
      );
      yPosition += 8;
      
      doc.setFontSize(14);
      doc.text(
        `Uma combinação de ${animals.map(a => animalProfiles[a as keyof typeof animalProfiles].title).join(' e ')}`, 
        center, 
        yPosition, 
        { align: "center" }
      );
    } else {
      doc.text(
        `Perfil: ${animalProfiles[animals[0] as keyof typeof animalProfiles].name}`, 
        center, 
        yPosition, 
        { align: "center" }
      );
      yPosition += 8;
      
      doc.setFontSize(14);
      doc.text(
        `${animalProfiles[animals[0] as keyof typeof animalProfiles].title}`, 
        center, 
        yPosition, 
        { align: "center" }
      );
    }
    
    yPosition += 15;
    
    // Add scores
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition - 5, pageWidth - 40, 30, "F");
    
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Pontuação por Perfil:", 20, yPosition);
    
    yPosition += 8;
    doc.text(`Tubarão (Executor): ${result.scoreTubarao}`, 30, yPosition);
    yPosition += 6;
    doc.text(`Gato (Comunicador): ${result.scoreGato}`, 30, yPosition);
    yPosition += 6;
    doc.text(`Lobo (Organizador): ${result.scoreLobo}`, 30, yPosition);
    yPosition += 6;
    doc.text(`Águia (Idealizador): ${result.scoreAguia}`, 30, yPosition);
    
    yPosition += 15;
    
    // For each predominant animal, add details
    for (const animalKey of animals) {
      const animal = animalProfiles[animalKey as keyof typeof animalProfiles];
      
      // Add section break if not the first animal
      if (animalKey !== animals[0]) {
        yPosition += 10;
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 15;
      }
      
      // Check if we need a new page
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Animal name and title
      doc.setFontSize(16);
      doc.setTextColor(90, 49, 153);
      doc.text(`${animal.name} - ${animal.title}`, 20, yPosition);
      
      yPosition += 10;
      
      // Description
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text(animal.description, 20, yPosition, { maxWidth: pageWidth - 40 });
      
      yPosition += 15;
      
      // Characteristics
      doc.setFontSize(14);
      doc.setTextColor(90, 49, 153);
      doc.text("Principais Características:", 20, yPosition);
      
      yPosition += 8;
      
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      animal.characteristics.forEach(char => {
        doc.text(`• ${char}`, 25, yPosition);
        yPosition += 7;
        
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      yPosition += 5;
      
      // Check if we need a new page
      if (yPosition > 230) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Strengths
      doc.setFontSize(14);
      doc.setTextColor(90, 49, 153);
      doc.text("Pontos Fortes:", 20, yPosition);
      
      yPosition += 8;
      
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      animal.strengths.forEach(strength => {
        doc.text(`• ${strength}`, 25, yPosition);
        yPosition += 7;
        
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      yPosition += 5;
      
      // Check if we need a new page
      if (yPosition > 230) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Challenges
      doc.setFontSize(14);
      doc.setTextColor(90, 49, 153);
      doc.text("Desafios:", 20, yPosition);
      
      yPosition += 8;
      
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      animal.challenges.forEach(challenge => {
        doc.text(`• ${challenge}`, 25, yPosition);
        yPosition += 7;
        
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      yPosition += 5;
      
      // Check if we need a new page
      if (yPosition > 230) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Recommendations
      doc.setFontSize(14);
      doc.setTextColor(90, 49, 153);
      doc.text("Recomendações para Desenvolvimento:", 20, yPosition);
      
      yPosition += 8;
      
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      animal.recommendations.forEach(rec => {
        doc.text(`• ${rec}`, 25, yPosition);
        yPosition += 7;
        
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      yPosition += 15;
    }
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Page number
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: "right" });
      
      // Company footer
      doc.text("© Mindstock - Teste de Perfil Animal", 20, doc.internal.pageSize.getHeight() - 10);
    }
    
    // Save PDF
    doc.save(`Perfil_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
