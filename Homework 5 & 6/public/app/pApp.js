var mode;
function addNavListener() {
  mode = "update";
  $("#deleteData").click(function (e) {
    mode = "delete";
    console.log(mode);
  });
  console.log(mode);

  $("nav a").click(function (e) {
    var id = e.currentTarget.id;
    var newNavName = $("#updateContent").val();

    if (mode == "update" && newNavName != "") {
      PRACTICE_SERVICE.updateData(id, newNavName, displayData);
    } else if (mode == "delete") {
      PRACTICE_SERVICE.deleteData(id, displayData);
    }
  });
}

function displayData(allData) {
  var container = "<nav>";
  allData.forEach(function (doc) {
    var id = doc.id;
    var rawData = doc.data();
    container += `<a href="#" id="${id}">${rawData.navName}</a>`;
  });

  container += "</nav>";
  $(".showData").html(container);
  addNavListener();
}

function init() {
  $(".getData").click(function (e) {
    PRACTICE_SERVICE.getAllData(displayData);
  });

  $("#addData").click(function (e) {
    e.preventDefault();
    let nName = $("#nav-input").val().trim().toLowerCase();

    if (nName != "") {
      PRACTICE_SERVICE.checkPages(nName, alertUser);
      $("#nav-input").val("");
    } else {
      alert("add name");
    }
  });
}

function alertUser(result) {
  alert(result);
}

$(document).ready(function () {
  PRACTICE_SERVICE.initFirebase(init);
});
