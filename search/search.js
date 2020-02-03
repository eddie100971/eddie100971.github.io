// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let token = hash.access_token;

console.log("Token: " + token);


device = '';

window.onSpotifyWebPlaybackSDKReady = () => {
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); }
  });

  // Error handling
  // player.addListener('initialization_error', ({ message }) => { console.error(message); });
  // player.addListener('authentication_error', ({ message }) => { console.error(message); });
  // player.addListener('account_error', ({ message }) => { console.error(message); });
  // player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Playback status updates
  // player.addListener('player_state_changed', state => { console.log(state); });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    device = device_id;
    console.log('Ready with Device ID', device_id);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  // Connect to the player!
  player.connect();
  getThreeFeatured();
  searchUser();
};

// Play a song using it's song ID
function play(song_id) {
  $.ajax({
    url: "https://api.spotify.com/v1/me/player/play?device_id=" + device,
    type: "PUT",
    data: '{"uris": ["spotify:track:' + song_id + '"]}',
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
    success: function(data) { 
      console.log("Playing song.");
    }
   });
}

// Pause a song
function stop() {
  $.ajax({
    url: "https://api.spotify.com/v1/me/player/pause?device_id=" + device,
    type: "PUT",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
    success: function(data) { 
      console.log("Paused song.");
    }
   });
}

// Resume playing a song
function resume() {
  $.ajax({
    url: "https://api.spotify.com/v1/me/player/play?device_id=" + device,
    type: "PUT",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
    success: function(data) { 
      console.log("Resuming playback.");
    }
   });
}

//Get Profile Pic
function searchUser() {
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token);},
        success: function(data) { 
            //console.info(data);
            console.log("Searched User for profile pic.");
            let username = data.display_name;
            let profile_pic = data.images[0].url;
            document.getElementById("username").innerHTML = username;
            document.getElementById("profile_pic").src = profile_pic;
        }
    });
};

function getThreeFeatured() {
  $.ajax({
    url: 'https://api.spotify.com/v1/me/top/artists?limit=3&offset=0',
    type: "GET",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token);},
    success: function(data) { 
        //console.log("Got to the getThreeFeatured() info.");
        var i;
        var arrTopThree = [];
        console.log(data);
        console.log("Found Top Three artists.");
        for(i= 0; i<data.items.length; i++){
          arrTopThree[i] = [data.items[i].name,data.items[i].images[0],data.items[i].uri];
        }
        document.getElementById("topArtist_1_profile").src = arrTopThree[0][1].url;
        document.getElementById("topArtist_1_name").innerHTML = arrTopThree[0][0];

        document.getElementById("topArtist_2_profile").src = arrTopThree[1][1].url;
        document.getElementById("topArtist_2_name").innerHTML = arrTopThree[1][0];

        document.getElementById("topArtist_3_profile").src = arrTopThree[2][1].url;
        document.getElementById("topArtist_3_name").innerHTML = arrTopThree[2][0];

        //console.log(arrTopThree);
    }

    
});
    console.info("fail");
};

let track_id_list = [];
let deferred = [];

function search(query) {
  let artist_name = document.getElementById("artist_name").value;
  // console.log(artist_name);

  if (artist_name) {
    $.ajax({
        url: "https://api.spotify.com/v1/search?q=" + artist_name + "&type=artist" + "&limit=1",
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
        success: function(data) { 
        //   console.log(data.artists.items[0].name);
        //   console.log("ID: " + artist_id)
        }
       }).then((data) => {
        // Get artist's albums
        $.ajax({
          url: "https://api.spotify.com/v1/artists/" + data.artists.items[0].id + "/albums?country=US",
          type: "GET",
          beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
          success: function(data) { 
            console.log("Found artist's albums.");
            let albums = data.items;
            // Find tracks in each album
            albums.forEach(element => {
                let album_id = element.id;
                let album_cover = element.images[0].url;
                deferred.push(
                    $.ajax({
                        url: "https://api.spotify.com/v1/albums/" + album_id + "/tracks",
                        type: "GET",
                        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
                        success: function(data) { 
                            tracks = data.items;
                            tracks.forEach(element => {
                                track_id_list.push([element.id, element.name, album_cover]);
                            });
                        }
                    })
                )
            });
            $.when.apply($, deferred).then((data) => {
                console.log("Finding random song.");
                let random_index = Math.floor(Math.random() * Math.floor(track_id_list.length));

                let song_id = track_id_list[random_index][0];
                let song_name = track_id_list[random_index][1];
                let album_cover = track_id_list[random_index][2];

                // play(song_id);

                // document.getElementById("current_song_label").className = "current_song_label_shown";
                // document.getElementById("album_cover").className = "album_cover_shown";
                // document.getElementById("current_song").innerHTML = song_name;
                // document.getElementById("album_cover").src = album_cover;

                sessionStorage.setItem('track_info', JSON.stringify(track_id_list));
                sessionStorage.setItem('token', token);

                window.location.href = '../game/game.html';

                // Reset arrays for next search
                deferred = [];
                track_id_list = [];

            });

          }
        })
       });  
  }
}

// Get the input field
let input = document.getElementById("artist_name");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("search_button").click();
  }
});

function toArtist_1(){
  window.open("https://open.spotify.com/artist/1EowJ1WwkMzkCkRomFhui7")
}
function toArtist_2(){
  window.open("https://open.spotify.com/artist/1AhjOkOLkbHUfcHDSErXQs")
}
function toArtist_3(){
  window.open("spotify:artist:1EowJ1WwkMzkCkRomFhui7")
}
function toWebPlayer(){
  window.open("https://open.spotify.com/")
}