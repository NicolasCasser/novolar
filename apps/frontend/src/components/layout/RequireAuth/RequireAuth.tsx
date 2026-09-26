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

  const { loading, error } = useQuery(ME);

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
