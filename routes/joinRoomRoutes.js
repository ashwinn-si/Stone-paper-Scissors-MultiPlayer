const express = require("express");

const router = express.Router();

const Game = require("../models/game");

const mongoose = require("mongoose");

const timeToAddFunction = require("../public/scripts/extraTimeAdderFunction");

const getSecondFunction = require("../public/scripts/getSecondFunction");

let sharedState = {
    databaseID : null
}

let player2Name = "";

let stTime = null;

router.post("/player-name-page", (req, res) => {
    res.render("player-name-page");
});

router.get("/render/player-name-page",(req,res)=>{
    const buttonContent = {
        content: "JoinRoom",
        location: "/joinRoom/room-id-enter-page"
    };
    res.render("player-name-page", { "buttonContent":buttonContent });
})

router.post("/room-id-enter-page",(req,res)=>{

   player2Name= req.body.player2Name;
   res.render("room-id-enter-page",{"ErrorFlag":false});
})

router.get("/render/room-id-enter-page",(req,res)=>{
    res.render("room-id-enter-page",{
        "ErrorFlag":false,
    })
})

router.post("/room-id-check", async (req, res) => {
    let roomID = parseInt(req.body.roomID, 10);
    const currGame = await Game.find({ roomID: roomID });

    if (currGame.length === 1) {
        sharedState.databaseID = currGame[0]._id;

        // Ensure sharedState.databaseID is valid
        if (!mongoose.Types.ObjectId.isValid(sharedState.databaseID)) {
            return res.status(400).json({ error: "Invalid sharedState.databaseID" });
        }

        await Game.findByIdAndUpdate(sharedState.databaseID, { player2Name: player2Name });
        res.status(200).json({ redirectTo: "/joinRoom/render/player-waiting-page" });
    } else {
        res.status(404).json({ error: "Room not found" });
    }
});

router.get("/render/player-waiting-page", async(req, res) => {
    const currGame = await Game.findById(sharedState.databaseID);
    const playerName = [currGame.player2Name, currGame.player1Name];
    console.log("player 2 time")
    console.log(getSecondFunction())
    res.render("player-waiting-page", {
        RoomID: currGame.roomID,
        playerName: playerName,
        loaderFlag: false,
        startButtonFlag: false,
    });
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.get("/game-start-check", async (req, res) => {
    let flag = true;
    if(stTime == null){
        console.log("start game function")
        console.log(getSecondFunction());
        stTime = getSecondFunction();
        flag = false;
    }
    const savedGame = await Game.findById(sharedState.databaseID);

    if (savedGame.gameStart === "no") {
        stTime = getSecondFunction();
        return res.status(404).json({ error: "Game has not started" });
        
    }
    if(flag){
        
        await delay(5000-timeToAddFunction(stTime));
        console.log(getSecondFunction());
        res.status(200).json({ success: true, message: "Game has started" });
    }
    
    
});

module.exports = {router,sharedState};
