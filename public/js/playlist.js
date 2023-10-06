
let songs = [];

//Set up page when window has loaded
window.onload = getSongFromDatabase();

//getting songs stored from database
function getSongFromDatabase(){
    let files = document.querySelector(".files");

    //clear the files
    files.innerHTML = "";
    let xml = new XMLHttpRequest();
    xml.onload = () =>{
        let response = JSON.parse(xml.responseText);
        console.log(response);
        if("error" in response){
            mainContent.innerHTML = response.error;
        } else {     
            //if we get result from database
            for (let index = 0; index < response.length; index++) {
                let songID = response[index]['songID'];
                let title = response[index]['title'];
                let artist = response[index]['artist'];
                let album = response[index]['album'];
                let image = response[index]['image'];
                let audio = response[index]['audio'];

                files.innerHTML += '<div class="album" id="'+ songID +'" onclick="displayAlbum(this.id)"> <img src="images/' + image + '" alt="' + album + '"> <div class="artist"> <span>'+ artist +'</span> </div> </div>';
                
            }

        }
    }
    xml.open("GET", "/getSongs");
    xml.send();
}
//displaying album on click
function displayAlbum(id){
    let mainContent = document.querySelector(".mainContent");
    let songID = id;
    let xml = new XMLHttpRequest();
    xml.onload = () => {
        let response = JSON.parse(xml.responseText);
        if("error" in response){
            mainContent.innerHTML = response.error;
        } else {
            //clear the container                                                                                                                                                                       
            songs = [];
            songs.push({
                name: response[0]['title'],
                artist: response[0]['artist'],
                img: response[0]['image'],
                audio: response[0]['audio']
            });
            mainContent.innerHTML = '<div class="albumImageContainer"> <div class="albumImage"> <img src="images/' + response[0]['image'] + '" alt="'+ response[0]['album'] +'"> </div> <div class="albumDetails"> <span>'+ response[0]['artist'] +' • </span> <span>' + response.length + ' song</span> </div> </div>';
            mainContent.innerHTML += '<div class="wrapper"> <div class="favHeader"> <div class="headFirst"> <span>#</span> <span>Title</span> </div> <div class="headLast"> <img src="images/feature.png" alt="minutes"> </div> </div> <div class="separator"> <hr> </div> <div id="list" onclick="loadData(1)"> <div class="listTitle"> <span>1. </span> <div class="titleWrapper"> <div class="title_image"> <img src="images/'+ response[0]['image'] +'" alt="album_image"> </div> </div> <div class="music_details"> <div class="music_title"> <span>'+ response[0]['title'] +'</span> </div> <div class="artist_name"> <span>'+ response[0]['artist'] +'</span> </div> </div> </div>  <div class="feature"> <div class="likeImage"> <span class="material-symbols-rounded" id="like_button">favorite</span> </div> <div class="playlistImage"> <span class="material-symbols-rounded" id="add_button">add</span> </div> </div> </div> </div>';
        }
    }
    var data = {};
    data.songID = songID;

    //sending the data to server
    xml.open("POST","/getAlbum");
    xml.setRequestHeader("Content-type", "application/json");
    xml.send(JSON.stringify(data));

}


function displayAll(){
    let xml = new XMLHttpRequest();
    let mainContainer = document.querySelector(".mainContent");
    xml.onload = () =>{
        let response = JSON.parse(xml.responseText);
        mainContainer.innerHTML = response;
        getSongFromDatabase();
    }
    xml.open('get','/getAll');
    xml.send();
}