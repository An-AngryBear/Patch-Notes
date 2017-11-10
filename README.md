# Patch Notes

Patch Notes is an app for PC gamers, who would like the latest game updates or patch notes for their favorite Steam games in one convenient place.

## Technologies used

- AngularJS
- Firebase
- Node.js Proxy Server
- Express
- Sass
- Bootstrap
- Steam API
- Grunt


## Set up

- Using git, clone into your directory ```git@github.com:An-AngryBear/Patch-Notes.git```

- Run ```npm install``` to install dependencies

- get an API key from [Steam](https://steamcommunity.com/dev)

- create ```/app/values``` folder

- in this folder create files called ```fb-creds.js``` and ```steam-creds.js```

```fb-creds.js``` should contain:

    ```
    patchNotesApp.constant('FBCreds', {
	    key: *****FIREBASE KEY HERE*****,
	    authDomain: *****FIREBASE AUTH DOMAIN HERE*****
    });

    ```

```steam-creds.js``` should contain:

    ```
    patchNotesApp.constant('SteamCreds', {
	    key: *****STEAM API KEY HERE*****
    });

    ```

## To Run the App

- navigate to ```/lib``` and run ```grunt``` on the command line

- navigate to ```/server``` and run ```node server.js``` on the command line

- on the app's root directory run ```http-server``` and open localhost in your browser


