
function displayMessage(message) {
    var messageContainer = document.getElementById("signup_message");
    if(message == "empty"){
        messageContainer.innerHTML = "Please enter all your details first!";
    }
    else if (message == "success") {
        messageContainer.innerHTML = "Yor have successfully registered!";
    }
    else if(message == "exists"){
        messageContainer.innerHTML = "User details already exists.";
    } else{
        messageContainer.innerHTML = message;
    }
}


let userExist = false;
function validateRegisterForm(){
    var username = document.forms["signup"]["username"].value;
    var email = document.forms["signup"]["email"].value;
    var password = document.forms["signup"]["password"].value;
    
    

    if(username == "" || email == "" || password == ""){
        displayMessage("empty");
    }
    else {
        
        //Set up HTTP Request
        
        var data = {};
        data.username = username;
        data.email = email; 
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
            } else{
                var data = {};    
                data.username = username;
                data.password = password;
                data.email = email;
                //Set up HTTP Request
                let httpReq = new XMLHttpRequest();

                httpReq.onload = () => {
                    let response = JSON.parse(httpReq.responseText);
                    if("error" in response){//Error from server
                        displayMessage(response.error);
                    }
                    if("success" in response){
                        displayMessage("success"); 
                    }                                 
                };

                httpReq.open("POST", "/registerUser");
                httpReq.setRequestHeader("Content-type","application/json");
                httpReq.send(JSON.stringify(data));    
            }
                                 
        };
         

        //Send off message to register
        httpReq.open('POST', '/checkUser');
        httpReq.setRequestHeader("Content-type","application/json");
        httpReq.send(JSON.stringify(data));
            
    }
}
        
console.log(userExist);
if(userExist){
    displayMessage("exists"); 
}

