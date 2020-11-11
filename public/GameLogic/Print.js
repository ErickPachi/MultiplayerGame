//--Change Canvas' Size depending on the screen size--//
export function setupScreen(canvas, game) {
    const { canvas: {width, height, pixelsPerFields} } = game.state
    canvas.width = width * pixelsPerFields;
    canvas.height = height * pixelsPerFields;
}
//--Print--//
export default function renderScreen(canvas, game, requestAnimationFrame, currentPlayerId, scoreTable, FruitColor, PlayersColor, AllowPColors) {
    const context = canvas.getContext('2d');

    //Clear Canvas
        context.fillStyle = "white";
        const { canvas: { width, height, pixelsPerFields }} = game.state
        context.clearRect(0, 0, width*pixelsPerFields, height*pixelsPerFields)

        //Print Players
        for (const playerId in game.state.players) {
            const player = game.state.players[playerId];
            const isCurrentPlayer = false;
            drawPlayer(context, player, game, isCurrentPlayer, PlayersColor, AllowPColors);
        }

        //Print Fruits
        for (const fruitId in game.state.fruits) {
            const fruit = game.state.fruits[fruitId];
            drawFruit(context, fruit, game, FruitColor);
        }

        const currentPlayer = game.state.players[currentPlayerId];

        if(currentPlayer) {
            const isCurrentPlayer = true;
            drawPlayer(context, currentPlayer, game, isCurrentPlayer);
        }

        //update score
        updateScoreTable(scoreTable, game, currentPlayerId);

        //Call Back
        requestAnimationFrame(() => {
            renderScreen(canvas, game, requestAnimationFrame, currentPlayerId, scoreTable, FruitColor, PlayersColor, AllowPColors)});
   }



   function drawPlayer(screenContext, player, game, isCurrentPlayer, PlayersColor, AllowPColors) {
    const { canvas: { pixelsPerFields }} = game.state
    
    let opacity = 0.9;
    let eyeAndMouthColors = 'white'
    let faceColor =  PlayersColor;

    if (AllowPColors) {
        opacity = 0.7;
        faceColor = player.color;
    }

    if (isCurrentPlayer) {
        opacity = 0.9;
        faceColor = player.color;
    }

    if (faceColor === "#ffffff") {
        eyeAndMouthColors = "#000000"
    }
    let { x, y } = player;
    x *= pixelsPerFields;
    y *= pixelsPerFields;

    // Draw face
    screenContext.globalAlpha = opacity;
    screenContext.fillStyle = faceColor;
    screenContext.fillRect(x, y, pixelsPerFields, pixelsPerFields)

    // Draw eyes
    screenContext.fillStyle = eyeAndMouthColors
    screenContext.fillRect(x+2,y+3,1,1);
    screenContext.fillRect(x+6,y+3,1,1);
    // Draw mouth
    screenContext.fillRect(x+2,y+7,5,1);
    screenContext.fillRect(x+1,y+6,1,1);
    screenContext.fillRect(x+7,y+6,1,1);
}

function drawFruit(screenContext, fruit, game, FruitColor) {
    const { canvas: { pixelsPerFields }} = game.state
    screenContext.globalAlpha = 1
    
    let { x, y } = fruit;
    x *= pixelsPerFields;
    y *= pixelsPerFields;
    
    // Draw strawberry body
    screenContext.fillStyle = FruitColor;
    screenContext.fillRect(x, y+2, 1, 3);
    screenContext.fillRect(x+8, y+2, 1, 3);

    screenContext.fillRect(x+1, y+1, 1, 5);
    screenContext.fillRect(x+7, y+1, 1, 5);

    screenContext.fillRect(x+2, y+1, 1, 6);
    screenContext.fillRect(x+6, y+1, 1, 6);
    
    screenContext.fillRect(x+3, y+2, 1, 6);
    screenContext.fillRect(x+5, y+2, 1, 6);

    screenContext.fillRect(x+4, y+3, 1, 6);
 
    // Draw green leaf
    screenContext.fillStyle = '#00a933';
    screenContext.fillRect(x+2,y,5,1);
    screenContext.fillRect(x+3,y+1,3,1);
    screenContext.fillRect(x+4,y+2,1,1);
    
}


   //----------------------------------------------------------------------score table
   function updateScoreTable(scoreTable, game, currentPlayerId) {
    const maxResults = 10

    let scoreTableInnerHTML = `
        <tr class="header">
            <td>Top 10 Players</td>
            <td>Points</td>
        </tr>
    `

    const playersArray = []

    for (let socketId in game.state.players) {
        const player = game.state.players[socketId]
        playersArray.push({
            playerId: socketId,
            username: player.username,
            score: player.score,
        })
    }
    
    const playersSortedByScore = playersArray.sort( (first, second) => {
        if (first.score < second.score) {
            return 1
        }

        if (first.score > second.score) {
            return -1
        }

        return 0
    })

    const topScorePlayers = playersSortedByScore.slice(0, maxResults);

    scoreTableInnerHTML = topScorePlayers.reduce((stringFormed, player) => {
        return stringFormed + `
            <tr ${player.playerId === currentPlayerId ? 'class="current-player"' : ''}>
                <td>${player.playerId === currentPlayerId ? '(Me) ' + player.username : player.username}</td>
                <td>${player.score}</td>
            </tr>
        `
    }, scoreTableInnerHTML);

    document.getElementById("score-table").innerHTML = scoreTableInnerHTML;
}