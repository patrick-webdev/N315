function initNav() {
  $(".navLink").click(function(e) {
    let cp = PROVIDER.getCurrentPageName();
    var btnID = e.currentTarget.id;
    console.log(btnID);
    if (cp != btnID) {
      loadContent(btnID);
    }
  });

  //Controls the CSS of the navbar per page.
  let cp = PROVIDER.getCurrentPageName();
  if (cp != "home") {
    $("nav").css("display", "flex");
  }

  if (cp == "php") {
    $("nav").css("background-color", "#ffd5e5");
    $("nav").css("border-color", "#ffb3d0");
  } else if (cp == "js") {
    $("nav").css("background-color", "#ffffdd");
    $("nav").css("border-color", "#ffff93");
  } else if (cp == "mediaapp") {
    $("nav").css("background-color", "#a0ffe6");
    $("nav").css("border-color", "#80ff9d");
  } else {
    $("nav").css("background-color", "#81f5ff");
    $("nav").css("border-color", "#4df0df");
  }
}

function loadContent(pageName) {
  var pageContent = PROVIDER.getPageContent(pageName);
  if (pageName != "home") {
    $("#content").html(pageContent);
  }
  initNav();
}

function populateNav() {
  var nav = PROVIDER.getMainNav();
  let homeColor = "";
  $.each(nav, function(idx, link) {
    let cp = PROVIDER.getCurrentPageName();

    //Makes links to internal and external pages
    if (link.linkName == "Patrick Caldwell") {
      $("nav").append(
        `<a class="nav--link navLink" href="${link.path}">${link.linkName}</a>`
      );
    } else {
      $("nav").append(
        `<div class="nav--link navLink" id="${link.path}">${link.linkName}</div>`
      );
    }

    $("nav").css("display", "none");

    //Determines the page colors on the home page
    if (idx == 0) {
      homeColor = "pink";
    } else if (idx == 1) {
      homeColor = "yellow";
    } else if (idx == 2) {
      homeColor = "green";
    } else {
      homeColor = "blue";
    }

    $("#content").append(`
      <div class="homeLink homeLink--${homeColor} navLink" id="${link.path}">
        <span class="homeLink__text homeLink--desktop">${link.linkName}</span>
        <span class="homeLink__text homeLink--mobile">${link.mobileName}</span>
      </div>
      `);
  });

  loadContent("home");
}

function dataIsLoaded() {
  populateNav();
}

$(document).ready(function() {
  PROVIDER.getData(dataIsLoaded);
});
