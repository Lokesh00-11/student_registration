import React from 'react';
import {
  Users,
  UserPlus,
  GraduationCap,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'students', label: 'Student Details', icon: Users },
    { id: 'registration', label: 'Student Registration', icon: UserPlus },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <GraduationCap size={32} className="brand-icon" />
        <div className="brand-text">
          <h2>EduPortal</h2>
          <span>Student System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-heading">MAIN MENU</span>
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
