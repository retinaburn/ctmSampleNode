var http = require( 'http' );
var querystring = require( 'querystring' );

var sample1 = require( './samplePostIR.json' );
var sample2 = require( './samplePostIR_2.json' );


var postData = JSON.stringify( sample1 );

var options = {
	hostname: 'localhost',
	port: 6001,
  accept: 'application/json',
  method: 'POST',
	path: '/addReceipt',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
}

console.log( postData );

// For Bluemix
//options.hostname = 'ctmsamplenode.mybluemix.net';
//options.port = '80';


var req = http.request( options, function( res ) {
  console.log( 'Status: ' + res.statusCode );
  console.log( 'Headers: ' + JSON.stringify( res.headers ));
  res.setEncoding( 'utf8' );

  res.on( 'data', function ( chunk ){
    console.log( 'Body: ' + chunk );
  });

  res.on( 'error', function( err ){
    console.log( 'Error issuing ' + options.method + 
      ' on ' + options.path + ' :' + err.message );
  });
});

req.write( postData );
req.end();

