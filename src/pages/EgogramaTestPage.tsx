
import React from "react";
import ClientLayout from "@/components/client/ClientLayout";
import EgogramaTest from "@/components/tests/EgogramaTest";

const EgogramaTestPage = () => {
  return (
    <ClientLayout title="Egograma">
      <div className="max-w-4xl mx-auto">
        <EgogramaTest />
      </div>
    </ClientLayout>
  );
};

export default EgogramaTestPage;
