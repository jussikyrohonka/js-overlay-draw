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

    setDivColor(colorpicker);

    return false; // Prevent default action and stop propagation
});

$('#form').submit(function( event ) {
    console.log("Handler for .submit() called." );
    event.preventDefault();
    updateCanvas();
});



function jscolorchange(picker) {
    // Hide the picker when finished
    //console.log(picker);
    picker.jscolor.hide();
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

function updateCanvas() {
    console.log('updateCanvas()');
    
    var urlArray = [];

    urlArray.push('jurmo-white.png');
    urlArray.push('jurmo-layer-48.png');
    urlArray.push('jurmo-layer-49.png');
    urlArray.push('jurmo-layer-62.png');
    urlArray.push('jurmo-layer-79.png');
    
    var imageArray = [];
    
    loadAllImages(urlArray, imageArray);
}

function loadAllImages(imageUrlArray, imageArray) {
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

//    var imagesAllLoaded = function() {
function imagesAllLoaded(imageCount, url, imageArray) {
    // One more image loaded
    imagesLoaded++;
    console.log('Done loading ' + url);
    if (imagesLoaded == imageCount) {
        // all images are fully loaded an ready to use
        //truck=imgs[0];
        //logo=imgs[1];
        //overlay=imgs[2];
        start(imageArray);
    } else {
	console.log('No yet ready');
    }
};

function paintOverlay(image, canvasElement, color) {
    var ctx = canvasElement.getContext('2d');

    ctx.save(); // Push the current state to a stack
    ctx.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);

    // source-in: existing pixels will be overwritten
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    
    // destination-atop: new drawing will not overwrite existing pixels
    //ctx.globalCompositeOperation = 'destination-atop';
    
    //ctx.drawImage(logo);
    //ctx.drawImage(truck);
    
    ctx.restore();
    //var data = ctx.getImageData(0, 0,
    //			    canvasElement.width,
    //			    canvasElement.height);
    //return data;
}

function start(imageArray) {
    console.log('start()' + imageArray);

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    
    var canvas1 = document.getElementById('canvas1');
    var ctx1 = canvas1.getContext('2d');

    var canvas2 = document.getElementById('canvas2');
    var ctx2 = canvas2.getContext('2d');

    var canvas3 = document.getElementById('canvas3');
    var ctx3 = canvas3.getContext('2d');

    var canvas4 = document.getElementById('canvas4');
    var ctx4 = canvas4.getContext('2d');

    ctx.getImageData(0, 0, canvas.width, canvas.height);

    var imageData1 = paintOverlay(imageArray[1], canvas1, '#000000');
    var imageData2 = paintOverlay(imageArray[2], canvas2, '#FF0000');
    var imageData3 = paintOverlay(imageArray[3], canvas3, '#00FF00');
    var imageData4 = paintOverlay(imageArray[4], canvas4, '#0000FF');
    
    ctx.drawImage(imageArray[0], 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(canvas1, 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(canvas2, 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(canvas3, 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(canvas4, 0, 0, canvasWidth, canvasHeight);
}
