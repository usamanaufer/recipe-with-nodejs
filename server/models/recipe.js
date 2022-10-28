const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This is field is required',
    },
    description: {
        type: String,
        required: 'This is field is required',
    },
    email: {
        type: String,
        required: 'This is field is required',
    },
    ingredients: {
        type: Array,
        required: 'This is field is required',
    },
    category: {
        type: String,
        enum: ['Thai', 'American', 'Chinese', 'Mexican', 'Indian'],
        required: 'This is field is required',
    },
    image: {
        type: String,
        required: 'This is field is required',
    },
});

recipeSchema.index({
    name: 'text',
    description: 'text'
});
// wildcard indexing

module.exports = mongoose.model('Recipe', recipeSchema)