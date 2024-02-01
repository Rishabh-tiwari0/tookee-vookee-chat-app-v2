const express = require("express");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT;
const userRoutes = require("./routes/userRouter.js");
const { notFound, errorHandler } = require("./middleware/errorhandles.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// enabling json
app.use(express.json({ limit: "50mb" }));

// enabling cors
app.use(cors());

// connecting to database
connectDB();

//router

app.use("/", userRoutes);
app.use("/chats", chatRoutes);
app.use("/message", messageRoutes);

// ------------------deployment code--------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("api is running prpoperly");
  });
}
// ------------------deployment code--------------------

// middle ware to handle uneligible page

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => console.log(`server running at ${PORT}`));
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
