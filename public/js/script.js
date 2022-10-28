let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let ingredientsList = document.querySelector('.ingredientsList');

let ingredientDiv = document.querySelectorAll('.ingredientDiv')[0];

addIngredientsBtn.addEventListener('click', function() {
    let newIngredients = ingredientDiv.cloneNode(true);
    let input = newIngredients.getElementsByTagName('input')[0];
    input.value = '';
    ingredientsList.appendChild(newIngredients);
});