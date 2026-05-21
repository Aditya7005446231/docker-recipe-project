const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, cuisine, difficulty } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (cuisine && cuisine !== 'All') {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Public
router.post('/', async (req, res) => {
  const { title, ingredients, instructions, cookingTime, difficulty, cuisine, imageUrl } = req.body;

  try {
    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      cuisine,
      imageUrl
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
