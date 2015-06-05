/*
 * Creates the index for search VIDS by:
 *  GTIN, LotNumber, and Expiry Date
 */

var cfEnv = require( 'cfenv' );
var Cloudant = require( 'Cloudant' );
var vidsDBName = 'vids';

var appEnv = cfEnv.getAppEnv();

var vids = '' // vids db connection object

//  Attempt to retrieve the username/password for cloudant
//  only works when running in bluemix
var serviceCreds = appEnv.getServiceCreds( 'Cloudant NoSQL DB-tu' );
var dbusername = '';
var dbpassword = '';
if ( serviceCreds ) {
  dbusername = serviceCreds.username;
  dbpassword = serviceCreds.password;
}
// Cloudant username and password
var username = ( dbusername || process.env.username );
var password = ( dbpassword || process.env.password );

Cloudant( {account: username, password: password}, function( err, cloudant) {
  if ( err ) return console.log( 'Error connecting to Cloudant account %s:%s', username, err.message );

  console.log( 'Connected to Cloudant' );
  vids = cloudant.db.use( vidsDBName );

  var vidsIndex = { 
    name: 'vidsIndex',
    type: 'json',
    index: {fields: [ 'GTIN', 'LotNumber', 'ExpiryDate' ]}
  };


  vids.index( vidsIndex, function( err, response ) {
    if ( err ) 
      return console.log( 'Error creating %s, with error: ', 
        vidsIndex.name, err.message );
    console.log( 'Index creation result: %s', response.result );

  });
});

