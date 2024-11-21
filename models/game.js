const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://root:n0SFsK3VoT2p2Box@detailscluster.hu83z.mongodb.net/Stone-Paper-Scissor?retryWrites=true&w=majority&appName=DetailsCluster";


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
    gameStart: String, //tells if the game is start or not
    currRound : Number, 
    player1Score: Number,
    player2Score:Number, 
    player1Move: String,
    player2Move: String,
});


const Game = mongoose.model("testing", GameSchema);


module.exports = Game;
