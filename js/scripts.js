// Empty JS for your own code to be here

// create initial theremin frequency and volumn values
var maxFreq = 1000;
var minFreq = 20;
var depthofFreq = maxFreq - minFreq;
var maxVol = 0.1;

var initialFreq = 432;
var initialVol = 0.001;

// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//////////////////////////////////////////////////////////
// create audio source 1
//////////////////////////////////////////////////////////
// create Oscillator and gain node
var osc_a = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();

var osc_b = audioCtx.createOscillator();
var gainNode2 = audioCtx.createGain();

var osc_c = audioCtx.createOscillator();
var gainNode3 = audioCtx.createGain();

// connect oscillator to gain node to speakers
osc_a.connect(gainNode);
osc_b.connect(gainNode);
osc_c.connect(gainNode);
gainNode.connect(audioCtx.destination);

// set options for the oscillator
osc_a.type = 'sine';
osc_a.frequency.value = initialFreq; // value in hertz
osc_a.detune.value = 100; // value in cents

osc_b.type = 'sine';
osc_b.frequency.value = initialFreq; // value in hertz
osc_b.detune.value = 100; // value in cents

osc_c.type = 'sine';
osc_c.frequency.value = initialFreq; // value in hertz
osc_c.detune.value = 100; // value in cents

gainNode.disconnect(audioCtx.destination);
osc_a.start(0);
osc_b.start(0);
osc_c.start(0);

var playing = false;

var playImageSound = function() {
	gainNode.connect(audioCtx.destination);
	playing = true;
};

var stopImageSound = function() {
	if ( playing === true) {
		gainNode.disconnect(audioCtx.destination);
		playing = false;
	}
};

var main = function() {
	var imageLoaded = false;
	$('#ImageDisplay').on('dragstart', function(event) { event.preventDefault(); });

	$('#ImageDisplay').load(function(){
		if(!this.canvas) {
			this.canvas = $('<canvas />')[0];
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
		}
		imageLoaded = true;
	});
	
    $('#ImageDisplay').mousemove(function(e) {
		if (imageLoaded === true) {
			var pixelData = this.canvas.getContext('2d').getImageData(event.offsetX, event.offsetY, 3, 1).data;
			var pixelColorRgba = { r:pixelData[0], g:pixelData[1], b:pixelData[2], a:pixelData[3]};
			var pixelColorHsl = tinycolor(pixelColorRgba).toHsl();

			osc_a.frequency.value = (pixelColorRgba.r/255) * depthofFreq + minFreq;
			osc_b.frequency.value = (pixelColorRgba.g/255) * depthofFreq + minFreq;
			osc_c.frequency.value = (pixelColorRgba.b/255) * depthofFreq + minFreq;
			gainNode.gain.value = pixelColorHsl.l * maxVol;

			var pixelColor = "rgba("+pixelData[0]+", "+pixelData[1]+", "+pixelData[2]+", "+pixelData[3]+")";
			$('#outputColor').css("background-color", pixelColor);
			$('#outputRGB').html('R: ' + pixelColorRgba.r + '<br>G: ' + pixelColorRgba.g + '<br>B: ' + pixelColorRgba.b + '<br>A: ' + pixelColorRgba.a);
			$('#outputHLS').html('H: ' + pixelColorHsl.h + '<br>S: ' + pixelColorHsl.s + '<br>L: ' + pixelColorHsl.l);
		}
    });

    $('#ImageDisplay').mouseenter().mousedown(playImageSound);

    $('#ImageDisplay').mouseleave(stopImageSound);
    $('#ImageDisplay').mouseup(stopImageSound);
};

$(document).ready(main);
