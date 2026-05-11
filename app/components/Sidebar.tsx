import React from 'react';

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '', children }) => {
  return (
<div className={`sidebar-component ${className}`}>
      {children || <h2>Sidebar</h2>}
    </div>
  );
};

Sidebar.displayName = 'Sidebar';export default Sidebar;