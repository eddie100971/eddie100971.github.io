const token = 'BQCIHxnDNdgMAICfhM8YvG3ZYM3Fg9YwNgLtatR0jBSQyXA8qyLGtShtePkwdW7IsJ3mjrLrNDyTPfu-VKfPR7VP8XYd-CuxcODgV_DD48Sqmfv63mWwR_tBm8h2_9Ny3ic_rDOqnWpMxHp0ubzEQL5arOOHrpZxwh30';
const authEndpoint = 'https://accounts.spotify.com/authorize';

const clientId = 'c73c11f33ea4410db54b8afefecca3ef';
const redirectUri = 'https://spotify-web-playback.glitch.me';
const scopes = [
  'streaming',
  'user-read-birthdate',
  'user-read-private',
  'user-modify-playback-state'
];

device = '';

if (!token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

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
  // player.addListener('not_ready', ({ device_id }) => {
  //   console.log('Device ID has gone offline', device_id);
  // });

  // Connect to the player!
  player.connect();
};

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

function stop() {
  $.ajax({
    url: "https://api.spotify.com/v1/me/player/pause?device_id=" + device,
    type: "PUT",
    data: '{"uris": ["spotify:track:7GhIk7Il098yCjg4BQjzvb"]}',
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
    success: function(data) { 
      console.log(data)
    }
   });
}

function resume() {
  $.ajax({
    url: "https://api.spotify.com/v1/me/player/play?device_id=" + device,
    type: "PUT",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
    success: function(data) { 
      console.log(data)
    }
   });
}

function search(query) {
  let artist_name = document.getElementById("artist_name").value;
  console.log(artist_name);

  if (artist_name) {
    // Get artist's ID
    $.ajax({
      url: "https://api.spotify.com/v1/search?q=" + artist_name + "&type=artist" + "&limit=1",
      type: "GET",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
      success: function(data) { 
        console.log(data.artists.items[0].name);
        let artist_id = data.artists.items[0].id;
        console.log("ID: " + artist_id)
      }
     }).then((data) => {
      // Get artist's top tracks
      $.ajax({
        url: "https://api.spotify.com/v1/artists/" + data.artists.items[0].id + "/top-tracks?country=US",
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
        success: function(data) { 
          let song_id = data.tracks[0].id;
          document.getElementById("current_song").innerHTML = data.tracks[0].name;
          play(song_id); 
          // console.log(data);
          // let tracks = data.tracks;
          // tracks.forEach(element => {
          //   console.log("Song name: " + element.name);
          //   console.log("Song ID: " + element.id);
          // });
          
        }
      });
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