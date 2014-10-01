function AudioUtil() {
}

AudioUtil.load = function(context, url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    context.decodeAudioData(request.response, function(buffer) {
      if (!buffer) {
        alert('Error decoding file data: ' + url);
        return;
      }
      callback(buffer);
    });
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
};

AudioUtil.parseVectorToArray = function(vectorString) {
  var vector = vectorString.split(',').map(Number);
  // Ensure that the vector is exactly 3 long.
  vector.length = 3;
  // Replace undefineds with zeros.
  for (var i = 0; i < vector.length; i++) {
    if (vector[i] === undefined) {
      vector[i] = 0;
    }
  }
  return vector;
};

var VECTOR_KEYS = ['x', 'y', 'z'];
AudioUtil.parseVector = function(vectorString) {
  var values = vectorString.split(',').map(Number);
  var out = {};
  for (var i = 0; i < 3; i++) {
    var key = VECTOR_KEYS[i];
    out[key] = values[i] || 0;
  }
  return out;
};
