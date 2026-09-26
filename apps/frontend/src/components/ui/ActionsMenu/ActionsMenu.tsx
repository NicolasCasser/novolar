import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import './ActionsMenu.css';

export type ActionMenuItem = {
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  tone?: 'default' | 'danger';
};

interface ActionsMenuProps {
  label: string;
  items: ActionMenuItem[];
  icon: LucideIcon;
}

export function ActionsMenu({ label, items, icon: Icon }: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // A tabela tem overflow-x, entao um menu absoluto seria cortado. O menu usa
  // position: fixed e acompanha o botao pela posicao na viewport.

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);

        triggerRef.current?.focus();
      }
    }

    function handleReposition() {
      const rect = triggerRef.current?.getBoundingClientRect();

      if (rect) {
        setPosition({ top: rect.bottom + 6, left: rect.right });
      }
    }

    handleReposition();

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="actions-menu-trigger"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="actions-menu"
            role="menu"
            style={{ top: position.top, left: position.left }}
          >
            {items.map((item) => {
              const ItemIcon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  className={`actions-menu-item ${
                    item.tone === 'danger' ? 'actions-menu-item--danger' : ''
                  }`}
                  onClick={() => {
                    setOpen(false);

                    item.onSelect();
                  }}
                >
                  <ItemIcon />
                  {item.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
