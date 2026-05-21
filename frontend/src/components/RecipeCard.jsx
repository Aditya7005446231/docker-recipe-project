import React from 'react';
import { Clock, BookOpen, Edit2, Trash2, Utensils } from 'lucide-react';

const RecipeCard = ({ recipe, onView, onEdit, onDelete }) => {
  const { _id, title, ingredients, cookingTime, difficulty, cuisine, imageUrl } = recipe;

  // Get difficulty badge class
  const getBadgeClass = (diff) => {
    switch (diff) {
      case 'Easy': return 'badge-easy';
      case 'Medium': return 'badge-medium';
      case 'Hard': return 'badge-hard';
      default: return 'badge-easy';
    }
  };

  // Safe delete handler to prevent click propagation
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(_id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(recipe);
  };

  return (
    <div className="recipe-card glass-panel" onClick={() => onView(recipe)}>
      {/* Recipe image preview or fallback */}
      <div className="card-image-wrapper">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="card-image" loading="lazy" />
        ) : (
          <div className="image-fallback">
            <Utensils size={40} />
            <span>NO IMAGE PROVIDED</span>
          </div>
        )}
        <span className="card-cuisine">{cuisine || 'General'}</span>
        <span className={`card-badge ${getBadgeClass(difficulty)}`}>{difficulty}</span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        
        <div className="card-meta">
          <div className="meta-item">
            <Clock size={15} />
            <span>{cookingTime} mins</span>
          </div>
          <div className="meta-item">
            <BookOpen size={15} />
            <span>{ingredients.length} ingredients</span>
          </div>
        </div>

        {/* Short ingredients description */}
        <p className="card-ingredients-preview">
          {ingredients.join(', ')}
        </p>

        {/* Action footer */}
        <div className="card-footer">
          <button className="btn btn-secondary btn-sm" onClick={() => onView(recipe)}>
            View Details
          </button>
          
          <div className="card-actions">
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleEditClick}
              title="Edit Recipe"
              style={{ padding: '0.4rem' }}
            >
              <Edit2 size={14} />
            </button>
            <button 
              className="btn btn-danger btn-sm" 
              onClick={handleDeleteClick}
              title="Delete Recipe"
              style={{ padding: '0.4rem' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
