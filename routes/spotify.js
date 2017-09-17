var express = require('express');
var request = require("request");
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var router = express.Router();

//let's grab all the spotify calls
let SpotifyCalls = require('../spotifyApi.js');

//let's grab the spotify access keys
let keys = {
  clientId : 'ce833ef1272046489c5cb86af277d9c0',
  clientSecret : '714ba0785d9b41d3828a7ad30c782d52'
}

//the scopes that are availabe from spotify.
let scopes = "playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private streaming user-follow-modify user-follow-read user-library-read user-library-modify user-read-private user-read-birthdate user-read-email user-top-read user-read-recently-played";
let redirect_uri = "http://localhost:4000/spotify/callback";

//spotify auth key
let stateKey = 'spotify_auth_state';

//the spotify url
let authString = 'https://accounts.spotify.com/authorize' + '?response_type=code' + '&state=' + stateKey + '&client_id=' + keys.clientId + (scopes ? '&scope=' + encodeURIComponent(scopes) : '') + '&redirect_uri=' + encodeURIComponent(redirect_uri);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Spotify Login Page' });
});

router.get('/login', function (req, res, next) {

  //starts the spotify authenication
  res.redirect(authString);
});

router.get('/callback', function (req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  res.clearCookie(stateKey);
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(keys.clientId + ':' + keys.clientSecret).toString('base64'))
    },
    json: true
  };

  /**
   * [description]
   * @param  {[type]} error    [description]
   * @param  {[type]} response [description]
   * @param  {[type]} body)    {                   if (!error && response.statusCode [description]
   * @param  {[type]} json:    true                                                   };                      initSpotifyCalls(body.access_token);                        request.get(options, function(error, response, body) {                console.log(body);            });                        res.redirect('/spotify/#' +                querystring.stringify({                    access_token: access_token,                    refresh_token: refresh_token                }) [description]
   * @return {[type]}          [description]
   */
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {

      var access_token = body.access_token,
        refresh_token = body.refresh_token;

      var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      initSpotifyCalls(body.access_token);

      // use the access token to access the Spotify Web API
      request.get(options, function (error, response, body) {
        console.log(body);
      });

      // we can also pass the token to the browser to make requests from there
      res.redirect('/spotify/#' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        }));
    } else {
      res.redirect('/spotify/#' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    }
  });

});

router.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

let initSpotifyCalls = function(access_token) {
  console.log("Inside the spotify init call");

  // SpotifyCalls.Calls.getMe(access_token, function(response) {
  //     console.log(response);
  // });
  // 
  // SpotifyCalls.Calls.usersCurrentSong(access_token, function(response) {
  //     console.log(response);
  // });


  var tracks = [];
  // SpotifyCalls.Calls.getUserSavedTracks('', access_token, function(response) {

  //     if (eventSender !== null)
  //         eventSender.emit('savedTracks', { data: response });
  // });

  SpotifyCalls.Calls.usersRecentlyPlayed('', access_token, function(response) {

    console.log(response);
  });
};

module.exports = router;