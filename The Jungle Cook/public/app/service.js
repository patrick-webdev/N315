var JUNGLECOOK_SERVICE = (function () {
  //Define Firebase features
  document.addEventListener("DOMContentLoaded", function () {
    try {
      let app = firebase.app();
      let features = ["auth", "database", "messaging", "storage"].filter(
        (feature) => typeof app[feature] === "function"
      ); //
    } catch (e) {
      console.error(e);
    }
  });

  //Connect to database
  var _db;

  var _initFirebase = function () {
    firebase
      .auth()
      .signInAnonymously()
      .then(function (result) {
        consolelog("connected");
        _db = firebase.firestore();
      });
  };

  //Retrieves all recipes in database
  var _getAllRecipes = function (callback) {
    _db
      .collection("recipes")
      .get()
      .then(function (querySnapshot) {
        callback(querySnapshot);
      });
  };

  //Retrieves specific recipe based on id
  var _getRecipeDetails = function (id, callback) {
    _db
      .collection("recipes")
      .doc(id)
      .get()
      .then(function (querySnapshot) {
        callback(querySnapshot);
      });
  };

  //Creates a new recipe in the database
  var _addRecipe = function (
    title,
    description,
    time,
    size,
    ingredients,
    instructions,
    callback
  ) {
    let newRecipe = {
      title: title,
      description: description,
      time: time,
      size: size,
      ingredients: ingredients,
      instructions: instructions,
    };

    _db
      .collection("recipes")
      .add(newRecipe)
      .then(function (docRef) {
        consolelog("Document written with ID: " + docRef.id);
        callback("Your new recipe has been added!");
      })
      .catch(function (error) {
        consolelog("Error adding document: " + error);
      });
  };

  //Edits an existing recipe in the database based on id
  var _editRecipe = function (
    id,
    title,
    description,
    time,
    size,
    ingredients,
    instructions,
    callback
  ) {
    let newRecipe = {
      title: title,
      description: description,
      time: time,
      size: size,
      ingredients: ingredients,
      instructions: instructions,
    };

    _db
      .collection("recipes")
      .doc(id)
      .update(newRecipe)
      .then(function () {
        callback();
      });
  };

  //Deletes recipe in the database based on id
  var _deleteRecipe = function (id, callback) {
    _db
      .collection("recipes")
      .doc(id)
      .delete()
      .then(function () {
        callback();
      });
  };

  return {
    initFirebase: _initFirebase,
    getAllRecipes: _getAllRecipes,
    getRecipeDetails: _getRecipeDetails,
    addRecipe: _addRecipe,
    editRecipe: _editRecipe,
    deleteRecipe: _deleteRecipe,
  };
})();
