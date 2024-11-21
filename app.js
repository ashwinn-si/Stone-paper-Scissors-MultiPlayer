const express = require("express");
const app = express();
const {router:createRoomRoutes , allDetails1} = require("./routes/createRoomRoutes");
const {router:joinRoomRoutes , allDetails2} = require("./routes/joinRoomRoutes");
const player1Routers = require("./routes/player1Routes");
const player2Routers = require("./routes/player2Routes");
const path = require("path");

let dbID = 0;
let playerName ="";
let GameID = 0;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("create-join-room-page");
});

app.use("/createRoom",createRoomRoutes);

app.use("/joinRoom",joinRoomRoutes);

app.use("/player1",player1Routers);

app.use("/player2",player2Routers);

app.get("/return-home",(req,res)=>{
    res.render("create-join-room-page")
})

app.listen(3000, () => {
    console.log("Server Started");
});
