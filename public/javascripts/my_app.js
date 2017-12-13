angular.module('myApp', []).
  controller('myController', ['$scope', '$http',
                              function($scope, $http) {
    $http.get('/user/profile')
        .success(function(data, status, headers, config) {
      $scope.user = data;
      $scope.error = "";
    }).
    error(function(data, status, headers, config) {
      $scope.user = {};
      $scope.error = data;
    });
    var boxes = [];

for(i = 0; i < 930; i++) {
  hex_color = '';
  for(j = 0; j < 6; j++) {hex_color += Math.floor(Math.random()*16).toString(16);}
  // console.log(hex_color);
  var box = document.createElement('div');
  box.className = "box";
  box.style.backgroundColor = '#' + hex_color;
  document.getElementById('boxes').appendChild(box);
  boxes.push(box);
}

$.getJSON('/getMusic', function(json) {
  var options = '<option value=""></option>';
  $.each(json, function(i, item) {
    options += '<option value="' + item + '">' + item + '</option>';
  });
  $('#songs').html(options);
})
.done(function() { console.log('getMusic getJSON request succeeded!'); })
.fail(function(jqXHR, textStatus, errorThrown) {
  console.log('getMusic getJSON request failed! ' + textStatus);
  console.log('incoming ' + jqXHR.responseText);
})
.always(function() { console.log('getMusic getJSON request ended!');
});

$('#songs').on('change', function() {
  var $selected = $('#songs').find(':selected').text();
  $('#audio').attr('src', './music/' + $selected);
});

var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var audio = document.getElementById('audio');
var audioSrc = audioCtx.createMediaElementSource(audio);
audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination);

analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

// Get a canvas defined with ID "oscilloscope"
// var canvas = document.getElementById("oscilloscope");
// var canvasCtx = canvas.getContext("2d");
var cycle = 0;

// draw an oscilloscope of the current audio source

function draw() {

  drawVisual = requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  // canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  // canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  // canvasCtx.lineWidth = 2;
  // canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

  // canvasCtx.beginPath();

  var sliceWidth = 300 * 1.0 / bufferLength;
  // var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    // var y = v * canvas.height / 2;

    // if (i === 0) {
      // canvasCtx.moveTo(x, y);
    // } else {
      // canvasCtx.lineTo(x, y);
    // }

    x += sliceWidth;

    var z = Math.abs(v * 150 / 2);
    if (i % (10000 * analyser.frequencyBinCount) == 0 && !audio.paused) {
      cycle = (cycle + z * 501) % 360;
      for (var j = 0; j < boxes.length; ++j) {
        var color = "hsl(" + (cycle + (j * 11) % 360) + ", " + (100) + "%, " + (50) + "%)";
        boxes[j].style.backgroundColor = color;
        // boxes[j].css("background-color", color);
      }
    }
  }
};

draw();

alert('WARNING!  Do not use if you are epileptic or prone to seizures.');
  }]);
