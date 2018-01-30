/**
 * 
 * Adapted in part from
 * https://stackoverflow.com/a/18387343
 * https://stackoverflow.com/questions/18379818/canvas-image-masking-overlapping/18387343#18387343
 */


$(document).ready(function() {
    const initial72 = 'ff9900';
    const initial62 = 'ff9900';
    const initial49 = 'ff9900';
    const initial48 = 'ff9900';
    $('#color72')[0].jscolor.fromString(initial72);
    $('#color62')[0].jscolor.fromString(initial62);
    $('#color49')[0].jscolor.fromString(initial49);
    $('#color48')[0].jscolor.fromString(initial48);
    
    $('p[for="color72"]').css('background-color', '#' + initial72);
    $('p[for="color62"]').css('background-color', '#' + initial62);
    $('p[for="color49"]').css('background-color', '#' + initial49);
    $('p[for="color48"]').css('background-color', '#' + initial48);

    // Initialise the canvas elements
    loadCanvasData();
});

$('.row').click(function() {
    const labelFor = $(this).attr('for');
    //console.log('Clicked "%s"', labelFor);
    $('input[id="' + labelFor + '"]')[0].jscolor.show();
});

$('input[name="allrandom"]').click(function() {
    $('input[name="random72"]').trigger('click');	
    $('input[name="random62"]').trigger('click');	
    $('input[name="random49"]').trigger('click');	
    $('input[name="random48"]').trigger('click');	
});

$('input[name^="random"]').click(function(event) {
    event.preventDefault();
    
    const randomName = $(this).attr('name');
    const colorName = 'color' + randomName.substring(6);
    console.log('Randomise "%s"', colorName);
    var red   = Math.round(Math.random() * 255).toString(16);
    var green = Math.round(Math.random() * 255).toString(16);
    var blue  = Math.round(Math.random() * 255).toString(16);
    red   = red.length < 2 ? '0' + red : red;
    green = green.length < 2 ? '0' + green : green;
    blue  = blue.length < 2 ? '0' + blue : blue;
    console.log('"%s" "%s" "%s"', red, green, blue);

    const color = '#' + red + green + blue;

    // Update the color picker value
    const colorpicker = $('#' + colorName)[0].jscolor;
    colorpicker.fromString(color);
    
    // Update the backgound
    const p = $('p[for="' + colorName + '"]');
    p.css('background-color', color);

    drawNewColors();

    return false; // Prevent default action and stop propagation
});

$('#form').submit(function( event ) {
    //console.log("Handler for .submit() called." );
    event.preventDefault();
    drawNewColors();
});



function jscolorchange(picker) {
    // Hide the picker when finished
    //console.log(picker);
    picker.jscolor.hide();
}

function jscolorFineChange(picker) {
    setDivColor(picker);
    //drawNewColors();
}

function setDivColor(picker) {
    //console.log('Got change: ' + '#' + picker.toString()
    //	    + ' id: ' + picker.valueElement.id);
    const inputId = picker.valueElement.id;
    const p = $('p[for="' + inputId + '"]');
    p.css('background-color', '#' + picker.toString());
    
    const div = $('#area');
    div.css('background-color', '#' + picker.toString());
}


var imagesLoaded = 0;

function loadCanvasData() {
    console.log('loadCanvasData()');
    
    imagesLoaded = 0;
    var urlArray = [];

    urlArray.push('jurmo-white.png');
    urlArray.push('jurmo-layer-48.png');
    urlArray.push('jurmo-layer-49.png');
    urlArray.push('jurmo-layer-62.png');
    urlArray.push('jurmo-layer-79.png');
    
    var imageArray = [];
    
    loadImages(urlArray, imageArray);
}

function loadImages(imageUrlArray, imageArray) {
    var imageCount = imageUrlArray.length;
    for (var ii = 0; ii < imageUrlArray.length; ii++) {
	var imageUrl = imageUrlArray[ii];
        var img = new Image();
        imageArray.push(img);
        img.onload = function() {
	    imagesAllLoaded(imageCount, imageUrl, imageArray);
	};
        img.src = imageUrl;
	console.log('Started loading ' + img.src);
    }
}

function imagesAllLoaded(imageCount, url, imageArray) {
    // One more image loaded
    imagesLoaded++;
    console.log('Done loading ' + url);
    if (imagesLoaded == imageCount) {
        initialiseCanvasElements(imageArray);
    } else {
	console.log('No yet ready');
    }
};

function initialiseCanvasElements(imageArray) {
    console.log('initialiseCanvasElements()' + imageArray);

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    
    // The first image should be the background
    // This will be visible and remain constant
    ctx.drawImage(imageArray[0], 0, 0, canvasWidth, canvasHeight);

    // Prepare the hidden canvas element with the 4
    // different overlay patterns: the different paint areas
    var canvas1 = document.getElementById('canvas1');
    var canvas2 = document.getElementById('canvas2');
    var canvas3 = document.getElementById('canvas3');
    var canvas4 = document.getElementById('canvas4');
    
    initialisePatternCanvas(imageArray[1], canvas1);
    initialisePatternCanvas(imageArray[2], canvas2);
    initialisePatternCanvas(imageArray[3], canvas3);
    initialisePatternCanvas(imageArray[4], canvas4);
}

function initialisePatternCanvas(image, canvasElement) {
    var ctx = canvasElement.getContext('2d');
    ctx.save(); // Push the current state to a stack
    ctx.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);
    ctx.restore();
}

/**
 * Draw new selected colors onto the overlay images
 * and combine the overlays into the result image.
 */
function drawNewColors() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    
    var canvas1 = document.getElementById('canvas1');
    var canvas2 = document.getElementById('canvas2');
    var canvas3 = document.getElementById('canvas3');
    var canvas4 = document.getElementById('canvas4');
    
    const color48 = '#' + $('#color48')[0].jscolor.toString();
    const color49 = '#' + $('#color49')[0].jscolor.toString();
    const color62 = '#' + $('#color62')[0].jscolor.toString();
    const color72 = '#' + $('#color72')[0].jscolor.toString();
    console.log(color48, color49, color62, color72);
    /*
    paintOverlay(canvas1, '#FF9900');
    paintOverlay(canvas2, '#ff9900');
    paintOverlay(canvas3, '#00FF00');
    paintOverlay(canvas4, '#0000FF');
     */

    paintOverlay(canvas1, color48);
    paintOverlay(canvas2, color49);
    paintOverlay(canvas3, color72);
    paintOverlay(canvas4, color62);
    /*
    */
    
    ctx.drawImage(canvas1, 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(canvas2, 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(canvas3, 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(canvas4, 0, 0, canvasWidth, canvasHeight);
}

/**
 * Paint 
 */
function paintOverlay(canvasElement, color) {
    var ctx = canvasElement.getContext('2d');

    ctx.save(); // Push the current state to a stack

    // source-in: existing pixels will be overwritten
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    
    // destination-atop: new drawing will not overwrite existing pixels
    //ctx.globalCompositeOperation = 'destination-atop';
    
    ctx.restore(); // Restore the old context state
}

