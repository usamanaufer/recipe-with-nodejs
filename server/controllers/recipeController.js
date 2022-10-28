require('../models/database');
const Category = require('../models/category');
const Recipe = require('../models/recipe');
/**
 * Get /
 * HomePage
 */

exports.homepage = async (req, res) => {

    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({
            _id: -1
        }).limit(limitNumber);
        const thai = await Recipe.find({
            'category': 'American'
        }).limit(limitNumber);
        const indian = await Recipe.find({
            'category': 'Indian'
        }).limit(limitNumber);

        const food = {
            latest,
            thai,
            indian
        };

        res.render('index', {
            title: 'Cooking Blog - Home',
            categories,
            food
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "error occured"
        });
    }



}

/* Get Categories */
exports.exploreCategories = async (req, res) => {

    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', {
            title: 'Cooking Blog - Categories',
            categories
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "error occured"
        });
    }

}

// get categories by id

exports.exploreCategoriesByID = async (req, res) => {

    try {
        let categoryId = req.params.id;

        const limitNumber = 20;
        const categoriesById = await Recipe.find({
            'category': categoryId
        }).limit(limitNumber);
        res.render('categories', {
            title: 'Cooking Blog - Categories',
            categories
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "error occured"
        });
    }

}

// get recipe:id
// recipe page
exports.exploreRecipe = async (req, res) => {
    try {
        let recipeId = req.params.id;

        const recipe = await Recipe.findById(recipeId);

        res.render('recipe', {
            title: 'Cooking Blog - Recipe',
            recipe,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "error occured"
        });
    }
}



// post/ search

exports.searchRecipe = async (req, res) => {

    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({
            $text: {
                $search: searchTerm,
                $diacriticSensitive: true
            }
        });
        res.render('search', {
            title: 'Cooking Blog - Search',
            recipe
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "error occured"
        });
    }

    res.render('search', {
        title: 'Cooking Blog - Search'
    });
}


// explore latest page
exports.exploreLatest = async (req, res) => {
    try {
        const limitNumber = 20;

        const recipe = await Recipe.find({}).sort({
            _id: -1
        }).limit(limitNumber);

        res.render('explore-latest', {
            title: 'Cooking Blog - Explore Latest',
            recipe,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "error occured"
        });
    }
}

// explore random page
exports.exploreRandom = async (req, res) => {
    try {
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render('explore-random', {
            title: 'Cooking Blog - Explore Random',
            recipe,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "error occured"
        });
    }
}

// submit-recipe
// submit recipe
exports.submitRecipe = async (req, res) => {

    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');

    res.render('submit-recipe', {
        title: 'Cooking Blog - Submit Recipe',
        infoErrorsObj,
        infoSubmitObj,
    });
}

// POST recipe

exports.submitRecipeOnPost = async (req, res) => {

    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if (req.files || Object.keys(req.files).length === 0) {
            console.log('No files were uploaded');
        } else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + 'public/uploads/' + newImageName;
            
            imageUploadFile.mv(uploadPath, function(err) {
                if (err) return res.status(500).send(err);
            })
        }

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email:req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName,
        });

        await newRecipe.save();

        req.flash('infoSubmit', 'Recipe had been added');
        res.redirect('/submit-recipe');
    } catch (error) {
        req.flash('infoErrors', error);
        res.redirect('/submit-recipe')
    }
}

















// async function insertDummyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Crab Cakes",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "chinese-steak-tofu-stew.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Indian", 
//         "image": "chocolate-banoffe-whoopie-pies.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Indian", 
//         "image": "grilled-lobster-rolls.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Indian", 
//         "image": "key-lime-pie.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDummyRecipeData();



// async function insertDummyCategoryData() {
//     try {
//         await Category.insertMany([{
//                 "name": "Thai",
//                 "image": "thai-food.jpg"
//             },
//             {
//                 "name": "American",
//                 "image": "american-food.jpg"
//             },
//             {
//                 "name": "Chinese",
//                 "image": "chinese-food.jpg"
//             },
//             {
//                 "name": "Mexican",
//                 "image": "mexican-food.jpg"
//             },
//             {
//                 "name": "Indian",
//                 "image": "indian-food.jpg"
//             },
//             {
//                 "name": "Spanish",
//                 "image": "spanish-food.jpg"
//             }
//         ]);
//     } catch (error) {
//         console.log('err', +error)
//     }
// }

// insertDummyCategoryData(); 