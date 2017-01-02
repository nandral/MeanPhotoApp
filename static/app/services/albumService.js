(
  function () {
    function albumService($http, $fileUploader) {
      var album_cache = {};

      this.getUploader = function (albumName, scope) {
        // create a uploader with options
        return $fileUploader.create({
          scope: scope,
          method: "PUT",
          url: "/v1/albums/" + albumName + "/photos.json"
        });
      };


      this.getAlbums = function (callback) {
        $http.get("/v1/albums.json")
          .success(
            function (data, status, headers, conf) {
              callback(null, data);
            }
          ).error(
            function (data, status, headers, conf) {
              callback(data, null);
            }
          );
      };
      this.albumChanged = function (name) {
        if (album_cache[name]) delete album_cache[name];
      };
      this.getAlbum = function (name, callback) {
        if (album_cache[name]) return callback(null, album_cache[name]);

        $http.get("/v1/albums/" + name + ".json")
          .success(function (data, status, headers, conf) {
            album_cache[name] = data;
            callback(null, data);
          })
          .error(function (data, status, headers, conf) {
            callback(data);
          });
      };

      //GetPhotosForAlbum
      this.getPhotosForAlbum = function (name, callback) {
        $http.get("/v1/albums/" + name + "/photos.json")
          .success(function (data, status, headers, conf) {
            callback(null, data);
          })
          .error(function (data, status, headers, conf) {
            callback(data, null);
          });
      };

      //AddAlbum with callback
      this.addAlbum = function (newAlbum, callback) {
        //Validation
        if (!newAlbum.name)
          return callback({
            code: "MISSING_NAME"
          }, null);

        if (!newAlbum.date)
          return callback({
            code: "MISSING_DATE"
          }, null);

        if (!isValidDate(newAlbum.date))
          return callback({
            code: "BAD_DATE"
          }, null);

        if (!newAlbum.description)
          return callback({
            code: "MISSING_DESC"
          }, null);

        if (!newAlbum.title)
          return callback({
            code: "MISSING_TITLE"
          }, null);

        $http.put("/v1/albums.json", newAlbum)
          .success(
            function (data, status, headers, conf) {
              callback(null, data);
            }
          ).error(
            function (data, status, headers, conf) {
              callback(data, null);
            }
          );
      }
    }

    function isValidDate(date) {
      if (isNaN((new Date(date)).getTime())) {
        return false;
      } else {
        return true;
      }
    }

    app.service("albumService", albumService);

  }
)();
