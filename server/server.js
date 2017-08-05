let express = require('express');
let app = express();
let request = require('request');

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/steam/:userurl/:steamkey', function(httpRequest, httpResponse) {
    console.log(httpRequest.params.userurl);
    let url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/' +
        'v0001/?key=' + httpRequest.params.steamkey + '&vanityurl=' + httpRequest.params.userurl;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

app.get('/game/:steamkey/:steamid', function(httpRequest, httpResponse) {
    let url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + httpRequest.params.steamkey +
        '&steamid=' + httpRequest.params.steamid + '&include_appinfo=1' + '&format=json'
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

app.get('/news/gamenews/:appid', function(httpRequest, httpResponse) {
    console.log("news", httpRequest.params.appid);
    let url = `http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${httpRequest.params.appid}&count=10&format=json`
    request(url, function(error, steamHttpResponse, steamHttpBody) {
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

let port = 4000;
let server = app.listen(port);
console.log('Listening on port ' + port);