import React, { useState } from 'react';
import { X, Clock, AlertCircle, Bookmark, ClipboardList, ChefHat } from 'lucide-react';

const RecipeModal = ({ recipe, onClose }) => {
  const { title, ingredients, instructions, cookingTime, difficulty, cuisine, imageUrl } = recipe;

  // Track checked ingredients for an interactive culinary checklist
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Hero Section */}
        <div className="modal-hero">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="modal-hero-img" />
          ) : (
            <div className="image-fallback" style={{ height: '100%' }}>
              <ChefHat size={60} style={{ color: 'var(--text-muted)' }} />
            </div>
          )}
          <div className="modal-hero-overlay">
            <span className="modal-cuisine-tag">{cuisine || 'General'}</span>
            <h2 className="modal-title">{title}</h2>
          </div>
        </div>

        {/* Modal Info Details */}
        <div className="modal-body">
          <div className="modal-meta-grid">
            <div className="modal-meta-card">
              <span className="meta-card-label">Cooking Time</span>
              <span className="meta-card-value" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={16} className="text-secondary" />
                {cookingTime} mins
              </span>
            </div>
            
            <div className="modal-meta-card">
              <span className="meta-card-label">Difficulty</span>
              <span className="meta-card-value" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <AlertCircle size={16} className="text-secondary" />
                {difficulty}
              </span>
            </div>

            <div className="modal-meta-card">
              <span className="meta-card-label">Cuisine Type</span>
              <span className="meta-card-value" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Bookmark size={16} className="text-secondary" />
                {cuisine || 'General'}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="recipe-details-grid">
            {/* Ingredients Column */}
            <div>
              <h3 className="section-title">
                <ClipboardList size={18} style={{ color: '#f43f5e' }} />
                Ingredients
              </h3>
              <ul className="ingredients-list">
                {ingredients.map((ingredient, idx) => (
                  <li 
                    key={idx} 
                    className={`ingredient-item ${checkedIngredients[idx] ? 'checked' : ''}`}
                    onClick={() => toggleIngredient(idx)}
                  >
                    <input 
                      type="checkbox" 
                      className="ingredient-checkbox" 
                      checked={!!checkedIngredients[idx]} 
                      onChange={() => {}} // Controlled by the list item onClick
                    />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation / Instructions Column */}
            <div>
              <h3 className="section-title">
                <ChefHat size={18} style={{ color: '#fb923c' }} />
                Instructions
              </h3>
              <div className="instructions-text">
                {instructions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
