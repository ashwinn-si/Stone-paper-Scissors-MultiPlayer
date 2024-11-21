const express = require("express")

const router = express.Router();

const Game = require("../models/game");

const resultFinder = require("../public/scripts/resultFinder");

const resultTextFinder = require("../public/scripts/resultMessageFinder");

const getSecondFunction = require("../public/scripts/getSecondFunction");

const { sharedState } = require("./createRoomRoutes");

let winnerName = "";
let gameEndedFlag = false;
let delayFlag = true;
let player1Status = "";


router.post("/player-move-page",async(req,res)=>{
    await Game.findByIdAndUpdate(sharedState.databaseID,{ 
        gameStart: "yes"
    }
    );
    currGame = Game.findById(sharedState.databaseID);
    res.render("move-selection-page",{
        player_1_name:currGame.player1Name,
        player_2_name:currGame.player2Name,
        player_1_score:currGame.player1Score,
        player_2_score:currGame.player2Score,
        curr_round:currGame.currRound,
        player1Flag:true
    })
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.get("/render/player-move-page",async (req,res)=>{
    if(delayFlag){
        await delay(4000);
        delayFlag= false;
    }
    let currGame = await Game.findById(sharedState.databaseID);
    res.render("move-selection-page",{
        player_1_name:currGame.player1Name,
        player_2_name:currGame.player2Name,
        player_1_score:currGame.player1Score,
        player_2_score:currGame.player2Score,
        curr_round:currGame.currRound,
        player1Flag:true  
    })
})


router.post("/player-move-sender", async (req, res) => {
    // Update player1's move in the database
    let currGame = await Game.findByIdAndUpdate(sharedState.databaseID, {
        player1Move: req.body.player1Move,
    });

    await delay(3000);
    // Fetch the updated game details
    currGame = await Game.findById(sharedState.databaseID);

    // Determine the result for player1
    player1Status = await resultFinder(currGame.player1Move, currGame.player2Move);

    // Update scores based on the result
    if (player1Status === "win") {
        await Game.findByIdAndUpdate(sharedState.databaseID,{
            player1Score : currGame.player1Score+1
        })
    }else if(player1Status === "loss"){
        await Game.findByIdAndUpdate(sharedState.databaseID,{
            player2Score : currGame.player2Score+1
        })
    }

    currGame = await Game.findById(sharedState.databaseID);

    // Generate the result text
    const result_text = await resultTextFinder(player1Status, currGame.player1Name, currGame.player2Name);

    if(currGame.player2Score == currGame.totalRounds){
        winnerName = currGame.player2Name;
        console.log("hello");
        gameEndedFlag = true;
    }else if(currGame.player1Score == currGame.totalRounds){
        gameEndedFlag=true;
        winnerName = currGame.player1Name;
    }

    // Render the updated page
    res.render("player-move-display-page", {
        your_name:  currGame.player1Name,
        opp_name:  currGame.player2Name,
        your_score:  currGame.player1Score,
        opp_score:  currGame.player2Score,
        your_move:  currGame.player1Move,
        opp_move:  currGame.player2Move,
        result_text: player1Status,
        winner_text: result_text,
        player1Flag: true,
        GameEndedFlag:gameEndedFlag,
    });

});


router.get("/render/player-move-display-page",async (req,res)=>{
    const currGame = await Game.findById(sharedState.databaseID);

    const result_text = await resultTextFinder(player1Status, currGame.player1Name, currGame.player2Name);
    
    res.render("player-move-display-page", {
        your_name:  currGame.player1Name,
        opp_name:  currGame.player2Name,
        your_score:  currGame.player1Score,
        opp_score:  currGame.player2Score,
        your_move:  currGame.player1Move,
        opp_move:  currGame.player2Move,
        result_text: player1Status,
        winner_text: result_text,
        player1Flag: true,
        GameEndedFlag:gameEndedFlag,
    });
})

router.get("/render/game-ended",async(req,res)=>{

    allDetails.player1Score=0;
    allDetails.player2Score =0;
    allDetails.currRound = 1;
    allDetails.player1Status="empty";
    allDetails.player2Status="empty";
    gameEndedFlag=false;
    await Game.findByIdAndUpdate(sharedState.databaseID,{
        roomID:0
    })

    res.render("game-ended-page",{
        winner:winnerName
    });
})


module.exports = router;