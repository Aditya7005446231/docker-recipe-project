// API URL configuration
// In Vite, environment variables are loaded from import.meta.env.
// When containerized, the user can set VITE_API_URL or we build it to point to the backend service.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Fetch all recipes (supports query filtering)
  getRecipes: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.search) query.append('search', filters.search);
    if (filters.cuisine && filters.cuisine !== 'All') query.append('cuisine', filters.cuisine);
    if (filters.difficulty && filters.difficulty !== 'All') query.append('difficulty', filters.difficulty);

    const url = `${API_BASE_URL}/recipes?${query.toString()}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Fetch a single recipe by ID
  getRecipe: async (id) => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    return handleResponse(response);
  },

  // Create a new recipe
  createRecipe: async (recipeData) => {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
    });
    return handleResponse(response);
  },

  // Update an existing recipe
  updateRecipe: async (id, recipeData) => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
    });
    return handleResponse(response);
  },

  // Delete a recipe by ID
  deleteRecipe: async (id) => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
};


export const searchExternalRecipes = async (query) => {
  try{
    const response = await fetch(`http://localhost:5000/api/recipes/search/external?query=${query}`);

    if (!response.ok) throw new Error('Failed to fetch from server');

    const data = await response.json();
    return data;
  }catch(error){
    console.error('Error searching recipes:',error);
  }
};