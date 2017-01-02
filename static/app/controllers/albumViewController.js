(
  function() {


    function AlbumViewController($scope, $routeParams, albumService) {
      $scope.albumName = $routeParams.albumName;
      $scope.albumLoadError = "";

      albumService.getPhotosForAlbum($scope.albumName, function(err, results) {
        if (err) {
          if (err.code = "not_found")
            $scope.albumLoadError = "album not found";
          else
            $scope.albumLoadError = "Unexpected error: " + err.code;
        } else {
          $scope.photos = results.data.photos;
          //   console.log(JSON.stringify($scope.photos));
        }
      });

    }

    app.controller("AlbumViewController", AlbumViewController);


  }
)();
