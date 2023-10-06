//Points to a div element where user combo will be inserted.
let userDiv;
let addUserResultDiv;

//Set up page when window has loaded
window.onload = init;

//Get pointers to parts of the DOM after the page has loaded.
function init(){
    userDiv = document.getElementById("UserDiv");
    addUserResultDiv = document.getElementById("AddUserResult");
    loadUsers();
}

/* Loads current users and adds them to the page. */
function loadUsers() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            let usrArr = JSON.parse(xhttp.responseText);

            //Return if no users
            if(usrArr.length === 0)
                return;

            //Build string with user data
            let htmlStr = "<table><tr><th>ID</th><th>Name</th><th>Email</th><th>Age</th></tr>";
            for(let key in usrArr){
                htmlStr += ("<tr><td>" + key + "</td><td>" + usrArr[key].name + "</td>");
                htmlStr += ("<td>" + usrArr[key].email + "</td><td>" + usrArr[key].age + "</td></tr>");
            }
            //Add users to page.
            htmlStr += "</table>";
            userDiv.innerHTML = htmlStr;
        }
    };

    //Request data from all users
    xhttp.open("GET", "/users", true);
    xhttp.send();
}


/* Posts a new user to the server. */
function addUser() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Extract user data
    let usrName = document.getElementById("NameInput").value;
    let usrEmail = document.getElementById("EmailInput").value;
    let usrAge = document.getElementById("AgeInput").value;

    //Create object with user data
    let usrObj = {
        name: usrName,
        email: usrEmail,
        age: usrAge
    };
    
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            addUserResultDiv.innerHTML = "User added successfully";
        }
        else{
            addUserResultDiv.innerHTML = "<span style='color: red'>Error adding user</span>.";
        }
        //Refresh list of users
        loadUsers();
    };

    //Send new user data to server
    xhttp.open("POST", "/users", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(usrObj) );
}
 



//Handles POST requests to our web service
function checkUserDetail(request, response){
    //get user details
    let userData = request.body;
    let username =  userData.username;
    let sql = "";
    if(userData.password != undefined){
        sql = "SELECT * FROM users WHERE username='" + username + "' AND password='"+ userData.password + "' LIMIT 1";
    } else{
        sql = "SELECT * FROM users WHERE username='" + username + "'  LIMIT 1";
    }
    

    //Execute query and output results
    connectionPool.query(sql, (err, result) => {
        if (err){//Check for errors
            return response.status(500).send('{"message": false, "error": "' +
            JSON.stringify(err) + '"}');
        }
        console.log(Object.keys(result).length);
        if(Object.keys(result).length == 0){
            //send user doesnot exist with success
            response.send('{"success": true}');  
        } else{
            //Send user exists 
            response.send('{"exist": true}');
        }         
    });
}


//Handles POST requests to our web service
function postUserDetails(request, response){
    //Output the data sent to the server
    let newUser = request.body;
    console.log("Data received: " + JSON.stringify(newUser));

    //Build query
    let sql = "INSERT INTO users (username, email, password) " + "VALUES ('" + newUser.username + "', '" + newUser.email + "', '" + newUser.password + "')";

    //Execute query and output results
    connectionPool.query(sql, (err, result) => {
    if (err){//Check for errors
        return response.status(500).send('{"message": false, "error": "' +
        JSON.stringify(err) + '"}');
    }
    else{
        //Send back confirmation of the upload to the client.
        response.send('{"username": "' + newUser.username +
            '", "success": true}');

    }
    });
}
