(
  function() {
    function PhotoViewController($scope, $routeParams, albumService) {
      $scope.albumName = $routeParams.albumName;
      $scope.photoName = $routeParams.photoName;
      $scope.photoLoadError = "";
      var validPhotoURL = false;

      albumService.getPhotosForAlbum($scope.albumName, (err, results) => {
        if (err) {
          $scope.photoLoadError = err.message;
          return;
        }
        // console.log(JSON.stringify(data));
        var photos = results.data.photos;
        for (index in photos) {
          if (photos[index].filename.toLowerCase() === $scope.photoName.toLowerCase()) {
            validPhotoURL = true;
            break;
          }
        }
        $scope.photoLoadError = validPhotoURL === true ? "" : $scope.photoName + " photo not found !!";
      });

      //   try {
      //     var validPhotoURL = false;
      //     var photos = albumService.getAlbumByName($scope.albumName).photos;
      //     for (i in photos) {
      //       if (photos[i].filename === $scope.photoName) {
      //         validPhotoURL = true;
      //         break;
      //       }
      //     }
      //     $scope.photoLoadError = validPhotoURL === true ? "" : $scope.photoName + " photo not found !!";
      //   } catch (e) {
      //     $scope.photoLoadError = $scope.albumName + " is an invalid album !!";
      //     // $scope.albumName = "";
      //   }
    }

    app.controller("PhotoViewController", PhotoViewController);
  }
)();
