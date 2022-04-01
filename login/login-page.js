(function() {


    let loginButton = document.getElementById('login_button');
    
    loginButton.addEventListener('click', function(event) {
        login(function(accessToken) {
            getUserData(accessToken)
                .then(function(response) {
                    resultsPlaceholder.innerHTML = template(response);
                });
            });
    });
    
    function login(callback) {
        var CLIENT_ID = 'c73c11f33ea4410db54b8afefecca3ef';
        var REDIRECT_URI = 'https://huynheddie.github.io/search/search.html';
        // var REDIRECT_URI = 'https://eddie100971.github.io/quizifyPublic/search/search.html';
        var scopes = "user-read-birthdate user-read-private user-modify-playback-state user-top-read";
        function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
              '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=token' +
              '&show_dialog=true';
        }
        
        var url = getLoginURL([
            'user-read-email',
            'user-read-private',
            'streaming',
            'user-top-read'
        ]);
        
        window.addEventListener("message", function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                callback(hash.access_token);
            }
        }, false);

        var w = window.location.href = url;          
        } 
    
  })();