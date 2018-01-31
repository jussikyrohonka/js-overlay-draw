'use strict';


const http = require('http');
const util = require('util');
const querystring = require('querystring');
const fs = require('fs');

var HTTP_PORT = 8080;

run();

function run() {
    var httpServer = http.createServer().listen(HTTP_PORT, function(val) {
	log('Server listening on: %s', HTTP_PORT);
    });
    httpServer.on('request', handleHttp);
    
    log('Server started at %d', HTTP_PORT);
}


function handleHttp(req, res) {
    const url = req.url;
    const method = req.method;
    const ip = req.socket.remoteAddress;
    const port = req.socket.remotePort;
    
    log('HTTP:  %s %s %s:%s', method, url, ip, port);

    if (url.indexOf('jquery-3.2.1.min.js') > 0) {
	serveJavaScript('src/jquery-3.2.1.min.js', res);
    } else if (url.indexOf('jscolor.min.js') > 0) {
	serveJavaScript('src/jscolor.min.js', res);
    } else if (url.indexOf('page.js') > 0) {
	serveJavaScript('src/page.js', res);
    } else if (url.indexOf('styles.css') > 0) {
	serveCss('src/styles.css', res);
    } else if (url.indexOf('jurmo-white.png') > 0) {
	servePng('src/jurmo-white.png', res);
    } else if (url.indexOf('jurmo-layer-48.png') > 0) {
	servePng('src/jurmo-layer-48.png', res);
    } else if (url.indexOf('jurmo-layer-49.png') > 0) {
	servePng('src/jurmo-layer-49.png', res);
    } else if (url.indexOf('jurmo-layer-62.png') > 0) {
	servePng('src/jurmo-layer-62.png', res);
    } else if (url.indexOf('jurmo-layer-79.png') > 0) {
	servePng('src/jurmo-layer-79.png', res);
    } else {
	serveRoot(req, res);
    }
    
}

function serveJavaScript(file, res) {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    var fileStream = fs.createReadStream(file);
    fileStream.pipe(res);
}

function serveGif(file, res) {
    res.writeHead(200, {'Content-Type': 'image/gif'});
    serveFile(file,res);
}

function servePng(file, res) {
    res.writeHead(200, {'Content-Type': 'image/png'});
    serveFile(file,res);
}

function serveCss(file, res) {
    res.writeHead(200, {'Content-Type': 'text/css'});
    serveFile(file,res);
}

function serveFile(file, res) {
    var fileStream = fs.createReadStream(file);
    fileStream.pipe(res);
}


function serveRoot(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var jurmoPagePath = 'src/index.html';
    var fileStream = fs.createReadStream(jurmoPagePath);
    fileStream.pipe(res);
}



function log() {
    const now = new Date();
    var month = twoDigit(now.getMonth());
    var date = twoDigit(now.getDate());
    var hours = twoDigit(now.getHours());
    var minutes = twoDigit(now.getMinutes());
    var seconds = twoDigit(now.getSeconds());
    
    const timestamp =
	  util.format('%s-%s-%sT%s:%s:%s',
		      now.getFullYear(), month, date,
		      hours, minutes, seconds);
    const message = util.format.apply(this, arguments);
    //console.log('%s', message);
    const logMessage = util.format('%s %s', timestamp, message);
    console.log(logMessage);
}

function twoDigit(number) {
    //console.log('twoDigit(%s: %s)', typeof number, number);
    return  number < 10 ? "0" + number : number;
}
