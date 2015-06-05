var cfEnv = require( 'cfenv' );
var Cloudant = require ( 'cloudant' );

var appEnv = cfEnv.getAppEnv();

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

Cloudant( {account:username, password:password}, function( err, cloudant ) {
  if ( err ) return console.log( "Error connecting to Cloudant account %s:%s", username, err.message )
  console.log( 'Connected to Cloudant' );

  cloudant.db.list( function( err, all_dbs ) {
    console.log( 'All my databases: %s', all_dbs.join( ', ' ));
  } );


  //Three nested commands to ensure the tests run in sequence
  // Insert, then get, then delete
  var db = cloudant.db.use( 'testdb1' );
  db.insert( {crazy: true }, 'rabbit', function( err, body ){
    if ( err ) console.log( 'Error during insertion' );
    console.log( "Inserted; " );
    console.log( body );

    db.get( 'rabbit', { revs_info: true }, function( err, body ){
      if ( err ) { 
        console.log( 'Error during get: ' + err.message );
        throw err;
      }
      console.log( "Get returned: " );
      console.log( body );
      var revid = body._rev;
      console.log( "Pulled out rev = " + revid );

      db.destroy( 'rabbit', revid, function( err, body ){
        if ( err ) {
          console.log( 'Error during destroy '+err.message );
          throw err;
        }
        console.log( "Destroyed: " )
        console.log( body );
      
        db.get( 'rabbit', { revs_info: true }, function( err, body ){
       
          if ( err ) { 
            console.log( 'Get failed following reason should say \'deleted\': ' + err.message );
          }
        });

      } ); 

    } );
  } );

} );

