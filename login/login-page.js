(function() {

    let loginButton = document.getElementById('login_button');
    // let resultsPlaceholder = document.getElementById('result');
      
    loginButton.addEventListener('click', function(event) {
        console.log("Button clicked.");
        login(function(accessToken) {
            getUserData(accessToken)
                .then(function(response) {
                    template.body.style.backgroundColor = "red";
                    resultsPlaceholder.innerHTML = template(response);
                });
            });
    });
      
    function login(callback) {
        var CLIENT_ID = 'c73c11f33ea4410db54b8afefecca3ef';
        var REDIRECT_URI = 'http://127.0.0.1:5500/search/search.html';
        function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
              '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=token';
            //   '&show_dialog=true';
        }
        
        var url = getLoginURL([
            'user-read-email',
            'user-read-private',
            'streaming'
        ]);
        
        var width = 450,
            height = 730,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2);
    
        window.addEventListener("message", function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                callback(hash.access_token);
            }
        }, false);
        
        window.location.href = url;           

        } 
    
  })();