import React from 'react';
import styles from './Sidebar.module.css';

interface NavItem {
  label: string;
  icon: 'bookmark' | 'user' | 'archive' | 'settings';
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

const IconComponent: React.FC<{ icon: NavItem['icon']; size?: number }> = ({ icon, size = 24 }) => {
  const iconProps = { width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor' };
  
  switch (icon) {
    case 'bookmark':
      return (
        <svg {...iconProps}>
          <path d="M5 3h14a2 2 0 0 1 2 2v16l-8-5-8 5V5a2 2 0 0 1 2-2z" />
        </svg>
      );
    case 'user':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
        </svg>
      );
    case 'archive':
      return (
        <svg {...iconProps}>
          <path d="M3 6h18v2H3V6zm1 3h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z" />
          <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="1" />
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m5.08-5.08l4.24-4.24" 
                stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    default:
      return null;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, items = defaultItems }) => {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close menu">
          ✕
        </button>
        
        <nav className={styles.nav}>
          {items.map((item, idx) => (
            <button
              key={idx}
              className={`${styles.navItem} ${item.active ? styles.active : ''}`}
              onClick={item.onClick}
            >
              <span className={styles.icon}>
                <IconComponent icon={item.icon} />
              </span>
              <span className={styles.label}>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className={styles.bottom}>
          <button className={styles.settingsButton}>
            <IconComponent icon="settings" size={20} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
