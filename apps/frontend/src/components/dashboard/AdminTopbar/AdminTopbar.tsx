import { Menu } from 'lucide-react';

import './AdminTopbar.css';

interface AdminTopbarProps {
  title: string;
  userName: string;
  sidebarOpen: boolean;
  onToggleMenu: () => void;
}

export function AdminTopbar({
  title,
  userName,
  sidebarOpen,
  onToggleMenu,
}: AdminTopbarProps) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          type="button"
          className="admin-topbar-menu"
          onClick={onToggleMenu}
          aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={sidebarOpen}
        >
          <Menu />
        </button>

        <h1>{title}</h1>
      </div>

      <div className="admin-topbar-user">
        <span className="admin-topbar-user-name">{userName}</span>
        <span className="admin-topbar-user-role">Administrador</span>
      </div>
    </header>
  );
}
