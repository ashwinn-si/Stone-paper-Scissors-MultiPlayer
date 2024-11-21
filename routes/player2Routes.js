const express = require("express")

const router = express.Router();

const resultFinder = require("../public/scripts/resultFinder");

const resultTextFinder = require("../public/scripts/resultMessageFinder");

const Game = require("../models/game");

const { sharedState } = require("./joinRoomRoutes");

let winnerName = "";
let gameEndedFlag = false;
let player2Status = "";

router.get("/render/player-move-page", async (req,res)=>{
    
    const currGame = await Game.findById(sharedState.databaseID);
    res.render("move-selection-page",{
        player_1_name:currGame.player1Name,
        player_2_name:currGame.player2Name,
        player_1_score:currGame.player1Score,
        player_2_score:currGame.player2Score,
        curr_round:currGame.currRound,
        player1Flag:false
    })
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.post("/player-move-sender",async (req,res)=>{
    await Game.findByIdAndUpdate(sharedState.databaseID,{
        player2Move:req.body.player2Move
    })
    
    await delay(3000)

    let currGame = await Game.findById(sharedState.databaseID);
    
    player2Status = await resultFinder(currGame.player2Move,currGame.player1Move);

    
    let result_text = await resultTextFinder(player2Status,currGame.player2Name,currGame.player1Name);

    

    if(currGame.player2Score == currGame.totalRounds){
        winnerName = currGame.player2Name;
        gameEndedFlag = true;
    }else if(currGame.player1Score == currGame.totalRounds){
        gameEndedFlag=true;
        winnerName = currGame.player1Name;
    }

    res.render("player-move-display-page", {
        your_name:  currGame.player2Name,
        opp_name:  currGame.player1Name,
        your_score:  currGame.player2Score,
        opp_score:  currGame.player1Score,
        your_move:  currGame.player2Move,
        opp_move:  currGame.player1Move,
        result_text: player2Status,
        winner_text: result_text,
        player1Flag: false,
        GameEndedFlag:gameEndedFlag,
    });
})

router.get("/render/player-move-display-page",async (req,res)=>{
    let currGame = await Game.findById(sharedState.databaseID);

    let result_text = await resultTextFinder(player2Status,currGame.player2Name,currGame.player1Name);

    res.render("player-move-display-page", {
        your_name:  currGame.player2Name,
        opp_name:  currGame.player1Name,
        your_score:  currGame.player2Score,
        opp_score:  currGame.player1Score,
        your_move:  currGame.player2Move,
        opp_move:  currGame.player1Move,
        result_text: player2Status,
        winner_text: result_text,
        player1Flag: false,
        GameEndedFlag:gameEndedFlag,
    });

    await Game.findByIdAndUpdate(sharedState.databaseID,{
        currRound : currGame.currRound+1
    })
})

router.get("/render/game-ended",async(req,res)=>{
    allDetails.player1Score=0;
    allDetails.player2Score =0;
    allDetails.currRound = 1;
    allDetails.player1Status="empty";
    allDetails.player2Status="empty";
    gameEndedFlag=false;
    await Game.findByIdAndUpdate(allDetails.sharedState.databaseID,{
        roomID:0
    })
    res.render("game-ended-page",{
        winner:winnerName
    });
})

module.exports = router;