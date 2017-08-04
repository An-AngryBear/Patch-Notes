let express = require('express');
let app = express();
let request = require('request');

app.get('/steam/:userurl/:steamkey', function(httpRequest, httpResponse) {
    let url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/' +
        'v0001/?key=' + httpRequest.params.steamkey + '&vanityurl=' + httpRequest.params.userurl;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        console.log(steamHttpBody);
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

app.get('/steam/game/:steamkey/:steamid', function(httpRequest, httpResponse) {
    let url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + httpRequest.params.steamkey +
        '&steamid=' + httpRequest.params.steamid + '&include_appinfo=1' + '&format=json'
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        console.log(steamHttpBody);
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

// http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=XXXXXXXXXXXXXXXXX&steamid=76561197960434622&format=json

app.get('/steam/gamenews/:appid', function(httpRequest, httpResponse) {
    let url = 'http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=' + httpRequest.params.appid +
        '&count=3&maxlength=300&format=json'
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        console.log(steamHttpBody);
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

 // http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=440&count=3&maxlength=300&format=json

let port = 4000;
let server = app.listen(port);
console.log('Listening on port ' + port);