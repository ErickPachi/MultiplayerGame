//
//--Game--//
//
export default function creategame() {
    const state = {
        players: {},
        fruits: {},
        Top10Players: {},
        canvas: { 
            width: 45,
            height: 25,
            pixelsPerFields: 9 }
    };

        //-----------------------------------------observers
        const observers = [];
        var FruitInterval;

        function start() {
            const fruitFrequency = 1000;
            FruitInterval = setInterval(addFruit, fruitFrequency);
        }

        function stop() {
             clearInterval(FruitInterval);
             RemoveAllFruits();
        }

        //store functions to the observer list (array) in the obj "state"
        function subscribe(observerFunction) {
            observers.push(observerFunction)
        }
        
        function notifyAll(command) {
            for (const observerFunction of observers) {
                observerFunction(command)
            }
        }

    //update state
    function setState(newState) {
        Object.assign(state, newState)
    }

    //--------------------------------------------------------------------------------------Players

    function addPlayer(command) {
        const playerId = command.playerId;
        const player_X = 'player_X' in command ? command.player_X : Math.floor(Math.random() * state.canvas.width);
        const player_Y = 'player_Y' in command ? command.player_Y : Math.floor(Math.random() * state.canvas.height);
        const username = 'username' in command && command.username !== null ? command.username : 'player';
        const color = 'color' in command && command.color !== null ? command.color : 'blue';
        const score = 'score' in command && command.score !== null ? command.score : 0;
        const highestscore = 'highestscore' in command && command.highestscore !== null ? command.highestscore : 0;

        
        state.players[playerId] = {
            x: player_X,
            y: player_Y,
            username: username,
            color: color,
            score: score,
            highestscore: highestscore,
        };

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            player_X: player_X,
            player_Y: player_Y,
            username: username,
            color: color,
            score: score,
            highestscore: highestscore,
        })
    }
    
    function removePlayer(command) {
        const playerId = command.playerId;
        if(playerId in state.players){
            settop10Players(playerId);
        }
        delete state.players[playerId];
        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    //--------------------------------------------------------------------------------------Fruits

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 100000000);
        const fruit_X = command ? command.fruit_X : Math.floor(Math.random() * state.canvas.width);
        const fruit_Y = command ? command.fruit_Y : Math.floor(Math.random() * state.canvas.width);

        state.fruits[fruitId] = {
            x: fruit_X,
            y: fruit_Y,
        };

        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            fruit_X: fruit_X,
            fruit_Y: fruit_Y,
        })
    }

    function removeFruit(command) {
        const fruitId = command.fruitId;
        delete state.fruits[fruitId];
        
        notifyAll({
            type: 'remove-fruit',
            fruitId: fruitId
        })
    }

    function RemoveAllFruits() {
        var keys = Object.keys(state.fruits);
        for (let index = 0; index < keys.length; index++) {
            let fruitId = [keys[index]];
            const command = { fruitId: fruitId }
            removeFruit(command);
        }
    }

    //-------------------------------------------------------------movePlayer
    function movePlayer (command) {
        const playerId = command.playerId;
        const player = state.players[playerId];
        const keyPressed = command.keyPressed;
        notifyAll(command);

        //define all acceptable keys/movements (list of movements functions)
        const acceptedMoves = {
            //-- Move Up
            ArrowUp(player) {
                if (player.y - 1 >= 0) { 
                    player.y = player.y - 1;
                }
            },
            //-- Move Down 
            ArrowDown(player) {
                if (player.y + 1 < state.canvas.height) {
                    player.y = player.y + 1;
                }
            },
            //-- Move Right
            ArrowRight(player) {
                if (player.x + 1 < state.canvas.width) {
                    player.x = player.x + 1;
                }
            },
            //-- Move Left
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {
                    player.x = player.x - 1;
                }
            },
        }

        //Since the functions have the same name as the possible inputs 
        //the function executed is based on the key that is pressed 
        const moveFunction = acceptedMoves[keyPressed];

        //check if the player and the key pressed  (function) are valid
        if(player && moveFunction){
            moveFunction(player);
            checkForFruitCollision(playerId);
        }
    }

    //---------------------------------------------------Collision
    function checkForFruitCollision(playerId) {
        const player = state.players[playerId];
        for (const fruitId in state.fruits) {
                const fruit = state.fruits[fruitId];
                
                //checks if the positions X/Y of the player and fruits are the same
                if (player.x === fruit.x && player.y === fruit.y) {
                removeFruit({ fruitId: fruitId });
                player.score += 1;
                if(player.score > player.highestscore) {
                    player.highestscore = player.score;
                }
            }
        }
    }


/*NEED TO FIND A WAY TO SAVE THIS AFTER EVERY GAME
 const GameScoreArray = JSON.parse(localStorage.getItem('GameHistory')) ? JSON.parse(localStorage.getItem('GameHistory')) : [];
            const gslength = GameScoreArray.length;
            console.log(GameScoreArray);
            console.log(gslength);
            if (gslength > 7) {
                const last = gslength - 1;
                delete GameScoreArray[last];
            }
            GameScoreArray.push(score)
            localStorage.setItem('GameHistory', JSON.stringify(GameScoreArray));
*/

    //---------------------------------------------------set top 10 Players
    function settop10Players(playerId) {
        const Top10Playerslist = state.Top10Players;
        const player = state.players[playerId];
        const username = player.username;
        const score = player.highestscore;
        const max = 10;

        let keys = Object.keys(Top10Playerslist);
        let Number_of_Playes = keys.length;
        if (Number_of_Playes >= max) {
            for (let index = 0; index < Number_of_Playes; index++) {
                let pscore = Top10Playerslist[keys[index]].score;
                //the score of the current player is higher than any of the other top 10 players
                if(score > pscore) {
                    //add player
                    state.Top10Players[playerId] = {
                        username: username,
                        score: score
                    };
                    // get the updated amount of players on the top 10
                    let keys2 = Object.keys(state.Top10Players);
                    let Updated_Playes = keys2.length;
                    //remove player if there are more the 10 player on the top ten
                    if (Updated_Playes > max) {
                        delete state.Top10Players[keys[index]];
                        //stop loop after a player is removed (avoid removing 2 or more players)
                        index = Number_of_Playes;
                    }
                } 
            }
        }
        else {
            //add player
            state.Top10Players[playerId] = {
                username: username,
                score: score
            };
        }
    }

    return {
        addPlayer,
        removePlayer,
        movePlayer,
        addFruit,
        removeFruit,
        state,
        setState,
        subscribe,
        start,
        stop,
    };
}