import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  PawPrint,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import './AdminSidebar.css';

import logo from '../../../assets/logo.png';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/animais', label: 'Animais', icon: PawPrint },
  { to: '/dashboard/solicitacoes', label: 'Solicitações', icon: ClipboardList },
];

interface AdminSidebarProps {
  open: boolean;
  isMobile: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function AdminSidebar({
  open,
  isMobile,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  return (
    <>
      <div
        className={`admin-sidebar-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="admin-sidebar-inner">
          <div className="admin-sidebar-brand">
            <img src={logo} alt="NovoLar" />

            <button
              type="button"
              className="admin-sidebar-close"
              onClick={onClose}
              aria-label="Fechar menu"
            >
              <X />
            </button>
          </div>

          <nav className="admin-sidebar-nav">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                onClick={isMobile ? onClose : undefined}
                className={({ isActive }) =>
                  `admin-sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <button
              type="button"
              className="admin-sidebar-logout"
              onClick={onLogout}
            >
              <LogOut />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
