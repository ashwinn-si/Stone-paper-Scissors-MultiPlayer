const express = require("express");

const router = express.Router();

const Game = require("../models/game");

const timeToAddFunction = require("../public/scripts/extraTimeAdderFunction");

const getSecondFunction = require("../public/scripts/getSecondFunction");

let sharedState = {
    databaseID : null
}

let stTime = 0;

router.post("/player-name-page", (req, res) => {
    res.render("player-name-page");
});

router.get("/render/player-name-page", (req, res) => {
    const buttonContent = {
        content: "Create",
        location: "/createRoom/player-waiting-page"
    };
    res.render("player-name-page", { "buttonContent":buttonContent });
});

router.post("/player-waiting-page", async(req,res)=>{
    const currGame = new Game({
        player1Name : req.body.player1Name,
        roomID : req.body.roomID,
        player1Move : "empty",
        player2Move : "empty",
        player1Score : 0,
        player2Score: 0,
        currRound : 1,
        totalRound : parseInt(req.body.noRounds, 10),
        gameStart:"no",
    })
    await currGame.save().then(savedGame =>{
        sharedState.databaseID = savedGame._id;
    }).then(()=>{
        res.render("player-waiting-page");
    })
})

router.get("/render/player-waiting-page",async (req,res)=>{
    const currGame = await Game.findById(sharedState.databaseID).then((savedGame)=>{
        const playerName = [savedGame.player1Name];
        res.render("player-waiting-page",{ 
            "RoomID" : savedGame.roomID,
            "playerName" : playerName,
            "loaderFlag" : true,
            "startButtonFlag":true
        });
    })
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let flag = true;
router.get("/searching-player",async(req,res)=>{
    if(flag){
        console.log("player 1 searching st time :   ",getSecondFunction());
        stTime = getSecondFunction();
        flag = false;
    }
    const currGame = await Game.findById(sharedState.databaseID).then( async(savedGame) => {
        //404 -> player not found
        //200 -> player found
        if(savedGame.player2Name == undefined){// player2 not found
            res.sendStatus(404);
            stTime = getSecondFunction();
        }else{
            console.log("player 1 find time : ",getSecondFunction());
            console.log("player 1 delay time : ",timeToAddFunction(getSecondFunction(),stTime));
            await delay(5000-(timeToAddFunction(getSecondFunction(),stTime)));
            res.sendStatus(200);
        }
    })
})

router.get("/render/playerFound/player-waiting-page",async (req,res)=>{
    const currGame = await Game.findById(sharedState.databaseID)
    console.log("player 1 time")
    console.log(getSecondFunction());
    const playerName = [currGame.player1Name,currGame.player2Name];
    res.render("player-waiting-page",{ 
        "RoomID" : currGame.roomID,
        "playerName" : playerName,
        "loaderFlag" : false,
        "startButtonFlag":true
    });
})



module.exports = {router,sharedState};