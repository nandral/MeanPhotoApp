var app = angular.module("app", ["ngRoute", "ngFileUpload", "angularFileUpload", "ui.bootstrap"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/albums", {
      controller: "AlbumListController",
      templateUrl: "app/partials/album_list_partial.html"
    })
    .when("/album/:albumName", {
      controller: "AlbumViewController",
      templateUrl: "app/partials/album_view_partial.html"
    })
    .when("/album/:albumName/upload", {
      controller: "AlbumUploadController",
      templateUrl: "app/partials/album_upload_partial.html"
    })
    .when("/recipes", {
      controller: "RecipeListController",
      templateUrl: "/app/partials/recipe_list.html"
    })
    .when("/recipes/:recipe_id", {
      controller: "ViewRecipeController",
      templateUrl: "/app/partials/view_recipe.html"
    })
    .when("/", {
      redirectTo: "/albums"
    })
    .when('/album/:albumName/:photoName', {
      controller: "PhotoViewController",
      templateUrl: "app/partials/photo_view_partial.html"
    })
    .when("/404_page", {
      controller: "Controller404",
      templateUrl: "app/partials/404_page_partial.html"
    })
    .otherwise({
      redirectTo: "/404_page"
    });
});

app.filter("pluralise", function () {
  return function (ct, rules) {
    // console.log(rules);
    var out = "" + ct + " ";
    if (!rules.sing || !rules.plur) return ct;
    if (ct == 1)
      out += rules.sing;
    else
      out += rules.plur;
    return out;
  }
});

app.directive("paAlbum", function () {
  return {
    restrict: "AE",
    scope: {
      albumdata: "="
    },
    templateUrl: "/app/partials/pa-album-directive.html",
    link: function ($scope, element, attrs) {
      //do nothing
    }
  };
});
