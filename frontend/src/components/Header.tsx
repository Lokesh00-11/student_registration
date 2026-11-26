import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="header-right">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search students, courses..." />
        </div>

        <button className="icon-btn" title="Notifications">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Lokesh</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};
