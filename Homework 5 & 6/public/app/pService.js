var PRACTICE_SERVICE = (function () {
  var _db;
  var _currentPageID;

  var _getAllData = function (callback) {
    _db
      .collection("Pages")
      .get()
      .then(function (querySnapshot) {
        callback(querySnapshot);
      });
  };

  var _updateData = function (id, newContent, callback) {
    var newObj = { navName: newContent };

    _db
      .collection("Pages")
      .doc(id)
      .update(newObj)
      .then(function () {
        _getAllData(callback);
      });
  };

  var _deleteData = function (id, callback) {
    _db
      .collection("Pages")
      .doc(id)
      .delete()
      .then(function () {
        mode = "update";
        _getAllData(callback);
      });
  };

  var _addData = function (navName, callback) {
    //starting loading screen
    let pageFakeData = {
      navName: navName,
      content: "<h1>HELLO</h1>",
      subNavs: [],
    };

    _db
      .collection("Pages")
      .add(pageFakeData)
      .then(function (docRef) {
        //remove loading screen
        console.log("Document written with ID: ", docRef.id);
        callback("New Navigation Added");
      })
      .catch(function (error) {
        //remove loading screen
        //add alert for error
        console.log("Error adding document: ", error);
      });
  };

  var _checkPages = function (mainNavName, callback) {
    var pages = _db.collection("Pages");
    pages
      .where("navName", "==", mainNavName)
      .get()
      .then(function (querySnapshot) {
        if (querySnapshot.empty) {
          console.log("new data");
          _addData(mainNavName, callback);
        } else {
          console.log("dup data");
          callback("Duplicate");
        }
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  };

  var _initFirebase = function (callback) {
    //call spinning wheel for loading
    firebase
      .auth()
      .signInAnonymously()
      .then(function (result) {
        console.log("connected");
        _db = firebase.firestore();
        //remove loader
        callback();
      });
  };

  return {
    initFirebase: _initFirebase,
    checkPages: _checkPages,
    getAllData: _getAllData,
    updateData: _updateData,
    deleteData: _deleteData,
  };
})();
