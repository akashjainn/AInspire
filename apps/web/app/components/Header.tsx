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
  showSubtitle = true,
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

      <div className={styles.titleArea}>
        <div className={styles.titleContent}>
          <div className={styles.iconWrapper}>
            <Image
              src="/frame.png"
              alt="AInspire"
              width={28}
              height={28}
              priority
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
