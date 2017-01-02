(
  function () {
    function AlbumListController($scope, $location, albumService, $modal) {
      $scope.newAlbum = {};
      $scope.addAlbumError = "";
      $scope.pageLoadError = "";
      $scope.pageLoaded = false;
      //   $scope.albums = albumService.getAlbums();

      //   getAlbums
      albumService.getAlbums(function (err, results) {
        if (err) {
          $scope.pageLoadError = "Unexpected  error while loading albums : " + err.message;
        } else {
          //   console.log("==========================\n");
          //console.log(JSON.stringify(results));
          $scope.pageLoaded = true;
          $scope.albums = results.data.albums;

        }
      });

      $scope.openAddAlbumDialog = function () {
        var addAlbumDialog = $modal.open({
          size: "sm",
          templateUrl: 'myModalContent.html',
          controller: AddAlbumDialogController,
          resolve: {}
        });

        addAlbumDialog.result.then(function (album_name) {
          $location.path("/album/" + album_name)
        }, function () {
          console.info('Modal dismissed at: ' + new Date());
        });
      };

      //ADD album with callback
      $scope.addAlbum = function (newAlbum) {
        albumService.addAlbum(newAlbum, function (err, data) {
          if (err) {
            if (err.code == "MISSING_NAME") $scope.addAlbumError = "Name is missing";
            else if (err.code == "MISSING_DATE") $scope.addAlbumError = "Date is missing";
            else if (err.code == "BAD_DATE") $scope.addAlbumError = "That doesn't look like a valid date !!";
            else if (err.code == "MISSING_DESC") $scope.addAlbumError = "Description is missing";
            else if (err.code == "MISSING_TITLE") $scope.addAlbumError = "Title is missing";
            else if (err.code == "DUPLICATE_ALBUM_NAME") $scope.addAlbumError = "Album with that name already exists !!";
            else $scope.addAlbumError = "Unexpected error: " + err.code + " " + err.message;
          } else {
            $location.path("/album/" + newAlbum.name);
          }
        });
      }

    }



    app.controller('AlbumListController', AlbumListController);

    function AddAlbumDialogController($scope, $location, $modalInstance, albumService) {
      $scope.add_album_error = "";
      $scope.adding_album = {};

      $scope.addAlbum = function (new_album) {
        albumService.addAlbum(new_album, function (err, album) {
          if (err) {
            if (err.code == "missing_title")
              $scope.add_album_error = "You need to give a title";
            else if (err.code == "missing_description")
              $scope.add_album_error = "You need to give a description";
            else if (err.code == "missing_date")
              $scope.add_album_error = "You need to give a date";
            else if (err.code == "missing_name")
              $scope.add_album_error = "You need to give a name";
            else if (err.code == "bad_date")
              $scope.add_album_error = "That doesn't look like a good date.";
            else if (err.code == "duplicate_album_name")
              $scope.add_album_error = "An album of that name already exists!";
            else
              $scope.add_album_error = "A completely unexpected error occurred: " + err.code + " " + err.message;
          } else {
            $modalInstance.close($scope.adding_album.name);
          }
        });
      };



      $scope.ok = function () {
        $scope.addAlbum($scope.adding_album);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

    app.controller("AddAlbumDialogController", AddAlbumDialogController);
  }
)();
