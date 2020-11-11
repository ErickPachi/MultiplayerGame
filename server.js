import { Socket } from 'dgram';
import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import creategame from "./public/GameLogic/Game.js";

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mypath = path.join(__dirname, './public');

const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

app.use(bodyParser.urlencoded({
    extended: false
 }));

app.use(express.static('public'));


//-----------------------------------------//
//               http get/post             //
//-----------------------------------------//

//----home page
app.get('/', function(req, res){
    res.redirect('/HomePage');
});
app.get('/HomePage', function(req, res){
    res.sendFile(mypath + '/Index.html');
});

//--------------The Game page
app.get('/Game', function(req, res){
    res.sendFile(mypath + '/GamePage.html');
});

//-----------Configuration page
app.get('/Configuration', function(req, res){
    res.sendFile(mypath + '/Configuration.html');
});

//--------------Leaderboard page
app.get('/Leaderboard', function(req, res){
    res.sendFile(mypath + '/Leaderboard.html');
});

//--------------Error page
app.get('*', function(req, res){
    res.status(404).sendFile(mypath + '/ErrorPage.html');
  });


//-----------------------------------------//
//               game backend              //
//-----------------------------------------//

    const game = creategame();    

    //observers
    game.subscribe((command) => {
        console.log(`> Emiting ${command.type}`);
        sockets.emit(command.type, command);
    });

    sockets.on('connection', (socket) => {
        const playerId = socket.id;
        console.log(`> Player connected on Sever with id: ${playerId}`);
        
        game.addPlayer({playerId: playerId});
        console.log(game.state);

        //--------------------------------------------------------------------------------------- set username and color
        socket.on('Update_player_details', (player_details) => {
            const username = player_details.username;
            var players = game.state.players;
            var keys = Object.keys(players);
            var usernameList = [];
            var count = 1;

            //put all usernames in an array
            for(var i = 0; i < keys.length; i++) {
                var name = game.state.players[keys[i]].username;
                usernameList.push(name);
            }

            //check if there is any repeated username
            //a number will be added after the repeated usernames ("username", "username 2")
            while (usernameList.includes(player_details.username)) {
                count++;
                player_details.username = username + " " + count;
            }

            game.addPlayer(player_details);
            console.log(game.state);
        });
        

        //send the game state to the client side
        socket.emit('setup', game.state);

        var keys = Object.keys(game.state.players);
        var Number_of_Playes = keys.length;
        if (Number_of_Playes === 1) {
            game.start();
        }

        //remove player after disconect
        socket.on('disconnect', () => {
            game.removePlayer({ playerId: playerId });
            console.log(`> Player ${playerId} disconnected from the Sever`);
            //stop game if no one id playing it
            var keys = Object.keys(game.state.players);
            var Number_of_Playes = keys.length;
            if (Number_of_Playes < 1) {
                game.stop();
            }
        });

        //move players
        socket.on('move-player', (command) => {
            command.playerId = playerId;
            command.type = 'move-player';

            game.movePlayer(command); 
        });

        //remove player after disconect
        socket.on('removePlayer', (id) => {
            game.removePlayer({ playerId: id });
            var keys = Object.keys(game.state.players);
            var Number_of_Playes = keys.length;
            if (Number_of_Playes < 1) {
                game.stop();
            }
        });

        //Simple Admin Configuration Login
        socket.on('AdminLogin', (command) => {
            if (command.username === "erick" && command.password === "erick123") {
                socket.emit('AllowLogin');
            }
        });
    });

server.listen(port, () => {
    console.log(`> The App is running`);
});