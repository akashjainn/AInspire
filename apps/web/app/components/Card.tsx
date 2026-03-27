import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  image?: string;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  image,
  title,
  subtitle,
  onClick,
  selected = false,
  className = '',
  children,
}) => {
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ''} ${className}`}
      onClick={onClick}
    >
      {image && <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} />
      </div>}
      
      {children || (
        <div className={styles.content}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
    </button>
  );
};

export default Card;
