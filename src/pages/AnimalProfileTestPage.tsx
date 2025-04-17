
import React from "react";
import ClientLayout from "@/components/client/ClientLayout";
import AnimalProfileTest from "@/components/tests/AnimalProfileTest";

const AnimalProfileTestPage = () => {
  return (
    <ClientLayout title="Teste de Perfil - Animais">
      <div className="max-w-4xl mx-auto">
        <AnimalProfileTest />
      </div>
    </ClientLayout>
  );
};

export default AnimalProfileTestPage;
