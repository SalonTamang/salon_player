//Import the mysql module
const mysql = require('mysql');

//Create a connection pool with the user details
const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "root",
    password: "",
    database: "music_player",
    debug: false
});



//Import the express, body-parser and express-session modules
const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const fileUpload = require('express-fileupload');


//Create express app and configure it with body-parser
const app = express();
app.use(bodyParser.json());


//configure expresss  to use express session
app.use(
    expressSession({
        secret: 'cst2120 secret',
        cookie: {maxAge:6000},
        resave:false,
        saveUninitialized: true
    })
);

//Configure Express to use the file upload module
app.use(fileUpload());

//Set up express to serve static files from the directory called 'public'
app.use(express.static('public'));

//Data structure that will be accessed using the web service
let userArray = [];

//Start the app listening on port 8080
app.listen(8080);
console.log("Listening to port 8080");


//Handle POST requests sent to /upload path
app.post('/upload', function(request, response) {
    //Check to see if a file has been submitted on this path
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('{"upload": false, "error": "Files missing"}');
    }

    // The name of the input field (i.e. "myFile") is used to retrieve the uploaded file
    let imageFile = request.files.imageFile;
    let audioFile = request.files.audioFile;
    let title = request.body.title;
    let artist = request.body.artist;
    let album = request.body.album;


    //CHECK THAT IT IS AN IMAGE FILE, NOT AN .EXE ETC.
    let imgExt = imageFile.mimetype;
    if(imgExt == "image/jpeg" || imgExt == "image/png" || imgExt == "image/jpg"){
        /* Use the mv() method to place the file in the folder called 'uploads' on the server.
        This is in the current directory */
        imageFile.mv('./public/images/' + imageFile.name, function(err) {
            if (err){
                return response.send('{"filename": "' + imageFile.name + '", "upload": false, "error": "' + JSON.stringify(err) + '"}');
            }
        });
    } else{
        return response.send('{"filename": "' +
        imageFile.name + '", "upload": false, "error": " file was not image"}');
    }

    //CHECK if it is an audio file
    let audioExt = audioFile.mimetype;
    if(audioExt == "audio/mpeg"){
        //uploading audio file to audio folder
        audioFile.mv('./public/audio/' + audioFile.name, function(err){
            if(err){
                return response.send('{"filename": "' + audioFile.name + '", "upload": false, "error": "' + JSON.stringify(err) + '"}');
            }
        });
    } else{
        return response.send('{"filename": "' +
        audioFile.name + '", "upload": false, "error": " file was not audio"}');
    }

    let sql = "INSERT INTO songs (title, album, artist, image, audio) VALUES ('" + title + "', '" + album + "', '" + artist + "', '" + imageFile.name + "', '" + audioFile.name + "')";

    //Execute query and output results
    connectionPool.query(sql, (err, result) => {
        if (err){//Check for errors
            return response.status(500).send('{"message": false, "error": "' +
            JSON.stringify(err) + '"}');
        } else{
            response.send('{"upload": "true"}');
        }
    });
});

//getting songs from database using get request

app.get('/getSongs', function(request,response){
    //sql query to select all from songs table
    let sql = "SELECT * FROM songs";

    //making connection to database
    connectionPool.query(sql, (err, result) =>{
        if (err){//Check for errors
            return response.status(500).send('{"message": false, "error": "' +
            JSON.stringify(err) + '"}');
        } else{
            response.send(result);
        }
    })
});

//getting the album song from database using their songID

app.post('/getAlbum', function(request,response){
    
    let sql = "SELECT * FROM songs WHERE songID = '" + request.body.songID + "'";

    connectionPool.query(sql, (err, result) =>{
        if(err){
            return response.status(500).send('{"message": false, "error": "' +
            JSON.stringify(err) + '"}');
        } else{
            response.send(result);
        }
    });
})

//adding the song to favorites
app.post('/addFavorite', function(request,response){
    //sql query to update favorite row from songs table
    let sql = "UPDATE songs SET favorite = 'true' WHERE songID='" + request.body.songID + "'";

    //making connection to database
    connectionPool.query(sql, (err, result) =>{
        if (err){//Check for errors
            return response.status(500).send('{"message": false, "error": "' +
            JSON.stringify(err) + '"}');
        } else{
            response.send(result);
        }
    });
});

//getting favorites from songs table

app.get("/getFavorites", function(request,response){

    //sql query to select all from favorite songs from table
    let sql = "SELECT * FROM songs WHERE favorite='true'";

    //making connection to database
    connectionPool.query(sql, (err, result) =>{
        if (err){//Check for errors
            return response.status(500).send('{"message": false, "error": "' +
            JSON.stringify(err) + '"}');
        } else{
            response.send(result);
        }
    });


});


//getting favorites from songs table

app.get("/getRecent", function(request,response){

    //sql query to select all from recent songs from table
    let sql = "SELECT * FROM history";

    //making connection to database
    connectionPool.query(sql, (err, result) =>{
        if (err){//Check for errors
            return response.status(500).send('{"message": false, "error": "' +
            JSON.stringify(err) + '"}');
        } else{
            response.send(result);
        }
    });


});

//browse channels

app.get('/getAll', function(request,response){
    response.send(JSON.stringify('<div class="mainContent"> <div class="contentHeader"> <h2> Browse Channels </h2> </div> <div class="files"> <div class="album"> <img src="images/mc stan.png" alt="album_name"> <div class="artist"> <span >MC STAN</span> </div> </div> <div class="album"> <img src="images/central cee.jpg" alt="album_name"> <div class="artist"> <span >Central Cee</span> </div> </div> <div class="album"> <img src="images/t1.jpg" alt="album_name"> <div class="artist"> <span >Tribal Rain</span> </div> </div> <div class="album"> <img src="images/c2.jpg" alt="album_name"> <div class="artist"> <span >Central Cee</span> </div> </div> <div class="album"> <img src="images/c3.jpg" alt="album_name"> <div class="artist"> <span >Central Cee</span> </div> </div> <div class="album"> <img src="images/mc stan.png" alt="album_name"> <div class="artist"> <span >MC STAN</span> </div> </div> </div>  <div class="contentHeader"> <h2> Popular </h2> </div> <div class="files"> <div class="records"> <img src="images/central cee.jpg" alt="album"> <div class="artist"> <p>Album name</p> <p>Central Cee</p> </div> </div> <div class="records"> <img src="images/c2.jpg" alt="album"> <div class="artist"> <p>Album name</p> <p>Central Cee</p> </div> </div> <div class="records"> <img src="images/c3.jpg" alt="album"> <div class="artist"> <p>Album name</p> <p>Central Cee</p> </div> </div> <div class="records"> <img src="images/t1.jpg" alt="album"> <div class="artist"> <p>Album name</p> <p>Tribal Rain</p> </div> </div> <div class="records"> <img src="images/mc stan.png" alt="album"> <div class="artist"> <p>Album name</p> <p>MC STAN</p> </div> </div> <div class="records"> <img src="images/central cee.jpg" alt="album"> <div class="artist"> <p>Album name</p> <p>Central Cee</p> </div> </div> </div>  <div class="contentHeader"> <h2> New releases </h2> </div> <div class="files"> <div class="records"> <img src="images/c2.jpg" alt="album"> <div class="artist"> <p>Album name</p> <p>Central Cee</p> </div> </div> <div class="records"> <img src="images/c3.jpg" alt="album"> <div class="artist"> <p>Album name</p> <p>Central Cee</p> </div> </div> <div class="records"> <img src="images/central cee.jpg" alt="album"> <div class="artist"> <p>Album name</p> <p>Central Cee</p> </div> </div> <div class="records"> <img src="images/mc stan.png" alt="album"> <div class="artist"> <p>Album name</p> <p>MC STAN</p> </div> </div> <div class="records"> <img src="images/t1.jpg" alt="album"> <div class="artist"> <p>Album name</p> <p>Tribal Rain</p> </div> </div> </div> </div>'));
});
