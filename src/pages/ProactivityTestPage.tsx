
import React from "react";
import ClientLayout from "@/components/client/ClientLayout";
import ProactivityTest from "@/components/tests/ProactivityTest";

const ProactivityTestPage = () => {
  return (
    <ClientLayout title="Formulário de Proatividade">
      <div className="max-w-4xl mx-auto">
        <ProactivityTest />
      </div>
    </ClientLayout>
  );
};

export default ProactivityTestPage;
