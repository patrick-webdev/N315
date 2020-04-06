function addMainNav(navName) {
  console.log("add ", navName);

  let pageFakeData = {
    name: navName,
    content: "<h1>lorem</h1>",
    subNavs: [],
  };

  TREEFROG_SERVICE.saveData(pageFakeData);
}

function createMainNav() {
  $(".createMainNavBtn").click(function () {
    let usrInput = $("#newNavInput").val().toLowerCase().trim();

    TREEFROG_SERVICE.checkMainNavName(usrInput, addMainNav);

    // if (!usrInput) {
    //   return;
    // }

    // //let navs = [{ name: "home" }, { name: "about" }];
    // let isUnique = true;

    // $.each(navs, function(idx, val) {
    //   if (val.name == usrInput) {
    //     console.log("repeat name");
    //     isUnique = false;
    //     return false;
    //   }
    // });

    // if (isUnique) {
    //   console.log("new name");
    //   navs.push({ name: usrInput });
    //   $("#newNavInput").val("");
    //   closeModal();

    //   // $(".text-wrapper").html(TREEFROG_SERVICE.getAddMainNav(usrInput));
    //   // $(".btn-holder").html("");

    //   // setupQuill();
    // }
  });
}

function setupQuill() {
  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block", "image", "link"],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ["clean"], // remove formatting button
  ];
  var quill = new Quill("#editor", {
    modules: { toolbar: toolbarOptions },
    theme: "snow",
  });

  $("#savePage").click(function (e) {
    e.preventDefault(); //
    var pageNav = $("#pageTitle").val();
    var justHtml = quill.root.innerHTML;
    $("#ql-preview").html(justHtml);
  });
}

function initButtons() {
  $("#home").click(function () {
    $("#addNav div").removeClass("active");
    $("#home div").addClass("active");

    $("#createMainNav").off();

    $(".text-wrapper").html(TREEFROG_SERVICE.getHomeContent());
    $(".btn-holder").html(TREEFROG_SERVICE.getHomeStartButton());
    addGetStartedListener();
  });

  $(".closeModal").click(function () {
    closeModal();
  });
}

function addCreateMNListener() {
  $("#createMainNav").click(function (e) {
    $(".modal").css("display", "flex");
  });
}

function closeModal() {
  $(".modal").css("display", "none");
}

function addGetStartedListener() {
  $(".get-started").click(function (e) {
    //console.log("hello");
    $("#home div").removeClass("active");
    $("#addNav div").addClass("active");

    $(".text-wrapper").html(TREEFROG_SERVICE.getGetStartedContent());
    $(".btn-holder").html(TREEFROG_SERVICE.getCreateNavButtons());
    addCreateMNListener();
    $(".get-started").off("click");

    createMainNav();
  });
}

$(document).ready(function () {
  TREEFROG_SERVICE.initFirebase();
  initButtons();
  addGetStartedListener();
});
