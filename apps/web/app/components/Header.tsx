import React from 'react';
import Image from 'next/image';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
  showSubtitle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  title = 'AInspire',
  showSubtitle = true 
}) => {
  return (
    <header className={styles.header}>
      <button 
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      
      <div className={styles.titleArea}>
        <h1 className={styles.title}>
          {title}
          <span className={styles.sparkle}>
            <Image 
              src="/sparkle.svg" 
              alt="sparkle" 
              width={24} 
              height={24}
              priority
            />
          </span>
        </h1>
        {showSubtitle && <p className={styles.subtitle}>Create with AI</p>}
      </div>
      
      <div className={styles.spacer} />
    </header>
  );
};

export default Header;
