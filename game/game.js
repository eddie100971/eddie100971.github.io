let tracks_info = JSON.parse(sessionStorage.getItem('track_info'));
let token = sessionStorage.getItem('token');
let device;

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
      startGame();
    });
  
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
  };

function startGame() {
    console.log("hi");
    tracks_length = tracks_info.length;

    // Song ID's for the four options
    first_choice_id = tracks_info[0][0];
    first_choice_name = tracks_info[0][1];
    second_choice_id = tracks_info[1][0];
    second_choice_name = tracks_info[1][1];
    third_choice_id = tracks_info[2][0];
    third_choice_name = tracks_info[2][1];
    fourth_choice_id = tracks_info[3][0];
    fourth_choice_name = tracks_info[3][1];

    // first_choice = document.getElementById("choice1");
    // second_choice = document.getElementById("choice2");
    // third_choice = document.getElementById("choice3");
    // fourth_choice = document.getElementById("choice4");

    play(first_choice_id);

    document.getElementById("choice1").innerHTML = first_choice_name;
    document.getElementById("choice2").innerHTML = second_choice_name;
    document.getElementById("choice3").innerHTML = third_choice_name;
    document.getElementById("choice4").innerHTML = fourth_choice_name;

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

