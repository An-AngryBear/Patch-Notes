let express = require('express');
let app = express();
let request = require('request');

app.get('/steam/:appid/:steamkey', function(httpRequest, httpResponse) {
    let url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/' +
        'v0001/?key=' + httpRequest.params.steamkey + '&vanityurl=' + httpRequest.params.appid;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        console.log(steamHttpBody);
        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(steamHttpBody);
    });
});

let port = 4000;
let server = app.listen(port);
console.log('Listening on port ' + port);