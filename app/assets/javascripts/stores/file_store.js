var FileStore = (function($) {

  API_PATH_PREFIX = '/api/v1';

  var getResources = function() {
    return $.ajax({
      url:      API_PATH_PREFIX + '/videos',
      type:     'GET',
      dataType: 'json'
    });
  };

  // 1. Generate signed upload URL
  // 2. Upload to s3
  // 3. Post uploaded file properties to API
  var createResource = function(file, ctx,callbacks) {
    return getSignedUploadUrl(file)
    .then(function(data) {
      return uploadFile(file, data.upload.url, data.upload.content_type, callbacks, ctx);
    })
    .then(function(downloadUrl) {
      return saveResource(file, downloadUrl, callbacks);
    });
  };

  // private

  var getSignedUploadUrl = function(file) {
    return $.ajax({
      url:      API_PATH_PREFIX + '/uploads',
      type:     'POST',
      dataType: 'json',
      data: {
        upload: { filename: file.name }
      }
    });
  };

  var uploadFile = function(file, uploadUrl, contentType, callbacks, ctx) {
    var deferred = $.Deferred();

    var xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', contentType);

    xhr.onload = function() {
      if (xhr.status === 200) {
        callbacks.onProgress(file, file.size, ctx);
        deferred.resolve(uploadUrl.split('?')[0]);
      } else {
        deferred.reject(xhr);
      }
    };

    xhr.onerror = function() {
      deferred.reject(xhr);
    };

    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        callbacks.onProgress(file, e.loaded, ctx);
      }
    };

    xhr.send(file);

    return deferred.promise();
  };

  var saveResource = function(file, downloadUrl, callbacks) {
    return $.ajax({
      url:      API_PATH_PREFIX + '/videos',
      type:     'POST',
      dataType: 'json',
      data: {
        video: {
          direct_upload_url:   downloadUrl,
          upload_file_name:    file.name,
          upload_content_type: file.type,
          upload_file_size:    file.size
        }
      }
    });
  };

  return {
    getResources:   getResources,
    createResource: createResource
  };

})(jQuery);
