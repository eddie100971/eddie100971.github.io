let tracks_info = JSON.parse(sessionStorage.getItem('track_info'));
let token = sessionStorage.getItem('token');
let device;
let answer = '';

let score = 0;

window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); }
    });
  
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
    tracks_length = tracks_info.length;
    already_played = new Array(tracks_length).fill(0);
    four_random_ind = [-1, -1, -1, -1];

    i = 0;
    while (i != 4) {
        random_ind = Math.floor(Math.random() * Math.floor(tracks_length));
        if (already_played[random_ind] == 0) {
            already_played[random_ind] = 1;
            four_random_ind[i] = random_ind;
            ++i;
        }
    }

    play_index = Math.floor(Math.random() * Math.floor(4));

    // Song ID's for the four options
    first_choice_id = tracks_info[four_random_ind[0]][0];
    first_choice_name = tracks_info[four_random_ind[0]][1];
    second_choice_id = tracks_info[four_random_ind[1]][0];
    second_choice_name = tracks_info[four_random_ind[1]][1];
    third_choice_id = tracks_info[four_random_ind[2]][0];
    third_choice_name = tracks_info[four_random_ind[2]][1];
    fourth_choice_id = tracks_info[four_random_ind[3]][0];
    fourth_choice_name = tracks_info[four_random_ind[3]][1];

    four_songs = [[first_choice_id, first_choice_name], [second_choice_id, second_choice_name],
                 [third_choice_id, third_choice_name], [fourth_choice_id, fourth_choice_name]];

    play(four_songs[play_index][0]);
    answer = four_songs[play_index][1];

    console.log("Already played array: " + already_played);
    console.log("Four random indices: " + four_random_ind);
    console.log("Playing index " + play_index + " of the random four.");
    console.log("Currently playing: " + answer);

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

function chooseAnswer(choice_num) {
    if (answer == document.getElementById(choice_num).innerHTML) {
        console.log("Correct!");
        ++score;
        document.getElementById("score").innerHTML = "Score: " + score;
        startGame();
    } else {
        alert("Wrong! Choose again!");
    }
}

