var currentPage;

$(document).ready(function () {
  JUNGLECOOK_SERVICE.initFirebase();
  initNav();
  initHome();
  currentPage = "home";
});

function initNav() {
  //Click on Home link
  $("#nav__home").click(function () {
    //Removes the active class from all links that might have it
    $("#nav__browse").removeClass("active");
    $("#nav__create").removeClass("active");
    $("#nav__recipes").removeClass("active");
    //Makes the home link have the active class
    $("#nav__home").addClass("active");

    //Create the home page
    initHome();
  });

  //Click on the logo
  $("#nav__logo").click(function () {
    $("#nav__browse").removeClass("active");
    $("#nav__create").removeClass("active");
    $("#nav__recipes").removeClass("active");
    $("#nav__home").addClass("active");

    initHome();
  });

  //Click on Browse link
  $("#nav__browse").click(function () {
    $("#nav__home").removeClass("active");
    $("#nav__create").removeClass("active");
    $("#nav__recipes").removeClass("active");
    $("#nav__browse").addClass("active");

    initBrowse();
  });

  //Click on Create Create Recipe link
  $("#nav__create").click(function () {
    $("#nav__browse").removeClass("active");
    $("#nav__home").removeClass("active");
    $("#nav__recipes").removeClass("active");
    $("#nav__create").addClass("active");

    initCreate();
  });

  //Click on Your Recipes link
  $("#nav__recipes").click(function () {
    $("#nav__browse").removeClass("active");
    $("#nav__create").removeClass("active");
    $("#nav__home").removeClass("active");
    $("#nav__recipes").addClass("active");

    initRecipes();
  });

  //Click on Login link
  $("#nav__login").click(function () {
    $("#nav__browse").removeClass("active");
    $("#nav__create").removeClass("active");
    $("#nav__home").removeClass("active");
    $("#nav__recipes").removeClass("active");

    initLogin();
  });
}

//Create the home page
function initHome() {
  consolelog("home");

  currentPage = "home";
  $("body").removeClass();
  $("body").addClass("page--home");
  $("#content").removeClass();
  $("#content").addClass("home");
  $("#content").html(
    '<div class="home__main circle circle--large circle--yellow"><div class="home__title fnt__caveat">The Jungle Cook</div><div class="home__cnt">The home to various recipes of your choice. Add your own recipe today and fill the world with joy!</div></div><div class="home__sub circle circle--small circle--pink"><div class="home__sub__text">Want to be a Jungle Cook? Go ahead and the kitchen is yours!</div></div>'
  );
}

//Create the browse page
function initBrowse() {
  currentPage = "browse";
  consolelog(currentPage);
  $("body").removeClass();
  $("body").addClass("page--recipes");
  $("#content").removeClass();
  $("#content").addClass("browse");
  $("#content").html(
    '<p class="recipes__trysome fnt__caveat">Recipes: Try some today</p><div class="recipes__list"></div>'
  );

  JUNGLECOOK_SERVICE.getAllRecipes(displayRecipes);
}

//Displays all the recipes on the Browse page and Your Recipes page
function displayRecipes(recipes) {
  recipes.forEach(function (doc) {
    var id = doc.id;
    var rawData = doc.data();

    //Determines if 'serving' needs to be singular or plural
    let serving;
    if (rawData.size == 1) {
      serving = "serving";
    } else {
      serving = "servings";
    }

    let content = "";
    content += `
    <div class="recipe">
      <div class="recipe__cnt">
        <div class="recipe__img" style="background-image: url('images/${rawData.img}')">`;

    //Determines if the view button should be on the page
    if (currentPage == "recipes") {
      content += `<a class="btn btn--yellow" id="view${id}" href="#">View</a>`;
    }

    content += `
        </div>
        <div class="recipe__text">
          <p class="recipe__title">${rawData.title}</p>
          <p>${rawData.description}</p>
          <div class="recipe__wait">
            <i class="far fa-clock"></i>
            <p>${rawData.time}</p>
          </div>
          <div class="recipe__size">
            <i class="fas fa-apple-alt"></i>
            <p>&nbsp;${rawData.size} ${serving}</p>
          </div>
        </div>
      </div>`;

    //Determines if the edit and delete buttons should be on the page
    if (currentPage == "recipes") {
      content += `
        <div class="recipe__btns">
          <a class="btn btn--yellow" id="edit${id}" href="#">Edit Recipe</a>
          <a class="btn btn--yellow" id="delete${id}" href="#">Delete</a>
        </div>`;
    }

    content += `</div>`;

    $(".recipes__list").append(content);

    //Determines if the listeners should be made for the buttons
    if (currentPage == "recipes") {
      //Click on view button
      $(`#view${id}`).click(function () {
        initDetails(doc);
      });

      //Click on edit button
      $(`#edit${id}`).click(function () {
        initEdit(doc);
      });

      //Click on delete button
      $(`#delete${id}`).click(function () {
        initDelete(doc);
      });
    }
  });
}

//Creates the form to create a new recipe
function initCreate() {
  consolelog("create");

  currentPage = "create";
  $("body").removeClass();
  $("body").addClass("page--create");
  $("#content").removeClass();
  $("#content").addClass("create");
  $("#content")
    .html(`<p class="create__title fnt__caveat">Create your recipe!</p>
  <form class="create__form">
    <input type="text" class="create__input" id="title" placeholder="Recipe Name" />
    <input
      type="text"
      class="create__input fnt__lato"
      id="description"
      placeholder="Recipe Description"
    />
    <input
      type="text"
      class="create__input fnt__lato"
      id="time"
      placeholder="Recipe Total Time"
    />
    <input
      type="text"
      class="create__input fnt__lato"
      id="size"
      placeholder="Recipe Serving Size"
    />

    <p>Enter Ingredients</p>
    <input type="text" class="create__input" id="ingredient1" placeholder="Ingredient #1" />
    <input type="text" class="create__input" id="ingredient2" placeholder="Ingredient #2" />
    <input type="text" class="create__input" id="ingredient3" placeholder="Ingredient #3" />

    <p>Enter Instructions</p>
    <input type="text" class="create__input" id="instruction1" placeholder="Instruction #1" />
    <input type="text" class="create__input" id="instruction2" placeholder="Instruction #2" />
    <input type="text" class="create__input" id="instruction3" placeholder="Instruction #3" />

    <button
      class="btn btn--pink create__submit fnt__caveat"
      id="submit">Create Recipe
    </button>
  </form>`);

  $("#submit").click(function () {
    submitRecipe();
  });
}

//Retrieves data from the form and puts it in the database
function submitRecipe() {
  let title = $("#title").val();
  let description = $("#description").val();
  let time = $("#time").val();
  let size = $("#size").val();

  //Retrieves ingredients or instructions from the form and puts them into an array.
  //Ignore any possible empty forms, would work amazingly if I implimented the ability to add more ingredients/instructions.
  let ingredients = [];
  let x = 1;
  while (x > 0) {
    let idName = "ingredient" + x;
    consolelog(idName);
    if ($("#" + idName).length == 0) {
      x = 0;
    } else {
      if ($("#" + idName).val().length > 0) {
        ingredients.push($("#" + idName).val());
      }
      x++;
    }
  }
  ingredients = arrToListItems(ingredients);
  consolelog(ingredients);

  let instructions = [];
  x = 1;
  while (x > 0) {
    let idName = "instruction" + x;
    if ($("#" + idName).length == 0) {
      x = 0;
    } else {
      if ($("#" + idName).val().length > 0) {
        instructions.push($("#" + idName).val());
      }
      x++;
    }
  }
  instructions = arrToListItems(instructions);
  consolelog(instructions);

  JUNGLECOOK_SERVICE.addRecipe(
    title,
    description,
    time,
    size,
    ingredients,
    instructions,
    alert
  );
}

//Converts an array to html list items to be storred in the database.
//Should have just put the array in the database, but hindsight is 20/20.
function arrToListItems(arr) {
  let listItems = "";
  for (let x = 0; x < arr.length; x++) {
    let item = arr[x];
    listItems += `<li>${item}</li>`;
  }
  return listItems;
}

//The Your Recipes page
function initRecipes() {
  currentPage = "recipes";
  consolelog(currentPage);
  $("body").removeClass();
  $("body").addClass("page--recipes");
  $("#content").removeClass();
  $("#content").addClass("recipes");
  $("#content").html(`<div class="recipes">
  <p class="recipes__trysome fnt__caveat">Here are your recipes!</p>
  <div class="recipes__list"></div>`);

  JUNGLECOOK_SERVICE.getAllRecipes(displayRecipes);
}

//Login page
function initLogin() {
  currentPage = "login";
  consolelog(currentPage);
  $("body").removeClass();
  $("body").addClass("page--login");
  $("#content").removeClass();
  $("#content").addClass("login");
  $("#content").html(`<div class="signin">
  <h3>Login Here!</h3>
  <form class="login__form" action="">
    <input class="login__input" type="email" placeholder="Email Address" />
    <input class="login__input" type="password" placeholder="Password" />
    <input type="submit" value="Login" class="btn btn--yellow"/>
  </form>
</div>
<div class="register">
  <p>don't have an account?</p>
  <h3>Sign Up!</h3>
  <form class="login__form" action="">
    <input class="login__input" type="text" placeholder="First Name" />
    <input class="login__input" type="text" placeholder="Last Name" />
    <input class="login__input" type="email" placeholder="Email Address" />
    <input class="login__input" type="password" placeholder="Password" />
    <input type="submit" value="Sign Up" class="btn btn--yellow"/>
  </form class="login__form">
</div>`);
}

//Recipe details page
function initDetails(doc) {
  currentPage = "details";
  consolelog(currentPage);
  $("body").removeClass();
  $("body").addClass("page--details");
  $("#content").removeClass();
  $("#content").addClass("details");

  var id = doc.id;
  var rawData = doc.data();

  //Determines if recipe should be singular or plural
  let serving;
  if (rawData.size == 1) {
    serving = "serving";
  } else {
    serving = "servings";
  }

  currentPage = "details";
  $("body").removeClass();
  $("body").addClass("page--details");
  $("#content").html(
    `<div class="details__cnt">
    <p class="details__title">${rawData.title}</p>
    <div class="details__img"></div>
    <div class="details__desc">
      <h3>Description:</h3>
      <p class="fnt__caveat">
        ${rawData.description}
      </p>
      <h3>Total Time:</h3>
      <p class="fnt__caveat">${rawData.time}</p>
      <h3>Servings:</h3>
      <p class="fnt__caveat">${rawData.size} ${serving}</p>
    </div>
  </div>
  <div class="details__ingredients">
    <h3>Ingredients:</h3>
    <ul class="fnt__caveat">
      ${rawData.ingredients}
    </ul>
  </div>
  <div class="details__instructions">
    <h3>Instructions</h3>
    <ol class="fnt__caveat">
      ${rawData.instructions}
    </ol>
  </div>

  <a class="btn btn--yellow fnt__caveat" id="edit${id}" href="#">Edit Recipe</a>`
  );

  //Click on edit button
  $(`#edit${id}`).click(function () {
    initEdit(doc);
  });
}

//The edit page
function initEdit(doc) {
  consolelog("edit");

  consolelog("home");

  var id = doc.id;
  var rawData = doc.data();

  currentPage = "edit";
  $("body").removeClass();
  $("body").addClass("page--create");
  $("#content").removeClass();
  $("#content").addClass("create");

  let ingredients = listItemsToArr(rawData.ingredients);
  ingredients = arrToInputs(ingredients, "ingredient");
  let instructions = listItemsToArr(rawData.instructions);
  instructions = arrToInputs(instructions, "instruction");

  $("#content").html(`
  <p class="create__title fnt__caveat">Edit your recipe!</p>
    <form class="create__form">
      <input type="text" class="create__input" id="title" value="${rawData.title}" />
      <input
        type="text"
        class="create__input fnt__lato"
        id="description"
        value="${rawData.description}"
      />
      <input
        type="text"
        class="create__input fnt__lato"
        id="time"
        value="${rawData.time}"
      />
      <input
        type="text"
        class="create__input fnt__lato"
        id="size"
        value="${rawData.size}"
      />
  
      <p>Enter Ingredients</p>
      ${ingredients}
  
      <p>Enter Instructions</p>
      ${instructions}
  
      <button
        class="btn btn--pink create__submit fnt__caveat"
        id="submit">Submit Changes
      </button>
    </form>`);

  $("#submit").click(function () {
    updateRecipe(id);
  });
}

//Converts a string of list items into an array.
//This is why storing the array in the database would have been better. Alas, here I am at 6am writing some janky and botched code.
function listItemsToArr(str) {
  let x = 1;
  listArr = [];
  while (x == 1) {
    let firstPos = str.search("<li>");
    let secondPos = str.search("</li>");

    if (firstPos == -1 || secondPos == -1) {
      x = 0;
      break;
    }

    let itemStr = str.substring(firstPos + 4, secondPos);
    //consolelog(itemStr);
    listArr.push(itemStr);
    str = str.substring(secondPos + 5);
    //consolelog(str);
  }
  consolelog(listArr);
  return listArr;
}

//Converts an array into a string of input tags
function arrToInputs(arr, type) {
  let inputStr = "";
  for (let x = 0; x < arr.length; x++) {
    inputStr += `<input type="text" class="create__input" id="${type}${x}" value="${arr[x]}" />`;
  }
  return inputStr;
}

//Sends data from update form to the database
function updateRecipe(id) {
  let title = $("#title").val();
  let description = $("#description").val();
  let time = $("#time").val();
  let size = $("#size").val();

  let ingredients = [];
  let x = 1;
  while (x > 0) {
    let idName = "ingredient" + x;
    consolelog(idName);
    if ($("#" + idName).length == 0) {
      x = 0;
    } else {
      if ($("#" + idName).val().length > 0) {
        ingredients.push($("#" + idName).val());
      }
      x++;
    }
  }
  ingredients = arrToListItems(ingredients);
  consolelog(ingredients);

  let instructions = [];
  x = 1;
  while (x > 0) {
    let idName = "instruction" + x;
    if ($("#" + idName).length == 0) {
      x = 0;
    } else {
      if ($("#" + idName).val().length > 0) {
        instructions.push($("#" + idName).val());
      }
      x++;
    }
  }
  instructions = arrToListItems(instructions);
  consolelog(instructions);

  JUNGLECOOK_SERVICE.editRecipe(
    id,
    title,
    description,
    time,
    size,
    ingredients,
    instructions,
    editRefresh
  );
}

//Sends id of recipe to be deleted to the service to be deleted.
function initDelete(doc) {
  id = doc.id;
  JUNGLECOOK_SERVICE.deleteRecipe(id, deleteRefresh);
}

//Alerts the user after a recipe has been deleted and refreshes the your recipes page.
function deleteRefresh() {
  alert("The recipe has successfully been deleted.");
  initRecipes();
}

//Alerts the user after a recipe has been editted and refreshes the recipes page.
function editRefresh() {
  alert("The recipe has sucessfully been updated.");
  initRecipes();
}
