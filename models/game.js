require('dotenv').config();

const mongoose = require("mongoose");

const mongoURL = process.env.MONGO_URL;


mongoose.connect(mongoURL)
    .then(() => {
        console.log("db connected");
    })
    .catch((error) => {
        console.error("db connection error : ",error);
    });


const GameSchema = new mongoose.Schema({
    roomID: Number,
    player1Name: String,
    player2Name: String,
    totalRound : Number,
    player1Move: String,
    player2Move: String,
});


const Game = mongoose.model("UserDetails", GameSchema);


module.exports = Game;
