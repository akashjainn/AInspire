import React from 'react';
import styles from './Sidebar.module.css';

interface NavItem {
  label: string;
  icon?: 'bookmark' | 'user' | 'archive' | 'settings';
  onClick?: () => void;
  active?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { label: 'View Saved', icon: 'bookmark' },
  { label: 'Account', icon: 'user' },
  { label: 'Archive', icon: 'archive' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, items = defaultItems }) => {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <nav className={styles.nav}>
          {items.map((item, idx) => (
            <button
              key={idx}
              className={`${styles.navItem} ${item.active ? styles.active : ''}`}
              onClick={() => {
                item.onClick?.();
                onClose?.();
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
