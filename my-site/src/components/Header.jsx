import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="voidlnk-header">
      <div className="voidlnk-header-container">
        <div className="voidlnk-logo">
          {/* ...existing Voidlnk logo code... */}
        </div>
        <nav className="voidlnk-nav">
          <span className="voidlnk-resources">Resources</span>
        </nav>
        <button className="voidlnk-header-btn">
          {/* ...existing button text... */}
        </button>
      </div>
    </header>
  );
};

export default Header;
