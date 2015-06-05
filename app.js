/*jshint node:true*/

//------------------------------------------------------------------------------
// app.js - Middleware routing
//------------------------------------------------------------------------------

// For memory usage analysis
//var heapdump = require('heapdump');


// This application uses express as it's web server
// for more info, see: http://expressjs.com
var express = require( 'express' );

// For handling the POST bodies and multi-part bodies0
var bodyParser = require( 'body-parser' );
var multer = require( 'multer' );

// Create a new express server
var app = express();

// Get the app environment from Cloud Foundry
var cfenv = require( 'cfenv' );
var appEnv = cfenv.getAppEnv();

// Catch all handlers for unhandled URLs
//
app.post( '/*', function( req, res ){
	logRequest( req );
	res.send( 'Unhandled POST received' );
});

app.get( '/', function( req, res ){
	logRequest( req );
	res.send( 'Unhandled GET received' );
});


// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

	// print a message when the server starts listening
  console.log("server starting on -- " + appEnv.url);
});

function logRequest(req){
	console.log("Received,"+new Date().toLocaleString()+","+req.method+","+req.originalUrl);
}

