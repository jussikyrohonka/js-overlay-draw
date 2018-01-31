/**
 * 
 * Adapted in part from
 * https://stackoverflow.com/a/18387343
 * https://stackoverflow.com/questions/18379818/canvas-image-masking-overlapping/18387343#18387343
 */


$(document).ready(function() {
    const initial72 = 'eeeeee';
    const initial62 = 'eeeeee';
    const initial49 = 'eeeeee';
    const initial48 = 'eeeeee';
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

    updateColor(colorName, color);

    return false; // Prevent default action and stop propagation
});


function updateColor(colorName, newColor) {
    var canvas = document.getElementById('canvas0');
    var ctx = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    
    if (colorName === 'color48') {
	drawNewColor(ctx, canvasWidth, canvasHeight, newColor, 'canvas1');
    } else if (colorName === 'color49') {
	drawNewColor(ctx, canvasWidth, canvasHeight, newColor, 'canvas2');
    } else if (colorName === 'color62') {
	drawNewColor(ctx, canvasWidth, canvasHeight, newColor, 'canvas3');
    } else if (colorName === 'color72') {
	drawNewColor(ctx, canvasWidth, canvasHeight, newColor, 'canvas4');
    }
    
    updateVisibleCanvas(canvas);
}

function updateVisibleCanvas(sourceCanvasElement) {
    var visibleCanvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    
    ctx.drawImage(sourceCanvasElement, 0, 0, canvasWidth, canvasHeight);
}

function jscolorchange(picker) {
    // Hide the picker when finished
    //console.log(picker);
    picker.jscolor.hide();
}

function jscolorFineChange(picker, colorName) {
    // Update the selector background
    setDivColor(picker);
    
    // Update the individual color on the fly
    const newColor = '#' + picker.toString();
    updateColor(colorName, newColor);
}

function setDivColor(picker) {
    //console.log('Got change: ' + '#' + picker.toString()
    //	    + ' id: ' + picker.valueElement.id);
    const inputId = picker.valueElement.id;
    const p = $('p[for="' + inputId + '"]');
    p.css('background-color', '#' + picker.toString());
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
    var canvas0 = document.getElementById('canvas0');
    var canvas1 = document.getElementById('canvas1');
    var canvas2 = document.getElementById('canvas2');
    var canvas3 = document.getElementById('canvas3');
    var canvas4 = document.getElementById('canvas4');
    
    initialisePatternCanvas(imageArray[0], canvas0);
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
    
    const color48 = '#' + $('#color48')[0].jscolor.toString();
    const color49 = '#' + $('#color49')[0].jscolor.toString();
    const color62 = '#' + $('#color62')[0].jscolor.toString();
    const color72 = '#' + $('#color72')[0].jscolor.toString();
    //console.log(color48, color49, color62, color72);

    drawNewColor(ctx, canvasWidth, canvasHeight, color48, 'canvas1');
    drawNewColor(ctx, canvasWidth, canvasHeight, color49, 'canvas2');
    drawNewColor(ctx, canvasWidth, canvasHeight, color62, 'canvas3');
    drawNewColor(ctx, canvasWidth, canvasHeight, color72, 'canvas4');
}

/**
 * Draw an individual new color
 */
function drawNewColor(ctx, targetWidth, targetHeight, newColor, canvasId) {
    var canvas = document.getElementById(canvasId);
    paintOverlay(canvas, newColor);
    
    // Update the composite image
    ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
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


function fullsizeClick() {
    var jqueryElement = $('#fullsize');
    if (!jqueryElement.is(":visible")) {
	var canvas = document.getElementById('canvas0');
	var dataUrl = canvas.toDataURL();
	var image = new Image();
	image.src = dataUrl;
	var dummyHtml = image.outerHTML;
	jqueryElement.html(dummyHtml);
	jqueryElement.show();
	$('#fullsizeButton').text('Hide full size');
    } else {
	jqueryElement.hide();
	$('#fullsizeButton').text('Show full size');
    }
}
