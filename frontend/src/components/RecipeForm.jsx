import React, { useState, useEffect } from 'react';
import { X, Plus, Trash } from 'lucide-react';

const RecipeForm = ({ recipe, onSave, onCancel }) => {
  const isEdit = !!recipe;

  // Form Fields State
  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [imageUrl, setImageUrl] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Ingredients list builder states
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  
  // Validation error state
  const [error, setError] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || '');
      setCuisine(recipe.cuisine || '');
      setCookingTime(recipe.cookingTime || '');
      setDifficulty(recipe.difficulty || 'Easy');
      setImageUrl(recipe.imageUrl || '');
      setInstructions(recipe.instructions || '');
      setIngredients(recipe.ingredients || []);
    } else {
      // Reset defaults
      setTitle('');
      setCuisine('');
      setCookingTime('');
      setDifficulty('Easy');
      setImageUrl('');
      setInstructions('');
      setIngredients([]);
    }
  }, [recipe]);

  // Handle adding ingredient tag
  const handleAddIngredient = (e) => {
    e.preventDefault();
    const trimmed = currentIngredient.trim();
    if (!trimmed) return;
    
    if (ingredients.includes(trimmed)) {
      setError('This ingredient is already in the list');
      return;
    }

    setIngredients([...ingredients, trimmed]);
    setCurrentIngredient('');
    setError('');
  };

  // Handle removing ingredient tag
  const handleRemoveIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validations
    if (!title.trim()) {
      setError('Recipe title is required');
      return;
    }
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }
    const timeNum = parseInt(cookingTime, 10);
    if (isNaN(timeNum) || timeNum <= 0) {
      setError('Cooking time must be a positive number of minutes');
      return;
    }
    if (!instructions.trim()) {
      setError('Preparation instructions are required');
      return;
    }

    const payload = {
      title: title.trim(),
      cuisine: cuisine.trim() || 'General',
      cookingTime: timeNum,
      difficulty,
      imageUrl: imageUrl.trim(),
      ingredients,
      instructions: instructions.trim()
    };

    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content glass-panel" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        {/* Form Header */}
        <div className="form-header">
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>
            {isEdit ? 'Modify Recipe' : 'Add New Recipe'}
          </h2>
          <button className="modal-close-btn" onClick={onCancel} style={{ top: '1.25rem', right: '1.5rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-body">
            {/* Display validation errors */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '0.85rem'
              }}>
                {error}
              </div>
            )}

            {/* Title Field */}
            <div className="form-group">
              <label className="form-label">Recipe Title *</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Garlic Herb Roasted Chicken"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Grid properties */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Cuisine Category</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Italian, Indian, Mexican"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cooking Time (minutes) *</label>
                <input
                  type="number"
                  className="input-control"
                  placeholder="e.g. 45"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <select
                  className="filter-select input-control"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="input-control"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Ingredients builder */}
            <div className="form-group">
              <label className="form-label">Ingredients *</label>
              <div className="ingredients-builder">
                <div className="ingredients-input-row">
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Type an ingredient (e.g. 2 cloves garlic, minced)"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddIngredient(e);
                      }
                    }}
                  />
                  <button type="button" className="btn btn-secondary" onClick={handleAddIngredient}>
                    <Plus size={18} />
                  </button>
                </div>

                {/* Ingredient Chips */}
                <div className="chips-container">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="chip">
                      <span>{ing}</span>
                      <span className="chip-close" onClick={() => handleRemoveIngredient(idx)}>
                        <X size={12} />
                      </span>
                    </div>
                  ))}
                  {ingredients.length === 0 && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No ingredients added yet. Add at least one.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Cooking Instructions */}
            <div className="form-group">
              <label className="form-label">Preparation & Cooking Instructions *</label>
              <textarea
                className="input-control textarea-control"
                placeholder="Step 1. Pre-heat oven to 375F...&#10;Step 2. Chop all vegetables..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;
