import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './AdminLayout.css';

import { AdminSidebar } from '../AdminSidebar/AdminSidebar';
import { AdminTopbar } from '../AdminTopbar/AdminTopbar';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

type MeData = {
  me: {
    id: string;
    name: string;
    email: string;
  };
};

const ME: TypedDocumentNode<MeData, Record<string, never>> = gql`
  query AdminLayoutUser {
    me {
      id
      name
      email
    }
  }
`;

const LOGOUT: TypedDocumentNode<
  { logout: boolean },
  Record<string, never>
> = gql`
  mutation AdminLayoutLogout {
    logout
  }
`;

const MOBILE_QUERY = '(max-width: 1024px)';

interface AdminLayoutProps {
  title: string;
  children: ReactNode;
}

export function AdminLayout({ title, children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const client = useApolloClient();

  // Desktop e mobile usam estados separados: redimensionar a janela nunca
  // carrega o estado de um contexto para o outro, entao o drawer sempre
  // comeca fechado e a sidebar desktop sempre comeca expandida.

  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobile = useMediaQuery(MOBILE_QUERY);

  const sidebarOpen = isMobile ? mobileOpen : !desktopCollapsed;

  const { data: meData } = useQuery(ME);

  const [logout] = useMutation(LOGOUT);

  function toggleSidebar() {
    if (isMobile) {
      setMobileOpen((current) => !current);
    } else {
      setDesktopCollapsed((current) => !current);
    }
  }

  // O clearStore impede que os dados administrativos fiquem no cache do
  // Apollo e reaparecam na sessao de outro usuario.

  async function handleLogout() {
    await logout();

    await client.clearStore();

    navigate('/login', { replace: true });
  }

  return (
    <div className="admin-layout">
      <AdminSidebar
        open={sidebarOpen}
        isMobile={isMobile}
        onClose={toggleSidebar}
        onLogout={handleLogout}
      />

      <div className="admin-layout-main">
        <AdminTopbar
          title={title}
          userName={meData?.me.name ?? 'Admin NovoLar'}
          sidebarOpen={sidebarOpen}
          onToggleMenu={toggleSidebar}
        />

        <div className="admin-layout-content">{children}</div>

        <footer className="admin-layout-footer">
          © 2026 NovoLar Administrativo — Sistema de Gestão de Animais
        </footer>
      </div>
    </div>
  );
}
