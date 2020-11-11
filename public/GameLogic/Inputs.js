//--INPUTS--//

//--Design pattern--//
//--OBSERVERS--//
/*
using observers = //--OB--//
allow you to use the same command to send it to the sever side
with basically 0 inpact to the code

for example: 
const KeyBoardListener = createKeyBoardListener() //client
const  network = createNetwork() //server
KeyBoardListener.subscribe(game.movePlayer)
KeyBoardListener.subscribe(network.Update)
*/

function createkeyboardListener(document) {

    //Observers (list of functions)
    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId;
    }

    //store functions to the observer list (array) in the obj "state"
    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function unsubscribeAll(observerFunction) {
        state.observers = []
    }
    
    //it send the command to all the observer-Functions and executes them depending on the command-inputs.
    //for example, if the inputs are {keyPressed} and {playerId} the function "movePlayer()" will be executed.
    function notifyAll(command) {
        console.log(`notifying ${state.observers.length} observers`);

        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    //-------------------------Inputs

    //add Event Listener
    document.addEventListener('keydown', handlekeydown);

    //handle keydown
    function handlekeydown(event) {
        let keyPressed = event.key;        
        if(keyPressed === " ") {
            keyPressed = "Space";
        }
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }
        //send commad to observers
        notifyAll(command);
    }

    return {
        subscribe,
        unsubscribeAll,
        registerPlayerId
    }   
}

export default createkeyboardListener;