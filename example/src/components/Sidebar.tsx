import { useState, useEffect } from 'react';
import './Sidebar.css';

export type SectionId = 
  | 'environment'
  | 'categories'
  | 'products'
  | 'customers'
  | 'cart'
  | 'orders'
  | 'refunds'
  | 'payments'
  | 'system'
  | 'integration'
  | 'events'
  | 'examples';

interface SidebarProps {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
}

interface Section {
  id: SectionId;
  label: string;
  icon?: string;
}

const sections: Section[] = [
  { id: 'environment', label: 'Environment' },
  { id: 'categories', label: 'Categories' },
  { id: 'products', label: 'Products' },
  { id: 'customers', label: 'Customers' },
  { id: 'cart', label: 'Cart' },
  { id: 'orders', label: 'Orders' },
  { id: 'refunds', label: 'Refunds' },
  { id: 'payments', label: 'Payments' },
  { id: 'system', label: 'System' },
  { id: 'integration', label: 'Integration' },
  { id: 'events', label: 'Events' },
  { id: 'examples', label: 'Examples' },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Update document body attribute for CSS targeting
  useEffect(() => {
    if (collapsed) {
      document.body.setAttribute('data-sidebar-collapsed', 'true');
    } else {
      document.body.removeAttribute('data-sidebar-collapsed');
    }
  }, [collapsed]);

  return (
    <div className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <h2 className="sidebar__title">Commands</h2>
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="sidebar__nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`sidebar__item ${
              activeSection === section.id ? 'sidebar__item--active' : ''
            }`}
            onClick={() => onSectionChange(section.id)}
          >
            <span className="sidebar__item-label">{section.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar__footer">
        <div className="sidebar__status">
          <span className="sidebar__status-indicator"></span>
          <span className="sidebar__status-text">Ready</span>
        </div>
      </div>
    </div>
  );
}

