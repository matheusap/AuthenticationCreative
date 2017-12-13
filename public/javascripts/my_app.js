
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

analyser.fftSize = 4096;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);
//console.log(dataArray);


function draw() {

 
  analyser.getByteTimeDomainData(dataArray);
 
  var num_of_slices = 30 * 31,
  STEP = Math.floor(dataArray.length /num_of_slices),
  No_Signal = 128;
  
 drawVisual = requestAnimationFrame(draw);
  for (var i = 0, n = 0; i < num_of_slices; i++, n+=STEP) {

	//var slice = boxes[i];

    var val = Math.abs(dataArray[n]) / No_Signal;
	var balance =  Math.abs(dataArray[n]) - No_Signal;
	//console.log(balance);
	
   hex_color = '';
   var a = i % 31;
   var mod = (a/32);//does not go over 1
   var N = n;
   var b = 8+val;//val does not go over 2 (as far as i know)
   var c = i / 58.125;//does not go over 16
   
	hex_color += Math.floor(Math.pow((val-.5),4)+1).toString(16);
	hex_color += Math.floor(Math.pow((val-.5),4)+1).toString(16);
	hex_color += Math.floor(Math.abs(balance)/2).toString(16);
	hex_color += Math.floor(Math.abs(balance)/2).toString(16);
	hex_color += Math.floor((Math.pow((balance),2)/26)+1).toString(16);
	hex_color += Math.floor((Math.pow((balance),2)/26)+1).toString(16);

    //console.log(hex_color);
	boxes[i].style.backgroundColor = '#' + hex_color;
  }
};

draw();

alert('WARNING!  Do not use if you are epileptic or prone to seizures.');
