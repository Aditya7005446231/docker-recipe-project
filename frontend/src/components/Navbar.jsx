import React from 'react';
import { ChefHat, Plus, Search } from 'lucide-react';

const Navbar = ({ searchQuery, setSearchQuery, onAddClick }) => {
  return (
    <nav className="navbar glass-panel">
      {/* Brand logo with SVG gradient support */}
      <div className="brand" onClick={() => setSearchQuery('')}>
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </svg>
        <ChefHat size={32} />
        <span>Sizzle & Savory</span>
      </div>

      <div className="nav-actions">
        {/* Interactive Search Bar */}
        <div className="search-box">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            className="search-input"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Add Recipe Button */}
        <button className="btn btn-primary" onClick={onAddClick}>
          <Plus size={18} />
          <span>Add Recipe</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
