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
        var CLIENT_ID = '231434524369420f8d46d7cd069e8aeb';
        var REDIRECT_URI = 'https://eddie100971.github.io/search/search.html';
        // var REDIRECT_URI = 'http://localhost:8888/callback';
        // var REDIRECT_URI = 'https://huynheddie.github.io/search/search.html';
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