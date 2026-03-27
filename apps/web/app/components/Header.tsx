import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick?: () => void;
  onHomeClick?: () => void;
  title?: string;
  showSubtitle?: boolean;
  isHome?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onHomeClick,
  title = 'AInspire',
  showSubtitle = true,
  isHome = true,
}) => {
  return (
    <header className={styles.header}>
      <button
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
          <rect width="22" height="2.5" rx="1.25" fill="#2D2A26" />
          <rect y="6.75" width="22" height="2.5" rx="1.25" fill="#2D2A26" />
          <rect y="13.5" width="22" height="2.5" rx="1.25" fill="#2D2A26" />
        </svg>
      </button>

      <button
        className={styles.homeButton}
        onClick={onHomeClick}
        aria-label="Home"
        title="Back to home"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      </button>

      <div className={styles.titleArea}>
        <div className={styles.titleContent}>
          <div className={styles.iconWrapper}>
            <img
              src="/frame.svg"
              alt="AInspire"
              width="28"
              height="28"
              className={styles.icon}
            />
          </div>
          <h1 className={styles.title}>{title}</h1>
        </div>
        {showSubtitle && <p className={styles.subtitle}>Create with AI</p>}
      </div>

      <button className={styles.profileButton} aria-label="Profile">
        <span className={styles.profileRing}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="white" />
          </svg>
        </span>
      </button>
    </header>
  );
};

export default Header;
