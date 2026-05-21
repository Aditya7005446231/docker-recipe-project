import React, { useState, useEffect } from 'react';
import { api } from './utils/api';
import Navbar from './components/Navbar';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import RecipeForm from './components/RecipeForm';
import { ChefHat, Database, Plus, RefreshCw, Sparkles } from 'lucide-react';

const App = () => {
  // Recipes list and UI states
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering and Searching states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  
  // Modals overlay states
  const [activeRecipe, setActiveRecipe] = useState(null); // Detail modal
  const [editRecipe, setEditRecipe] = useState(null);     // Edit form modal
  const [isFormOpen, setIsFormOpen] = useState(false);    // Create form modal

  // Toast notifications state
  const [toast, setToast] = useState(null);

  // Fetch recipes on mount or filter change
  const loadRecipes = async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchQuery,
        cuisine: selectedCuisine,
        difficulty: selectedDifficulty
      };
      const data = await api.getRecipes(filters);
      setRecipes(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not connect to the recipe server. Please make sure the backend is running and MongoDB is connected.');
    } finally {
      setLoading(false);
    }
  };

  // Run load recipes with debounce for search query
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadRecipes();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCuisine, selectedDifficulty]);

  // Trigger transient toast alert
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Create Recipe handler
  const handleCreate = async (recipeData) => {
    try {
      const newRecipe = await api.createRecipe(recipeData);
      setRecipes([newRecipe, ...recipes]);
      setIsFormOpen(false);
      showToast('Recipe created successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to create recipe', 'error');
    }
  };

  // Update Recipe handler
  const handleUpdate = async (recipeData) => {
    try {
      const updated = await api.updateRecipe(editRecipe._id, recipeData);
      setRecipes(recipes.map(r => r._id === editRecipe._id ? updated : r));
      setEditRecipe(null);
      
      // Update selected detail modal view if it was active
      if (activeRecipe && activeRecipe._id === editRecipe._id) {
        setActiveRecipe(updated);
      }
      showToast('Recipe updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update recipe', 'error');
    }
  };

  // Delete Recipe handler
  const handleDelete = async (id) => {
    try {
      await api.deleteRecipe(id);
      setRecipes(recipes.filter(r => r._id !== id));
      if (activeRecipe && activeRecipe._id === id) {
        setActiveRecipe(null);
      }
      showToast('Recipe deleted successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to delete recipe', 'error');
    }
  };

  // Pre-populate some starter recipes if the DB is blank
  const handleImportSeed = async () => {
    setLoading(true);
    const seedRecipes = [
      {
        title: "Classic Margherita Pizza",
        cuisine: "Italian",
        cookingTime: 25,
        difficulty: "Medium",
        imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=800",
        ingredients: [
          "1 pre-made pizza dough ball",
          "1/2 cup san marzano tomato sauce",
          "1 1/2 cups fresh mozzarella cheese, sliced",
          "Fresh basil leaves",
          "1 tbsp extra virgin olive oil",
          "Pinch of sea salt"
        ],
        instructions: "Step 1. Preheat oven to 500°F (260°C) with a pizza stone inside.\nStep 2. Roll out the pizza dough on a floured surface to a 12-inch circle.\nStep 3. Spread tomato sauce evenly, leaving a small border.\nStep 4. Top with sliced mozzarella cheese.\nStep 5. Carefully transfer to the oven and bake for 10-12 minutes until crust is charred and cheese bubbles.\nStep 6. Remove, scatter fresh basil on top, drizzle with olive oil, sprinkle salt, slice and enjoy!"
      },
      {
        title: "Creamy Chicken Tikka Masala",
        cuisine: "Indian",
        cookingTime: 45,
        difficulty: "Hard",
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800",
        ingredients: [
          "1.5 lbs chicken breasts, cut into bite-sized chunks",
          "1 cup plain yogurt",
          "2 tbsp lemon juice",
          "6 cloves garlic, minced",
          "1 tbsp minced ginger",
          "2 tsp garam masala",
          "1 tsp turmeric",
          "1 can (14oz) tomato puree",
          "1 cup heavy cream",
          "1 large onion, finely chopped"
        ],
        instructions: "Step 1. Marinate chicken in yogurt, lemon juice, half the garlic, ginger, and spices for 1 hour.\nStep 2. Grill or sear chicken in a skillet over high heat until browned (not fully cooked), then set aside.\nStep 3. In a large pot, sauté chopped onion, remaining garlic, and ginger until translucent.\nStep 4. Stir in tomato puree and simmer for 10 minutes.\nStep 5. Pour in heavy cream and cooked chicken. Simmer for 15-20 minutes until curry thickens and chicken is cooked through.\nStep 6. Garnish with fresh cilantro and serve with warm garlic naan or basmati rice."
      },
      {
        title: "Greek Yogurt Berry Parfait",
        cuisine: "Greek",
        cookingTime: 5,
        difficulty: "Easy",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800",
        ingredients: [
          "2 cups Greek yogurt",
          "1/2 cup organic granola",
          "1/2 cup fresh strawberries, sliced",
          "1/2 cup fresh blueberries",
          "2 tbsp organic honey or maple syrup",
          "Fresh mint leaves for garnish"
        ],
        instructions: "Step 1. Spoon a 1/2 cup layer of Greek yogurt into the bottom of a glass or jar.\nStep 2. Top with a layer of mixed strawberries and blueberries.\nStep 3. Sprinkle a layer of crunchy granola.\nStep 4. Repeat layers (yogurt, berries, granola) once more.\nStep 5. Drizzle honey or maple syrup over the top layer.\nStep 6. Garnish with a mint leaf and serve immediately as a nutritious breakfast or snack!"
      }
    ];

    try {
      let importedCount = 0;
      for (const recipe of seedRecipes) {
        await api.createRecipe(recipe);
        importedCount++;
      }
      showToast(`Successfully imported ${importedCount} recipes!`);
      loadRecipes();
    } catch (err) {
      showToast('Error seeding database: ' + err.message, 'error');
      setLoading(false);
    }
  };

  // Get list of unique cuisines dynamically from the loaded recipes for filter options
  const uniqueCuisines = ['All', ...new Set(recipes.map(r => r.cuisine).filter(Boolean))];

  return (
    <div className="app-container">
      {/* Brand Header & Global Actions */}
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onAddClick={() => setIsFormOpen(true)} 
      />

      {/* Filter Controls Bar */}
      <div className="filter-bar glass-panel">
        <div className="filter-group">
          <span className="filter-label">Filter Cuisine:</span>
          <select 
            className="filter-select"
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
          >
            {uniqueCuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Difficulty:</span>
          <select 
            className="filter-select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <button 
          className="btn btn-secondary btn-sm" 
          onClick={loadRecipes} 
          disabled={loading}
          style={{ gap: '0.35rem' }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <div className="empty-state" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <Database size={48} style={{ color: '#f43f5e' }} />
          <h3 className="empty-state-title" style={{ color: '#f87171' }}>Connection Offline</h3>
          <p className="empty-state-description">{error}</p>
          <button className="btn btn-primary" onClick={loadRecipes}>
            Try Reconnecting
          </button>
        </div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <ChefHat size={48} className="text-muted" />
          <h3 className="empty-state-title">No Recipes Found</h3>
          <p className="empty-state-description">
            {searchQuery || selectedCuisine !== 'All' || selectedDifficulty !== 'All' 
              ? "We couldn't find any recipes matching your current filter settings. Try adjusting your query or tags!"
              : "Your recipe book is currently empty. Start compiling your favorite gourmet dishes now!"}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
              <Plus size={18} />
              Add First Recipe
            </button>
            
            {(!searchQuery && selectedCuisine === 'All' && selectedDifficulty === 'All') && (
              <button className="btn btn-secondary" onClick={handleImportSeed} style={{ gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: '#fb923c' }} />
                <span>Import Seed Recipes</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              onView={setActiveRecipe}
              onEdit={setEditRecipe}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals & Overlays */}
      {activeRecipe && (
        <RecipeModal 
          recipe={activeRecipe} 
          onClose={() => setActiveRecipe(null)} 
        />
      )}

      {isFormOpen && (
        <RecipeForm 
          onSave={handleCreate} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}

      {editRecipe && (
        <RecipeForm 
          recipe={editRecipe} 
          onSave={handleUpdate} 
          onCancel={() => setEditRecipe(null)} 
        />
      )}

      {/* Transient Toast Alerts */}
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : ''}`}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;
