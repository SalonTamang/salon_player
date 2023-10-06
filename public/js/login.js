
//functionality to display information of result
function _(message) {
    var messageContainer = document.getElementById("login_message");
    if(message == "emtpy"){
        messageContainer.innerHTML = "Please enter all your details first!";
    }else if (message == "success") {
        messageContainer.innerHTML = "Yor have successfully logged in!";
    } else {
        messageContainer.innerHTML = "Invalid username or password.";
    }
}

function validateLoginForm(e){
    var username = document.forms["login"]["username"].value;
    var password = document.forms["login"]["password"].value;

    //checking if users information matches with server data.
    
    let userinfo = JSON.parse(result);
    //if user input is empty
    if(userinfo != undefined || userinfo != null){
        if(username != "" && password != ""){
            //Set up HTTP Request
        
        var data = {};
        data.username = username;
        data.password = password; 
        let httpReq = new XMLHttpRequest();
        httpReq.onload = () => {
            let response = JSON.parse(httpReq.responseText);

            if("error" in response){//Error from server
                displayMessage(response.error);
            }
            /*check if user already exists in the server*/
            if(response.exist == "true"){
                //user already exists
                userExist = true;
                displayMessage("");   
            }                         
        };

            if(userExist){

                _("success");
                //assigning a logged in session value to true.
                sessionStorage.loggedIn = "true";
                sessionStorage.username = username;
        
            }else {
                _("invalid");
            }
        }else {
            _("empty");
        }
    } else {
        _("invalid");
    }    
}


