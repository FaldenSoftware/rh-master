
import React from 'react';
import AnimalProfileTest from '@/components/tests/AnimalProfileTest';
import { useParams } from 'react-router-dom';

const AnimalProfileTestPage: React.FC = () => {
  const { clientTestId } = useParams<{ clientTestId: string }>();

  if (!clientTestId) {
    return <div>Erro: ID do teste não encontrado</div>;
  }

  return <AnimalProfileTest clientTestId={clientTestId} />;
};

export default AnimalProfileTestPage;
