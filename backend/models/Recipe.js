const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a recipe title'],
    trim: true
  },
  ingredients: {
    type: [String],
    required: [true, 'Please add at least one ingredient']
  },
  instructions: {
    type: String,
    required: [true, 'Please add cooking instructions']
  },
  cookingTime: {
    type: Number,
    required: [true, 'Please add cooking time in minutes']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  cuisine: {
    type: String,
    default: 'General',
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', RecipeSchema);
