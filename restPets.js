var express = require( 'express' );
var methodOverride = require( 'method-override' );
var fs = require( 'fs' );
var bodyParser = require( 'body-parser' );
var sqlite3 = require("sqlite3").verbose();
var app = express();
var file = "./pets.db";

app.use( bodyParser() );
app.use( methodOverride( '_method' ) )
app.use( express.static( __dirname + '/public' ) );


var exists = fs.existsSync(file);
var db = new sqlite3.Database(file);
if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}


db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE Stuff (thing TEXT)");
  }
  
        var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");

app.get( '/students', function ( req, res ) {
  res.render( 'index.ejs', {
    students: students
  } )
} );

app.get( '/student/:id', function ( req, res ) {
  var thisStudent = students[ req.params.id ]
  res.render( 'show.ejs', {
    thisStudent: thisStudent
  } )
} );

app.get( '/search', function ( req, res ) {
  res.render( 'search.ejs' )
} );

app.get( '/search/:queryName', function ( req, res ) {
  var queryName = req.params.queryName
  console.log( "searching for: " + queryName );
  for ( student in students ) {
    var name = students[ student ].name;
    if ( queryName === name ) {
      console.log( students[ student ].name );
      res.json( {
        exists: students[ student ]
      } );
    }
    if ( queryName != name ) {
      res.json( none )
    }
  }
} );

app.post( '/student', function ( req, res ) {
  var student = {
    id: counter,
    name: req.body.name,
    age: req.body.age,
    house: "",
    favorite_spell: req.body.faveSpell,
  };
  console.log( student );
  students[ counter ] = student;
  counter++
  console.log( students.counter );
  res.method = 'get';
  fs.writeFile( 'roster.json', JSON.stringify( students ) )
  res.redirect( '/students' );
} );

app.put( '/student/:id', function ( req, res ) {

  students[ req.params.id ].name = req.body.newName;
  students[ req.params.id ].favorite_spell = req.body.newFaveSpell;
  req.method = 'get';
  fs.writeFile( 'roster.json', JSON.stringify( students ) )
  res.redirect( '/student/' + req.params.id )
} );

//Insert random data

stmt.finalize();
  db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
    console.log(row.id + ": " + row.thing);
  });
});

db.close();

app.delete( '/student/:id', function ( req, res ) {
  delete students[ req.params.id ];
  req.method = 'get';
  fs.writeFile( 'roster.json', JSON.stringify( students ) )
  res.redirect( '/students' );
} );

app.post( '/sort/:id', function ( req, res ) {
  var houses = [ "Gryffindor", "Ravenclaw", "Hufflepuff", "Slytherin" ];
  for ( student in students ) {
    if ( students[ student ].id == req.params.id ) {
      students[ student ].house = houses[ Math.floor( Math.random() * houses.length ) ];
    }
  }
  req.method = 'get';
  res.redirect( '/students' );
} );

app.get( '/houses/:house_name', function ( req, res ) {
  var house = req.params.house_name;
  res.render( 'house.ejs', {
    house: house,
    students: students
  } );
} );

app.listen( 3000 );

console.log( "Server listening on port: 3000" );















