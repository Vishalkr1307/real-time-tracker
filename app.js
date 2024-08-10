// Server-side code (server.js)

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const socketio = require("socket.io");
const path = require("path");

const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, data });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnect", socket.id);
        console.log(`User disconnected: ${socket.id}`);
    });
});

app.get("/", async (req, res) => {
    return res.status(200).render("index");
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});
