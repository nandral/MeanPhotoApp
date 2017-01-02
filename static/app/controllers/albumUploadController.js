(function() {

  function AlbumUploadController($scope, $location, $routeParams, albumService, Upload, $timeout) {
    $scope.albumName = $routeParams.albumName;
    $scope.page_load_error = "";
    $scope.done_uploading = false;

    // ADD FIRST!
    albumService.getPhotosForAlbum($scope.albumName, function(err, photos) {
      if (err) {
        if (err.error == "not_found")
          $scope.page_load_error = "No such album. Are you calling this right?";
        else
          $scope.page_load_error = "Unexpected error loading albums: " + err.message;
      } else {
        $scope.photos = photos;
      }
    });

    ///ng-file-upload
    $scope.uploadPic = function(files) {

      files.upload = Upload.upload({
        url: '/v1/albums/' + $scope.albumName + '/photos.json',
        method: 'PUT',
        data: { albumName: $scope.albumName, files: files },
      });

      files.upload.then(
        function(response) {
          $timeout(function() {
            files.result = response.data;
          });
        },
        function(response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        },
        function(evt) {
          // Math.min is to fix IE which reports 200% sometimes
          files.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }

    /////////
    $scope.uploader = albumService.getUploader($scope.albumName, $scope);
    $scope.uploader.bind("completeall", function(event, items) {
      $scope.done_uploading = true;
    });
    $scope.uploadFiles = function() {
        $scope.uploader.uploadAll();
      }
      // FOR DESCRIPTIONS
    $scope.descriptions = {};
    $scope.uploader.bind('beforeupload', function(event, item) {
      var fn = item.file.name;
      var d = item.file.lastModifiedDate;
      item.formData = [{
        filename: _fix_filename(item.file.name),
        description: $scope.descriptions[item.file.name],
        date: d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate()
      }];
    });
    //////////

  }

  app.controller("AlbumUploadController", AlbumUploadController);


  /**
   * we'll be super fussy and only allow alnum, -, _, and .
   */
  function _fix_filename(fn) {
    if (!fn || fn.length == 0) return "unknown";

    var r = new RegExp("^[a-zA-Z0-9\\-_.]+$");
    var out = "";

    for (var i = 0; i < fn.length; i++) {
      if (r.exec(fn[i]) != null)
        out += fn[i];
    }

    if (!out) out = "unknown_" + (new Date()).getTime();
    return out;
  }



})();
