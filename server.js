let express = require('express');
let app = express();
let request = require('request');

require('dotenv').config();

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/fbconfig', function(httpRequest, httpResponse) {
    httpResponse.send({
        apikey: process.env.FB_KEY,
        authDomain: process.env.AUTH_DOMAIN
    }).status(200);
});

app.get('/steam/:userurl', function(httpRequest, httpResponse) {
    console.log(httpRequest.params.userurl);
    let url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/' +
        'v0001/?key=' + process.env.STEAM_KEY + '&vanityurl=' + httpRequest.params.userurl;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

app.get('/game/:steamid', function(httpRequest, httpResponse) {
    let url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + process.env.STEAM_KEY +
        '&steamid=' + httpRequest.params.steamid + '&include_appinfo=1' + '&format=json'
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

app.get('/news/gamenews/:appid', function(httpRequest, httpResponse) {
    console.log("news", httpRequest.params.appid);
    let url = `http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${httpRequest.params.appid}&count=30&format=json`
    request(url, function(error, steamHttpResponse, steamHttpBody) {
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

let server = app.listen(process.env.PORT || 4000);
console.log('Listening on port ' + process.env.PORT || 4000);