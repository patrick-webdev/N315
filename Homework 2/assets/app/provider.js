var PROVIDER = (function() {
  var _allData = {};
  var _currentPage = "home";

  var _getData = function(callback) {
    $.getJSON("../assets/data/data.json", function(data) {
      //Runs anonymous function once data has been recieved.
    })
      .fail(function(error) {})
      .done(function(data) {
        _allData = data;
        callback(_allData.mainNav);
      });
  };

  var _getMainNav = function() {
    return _allData.mainNav;
  };

  var _getPageContent = function(nameOfPage) {
    let content = "";
    $.each(_allData.pages, function(idx, page) {
      if (page.pageName == nameOfPage) {
        content = page.content;
        _currentPage = page.pageName;
        console.log(_currentPage);
      }
    });
    return content;
  };

  var _getCurrentPageName = function() {
    return _currentPage;
  };

  return {
    getData: _getData,
    getMainNav: _getMainNav,
    getPageContent: _getPageContent,
    getCurrentPageName: _getCurrentPageName
  };
})();
