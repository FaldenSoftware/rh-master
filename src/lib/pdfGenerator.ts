
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { AnimalProfileResult, animalProfiles } from "./animalProfileService";

// Function to generate a PDF for the animal profile test results
export const generateAnimalProfilePDF = async (result: AnimalProfileResult, user: any) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Add header
  pdf.setFontSize(22);
  pdf.setTextColor(99, 102, 241);
  pdf.text("Teste de Perfil - Animais", pageWidth / 2, 20, { align: "center" });
  
  // Add user info
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Nome: ${user.name || 'Cliente'}`, 20, 35);
  pdf.text(`Data: ${new Date(result.completedAt).toLocaleDateString('pt-BR')}`, 20, 42);
  
  // Parse the animal predominante (handling ties)
  const animals = result.animalPredominante.split('-');
  
  // Add result heading
  pdf.setFontSize(16);
  pdf.setTextColor(99, 102, 241);
  if (animals.length > 1) {
    pdf.text(`Seu perfil é híbrido: ${animals.map(a => animalProfiles[a as keyof typeof animalProfiles].name).join(' e ')}`, 20, 55);
    pdf.text(`(${animals.map(a => animalProfiles[a as keyof typeof animalProfiles].title).join(' e ')})`, 20, 62);
  } else {
    pdf.text(`Seu perfil é: ${animalProfiles[animals[0] as keyof typeof animalProfiles].name}`, 20, 55);
    pdf.text(`(${animalProfiles[animals[0] as keyof typeof animalProfiles].title})`, 20, 62);
  }
  
  // Add scores
  pdf.setFontSize(14);
  pdf.text("Pontuações:", 20, 75);
  
  pdf.setFontSize(12);
  pdf.text(`Tubarão (Executor): ${result.scoreTubarao}`, 25, 85);
  pdf.text(`Gato (Comunicador): ${result.scoreGato}`, 25, 92);
  pdf.text(`Lobo (Organizador): ${result.scoreLobo}`, 25, 99);
  pdf.text(`Águia (Idealizador): ${result.scoreAguia}`, 25, 106);
  
  // Add descriptions for each predominant animal
  let yPosition = 120;
  
  for (const animalKey of animals) {
    const animal = animalProfiles[animalKey as keyof typeof animalProfiles];
    
    // Animal name and title
    pdf.setFontSize(14);
    pdf.setTextColor(99, 102, 241);
    pdf.text(`${animal.emoji} ${animal.name} (${animal.title})`, 20, yPosition);
    yPosition += 10;
    
    // Description
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    const descriptionLines = pdf.splitTextToSize(animal.description, pageWidth - 40);
    pdf.text(descriptionLines, 20, yPosition);
    yPosition += descriptionLines.length * 7;
    
    // Characteristics
    pdf.setFontSize(13);
    pdf.setTextColor(99, 102, 241);
    pdf.text("Principais Características:", 20, yPosition);
    yPosition += 7;
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    for (const characteristic of animal.characteristics) {
      pdf.text(`• ${characteristic}`, 25, yPosition);
      yPosition += 7;
    }
    yPosition += 5;
    
    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    // Strengths
    pdf.setFontSize(13);
    pdf.setTextColor(99, 102, 241);
    pdf.text("Pontos Fortes:", 20, yPosition);
    yPosition += 7;
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    for (const strength of animal.strengths) {
      pdf.text(`• ${strength}`, 25, yPosition);
      yPosition += 7;
    }
    yPosition += 5;
    
    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    // Challenges
    pdf.setFontSize(13);
    pdf.setTextColor(99, 102, 241);
    pdf.text("Desafios:", 20, yPosition);
    yPosition += 7;
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    for (const challenge of animal.challenges) {
      pdf.text(`• ${challenge}`, 25, yPosition);
      yPosition += 7;
    }
    yPosition += 5;
    
    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    // Recommendations
    pdf.setFontSize(13);
    pdf.setTextColor(99, 102, 241);
    pdf.text("Recomendações para Desenvolvimento:", 20, yPosition);
    yPosition += 7;
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    for (const recommendation of animal.recommendations) {
      pdf.text(`• ${recommendation}`, 25, yPosition);
      yPosition += 7;
    }
    
    yPosition += 15;
    
    // Add a new page for the next animal if needed
    if (animals.indexOf(animalKey) < animals.length - 1) {
      pdf.addPage();
      yPosition = 20;
    }
  }
  
  // Add footer
  const lastPage = pdf.internal.getNumberOfPages();
  pdf.setPage(lastPage);
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.text("Relatório gerado em " + new Date().toLocaleDateString('pt-BR'), 20, 287);
  
  // Save the PDF
  pdf.save(`perfil-animal-${user.name || 'cliente'}.pdf`);
};
