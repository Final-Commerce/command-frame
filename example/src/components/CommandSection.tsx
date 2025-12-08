import { ReactNode } from 'react';
import './CommandSection.css';

interface CommandSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function CommandSection({ title, children, className = '' }: CommandSectionProps) {
  return (
    <div className={`command-section ${className}`}>
      <h3 className="command-section__title">{title}</h3>
      <div className="command-section__content">
        {children}
      </div>
    </div>
  );
}

