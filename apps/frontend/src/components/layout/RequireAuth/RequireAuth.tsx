import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import './RequireAuth.css';

type MeData = {
  me: {
    id: string;
    name: string;
    email: string;
  };
};

const ME: TypedDocumentNode<MeData, Record<string, never>> = gql`
  query RequireAuthAdmin {
    me {
      id
      name
      email
    }
  }
`;

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();

  // O token expira antes do cookie, entao a sessao precisa ser revalidada a
  // cada navegacao protegida. Com cache-first o Apollo responderia com o
  // "me" guardado no login e a tela continuaria parecendo autenticada mesmo
  // com o token expirado, so falhando na hora de salvar.

  const { loading, error } = useQuery(ME, { fetchPolicy: 'network-only' });

  useEffect(() => {
    if (error) {
      navigate('/login', { replace: true });
    }
  }, [error, navigate]);

  if (loading) {
    return <p className="require-auth-status">Carregando...</p>;
  }

  if (error) {
    return null;
  }

  return <>{children}</>;
}
