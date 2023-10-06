const content = document.querySelector(".musicContainer"),
albumImage = content.querySelector(".music_image"),
songName = content.querySelector(".music_title .track"),
musicArtist = content.querySelector(".artist_name .singer"),
Audio = content.querySelector(".current-song"),
playBtn = content.querySelector(".play-pause"),
playBtnIcon = content.querySelector(".play-pause span"),
prevBtn = content.querySelector("#prev"),
nextBtn = content.querySelector("#next"),
progressBar = content.querySelector(".progress-bar"),
progressDetails = content.querySelector(".progress-details"),
repeatBtn = content.querySelector("#repeat"),
shuffleBtn = content.querySelector("#shuffle");



let index = 1;

function loadData(indexValue){
    songName.innerHTML = songs[indexValue -1].name;
    musicArtist.innerHTML = songs[indexValue -1].artist;
    albumImage.innerHTML = "";
    const para = document.createElement("img");
    para.src = "images/" + songs[indexValue -1].img;
    albumImage.appendChild(para);
    Audio.src = "audio/" + songs[indexValue - 1].audio;
    playSong();
}
// play button functionality
playBtn.addEventListener("click", ()=>{
    const isMusicPaused = content.classList.contains("paused");
    if(isMusicPaused){
        pauseSong();
    }
    else{
        playSong();
    }
});

//storing audio level for using it when unmute
localStorage.setItem("currentLevel", 0.35);

// play the song on click
function playSong(){
    content.classList.add("paused");
    playBtnIcon.innerHTML = "pause_circle";
    Audio.play();
    let volumeBar =  document.querySelector(".volume-bar");
    if(localStorage.getItem("currentLevel") != ""){
        Audio.volume = localStorage.getItem("currentLevel");
        volumeBar.style.width = localStorage.getItem("currentLevel") * 100 + "%";
    } else{
        Audio.volume = 0.35;
        volumeBar.style.width = Audio.volume * 100 + "%";
    }
}

// pause the song on click
function pauseSong(){
    content.classList.remove("paused");
    playBtnIcon.innerHTML = "play_circle";
    Audio.pause();
}

// previous and next button functionality using the index in the array
prevBtn.addEventListener("click" ,()=>{
    prevSong();
});
nextBtn.addEventListener("click", ()=>{
    nextSong();
});

function nextSong(){
    index++;
    if(index > songs.length){ //if the song in playlist finishes, start from the beginning of the playlist
        index = 1;
    } else{
        index = index;
    }

    loadData(index);
    playSong();
}

function prevSong(){
    index--;
    if(index <= 0){ //if the song in playlist finishes, start from the end of the playlist
        index = songs.length;
    } else{
        index = index;
    }

    loadData(index);
    playSong();
}

// time updating of the music player
Audio.addEventListener("timeupdate", (e)=>{
    const initialTime = e.target.currentTime; //getting current time of music
    const finalTime = e.target.duration; //getting full music duration
    let barWidth =  (initialTime / finalTime) * 100;
    progressBar.style.width = barWidth + "%";


    progressDetails.addEventListener("click", (e)=>{
        let progressValue = progressDetails.clientWidth; //get width of progress bar
        let clickOffsetX =  e.offsetX; //get offset x value
        let musicDuration = Audio.duration; // get total music duration

        Audio.currentTime = (clickOffsetX / progressValue) * musicDuration; //setting time of progress bar if user clicks 
    });

    //Timer logic

    Audio.addEventListener("loadeddata", ()=>{

    //final time update
        let finalTimeData = content.querySelector(".final");
        let musicDuration = Audio.duration;
        let finalMinutes = Math.floor(musicDuration / 60);
        let finalSeconds = Math.floor(musicDuration % 60);

        //adding "0" if seconds less than 10
        if(finalSeconds < 10){
            finalSeconds = "0"+finalSeconds;
        }

        finalTimeData.innerText = finalMinutes + ":" + finalSeconds;
        
    });
    //update current time
    let currentTimeData = content.querySelector(".current");
    let currentDuration = Audio.currentTime;
    let currentMinutes = Math.floor(currentDuration / 60);
    let currentSeconds = Math.floor(currentDuration % 60);

    //adding "0" if seconds less than 10
    if(currentSeconds < 10){
        currentSeconds = "0"+ currentSeconds;
    }

    currentTimeData.innerText = currentMinutes + ":" + currentSeconds;

});

//repeat button logic
repeatBtn.addEventListener("click", ()=>{
    Audio.currentTime = 0;
});

//shuffle button logic
shuffleBtn.addEventListener("click", ()=>{
    var randomIndex = Math.floor(Math.random() * songs.length) + 1; //this selects this songs btw index 1 and song array length
    loadData(randomIndex);
    playSong();
});

//if the song has finished automatically go to next song
Audio.addEventListener("ended", ()=>{
    index++;
    if(index > songs.length){
        index = 1;
    }
    loadData(index);
    playSong();
});

//volume button logic
let volumeBtn = document.querySelector(".volume_button");
let volumeBtnIcon = document.querySelector(".volume_button span");
let volumeDetails = document.querySelector(".volume-details");
let volumeBar = document.querySelector(".volume-bar");


volumeBtn.addEventListener("click" ,()=>{
    muteSong();
});


//mute song functionality
function muteSong(){
    
    Audio.volume = 0;
    if(volumeBtn.classList.contains("muted")){
        volumeBtn.classList.remove("muted");
        volumeBtnIcon.innerHTML = "volume_up";
        Audio.volume = localStorage.getItem("currentLevel");
        let volumeLevel = Audio.volume * 100;
        volumeBar.style.width = volumeLevel + "%"; 
    } else{
        volumeBtn.classList.add("muted");
        volumeBtnIcon.innerHTML = "volume_mute";
    }
}



volumeDetails.addEventListener("click", (e)=>{
    let volumeValue = volumeDetails.clientWidth; //get width of progress bar
    let clickOffsetX =  e.offsetX; //get offset x value
    if(volumeBtn.classList.contains("muted")){
        volumeBtn.classList.remove("muted");
        volumeBtnIcon.innerHTML = "volume_up";
    }
    Audio.volume = (clickOffsetX / volumeValue); //setting time of progress bar if user clicks 
    localStorage.setItem("currentLevel", Audio.volume);
    //update volume bar width
    let volumeLevel = Audio.volume * 100;
    volumeBar.style.width = volumeLevel + "%"; 
    
});

// //f5 key press
// document.body.onkeyup = function(e) {
//     if(e.keyCode == 32){
//         if(content.classList.contains("paused")){
//             pauseSong();
//         } else{
//             playSong();
//         }
//     }
// }

// function that runs on pressing create playlist button
function showAddPlaylist(){
    var playlist = document.querySelector("#input-playlist");
    playlist.classList.remove("hide");
}
//close the dropdown if the user clicks outside of it

function removeShowPlaylist(){
    document.querySelector("#input-playlist").classList.add("hide");
}

//add to favorote
function addToFav(event){
    console.log(event);
    favBtn.style.color = "#FE251B";
}

//add song to database
function addSong(){
    let mainContainer = document.querySelector(".mainContent");
    mainContainer.innerHTML = "<div class='user_registration'>  <div class='login_section'> <h1>Add song</h1> <span class='message' id='login_message'></span> <br> <br> <form id='login' name='login' enctype='multipart/form-data'> <input type='text' name='title' placeholder='Title' autofill='off' required><br> <input type='text' name='album' placeholder='Album name' required><br> <input type='text' name='artist' placeholder='Artist' required><br> <span>Image file</span><br> <input type='file' name='image' id='image' required><br> <span>Audio file</span><br><input type='file' id='audio' name='audio' required><br> <button id='last' type='submit' onclick='storeSong()'>Upload</button> </form> </div></div>";
}


//add songs to database
//Uploads the selected file to the server
function storeSong(){
    let serverResponse = document.getElementById("login_message");

        
    //Clear server response
    serverResponse.innerHTML = "";

    var loginForm = document.getElementById("login");
    function handleForm(event) { event.preventDefault(); } 
    loginForm.addEventListener('submit', handleForm);

    var title = document.forms["login"]["title"].value;
    var artist = document.forms["login"]["artist"].value;
    var album = document.forms["login"]["album"].value;

    if(title != "" || artist != "" || album != ""){

        //Get file that we want to upload
        let fileArray = document.getElementById("image").files;
        let audioArray = document.getElementById("audio").files;
        if(fileArray.length !== 1){
            serverResponse.innerHTML = "Please select image file to upload.";
            return;
        }
        if(audioArray.length !== 1){
            serverResponse.innerHTML = "Please select audio file to upload.";
            return;
        } 
        //Put file inside FormData object
        const formData = new FormData();
        formData.append('imageFile', fileArray[0]);
        formData.append('audioFile', audioArray[0]);
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('album', album);
        
        //Set up HTTP Request
        let httpReq = new XMLHttpRequest();
        httpReq.onload = () => {
            let response = JSON.parse(httpReq.responseText);
            console.log(response);
            if("error" in response){//Error from server
                serverResponse.innerHTML = response.error;
            } else if (response.upload == "true"){
                serverResponse.innerHTML = "File uploaded successfully";
            } else{
                serverResponse.innerHTML = "Some technical issue. Please wait!";
            }
        };

        //Send off message to upload file
        httpReq.open('POST', '/upload', true);
        httpReq.setRequestHeader("Content-type", "application/json");
        httpReq.send(formData);
    } else{
        serverResponse.innerHTML = "Enter all required fields.";
    }

}

//recently played songs
function displayRecentlyPlayed(){ 

    // getting the history of the user

    let mainContainer = document.querySelector(".mainContent");
    mainContainer.innerHTML = "<div class='contentHeader'><h2>Recently Played</h2></div>";

    //Set up HTTP Request
    let httpReq = new XMLHttpRequest();
    httpReq.onload = () => {
        let response = JSON.parse(httpReq.responseText);
        if("error" in response){//Error from server
            mainContainer.innerHTML += response.error;
        } else if(response.length == 0){
            mainContainer.innerHTML += "<div style='width:50%;margin:50px auto;,text-align:center;'><p style='font-weight:700;'>Your recently played list bucket is currently empty!</p></div>";
        } else{
                //clear the container                                                                                                                                                                       
                songs = [];
                for (let index = 0; index < response.length; index++) {
                    let element = response[index];
                    songs.push({
                        name: element['title'],
                        artist: element['artist'],
                        img: element['image'],
                        audio: element['audio']
                    }); 
                    mainContent.innerHTML += '<div class="wrapper"> <div class="favHeader"> <div class="headFirst"> <span>#</span> <span>Title</span> </div> <div class="headLast"> <img src="images/feature.png" alt="minutes"> </div> </div> <div class="separator"> <hr> </div> <div id="list" onclick="loadData(1)"> <div class="listTitle"> <span>1. </span> <div class="titleWrapper"> <div class="title_image"> <img src="images/'+ element['image'] +'" alt="album_image"> </div> </div> <div class="music_details"> <div class="music_title"> <span>'+ element['title'] +'</span> </div> <div class="artist_name"> <span>'+ element['artist'] +'</span> </div> </div> </div>  <div class="feature"> <div class="likeImage"> <span class="material-symbols-rounded" id="like_button">favorite</span> </div> <div class="playlistImage"> <span class="material-symbols-rounded" id="add_button">add</span> </div> </div> </div> </div>';

                }
                

        }
    };

    httpReq.open('get','/getRecent');
    httpReq.setRequestHeader("Content-type", "application/json");
    httpReq.send();
}

//favorites songs 
function displayFavorites(){
    //getting favorites from songs table

    let mainContainer = document.querySelector(".mainContent");
    mainContainer.innerHTML = "<div class='contentHeader'><h2>Favorites</h2></div>";

    //Set up HTTP Request
    let httpReq = new XMLHttpRequest();
    httpReq.onload = () => {
        let response = JSON.parse(httpReq.responseText);
        if("error" in response){//Error from server
            mainContainer.innerHTML += response.error;
        } else if(response.length == 0){
            mainContainer.innerHTML += "<div style='width:50%;margin:50px auto;,text-align:center;'><p style='font-weight:700;'>Your favorite list bucket is currently empty!</p></div>";
        } else{
            mainContainer.innerHTML += response;
        }
    };

    httpReq.open('get','/getFavorites');
    httpReq.setRequestHeader("Content-type", "application/json");
    httpReq.send();
}