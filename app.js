const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const uploadRoutes = require("./routes/uploadRoute");
const authRoutes = require("./routes/authRoute");
const { saveMessage } = require("./controllers/messageController");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust the origin as needed
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api", authRoutes);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("send_message", async (message) => {
    try {
      const savedMessage = await saveMessage(message);
      io.emit("receive_message", savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error_message", "Failed to save message");
    }
  });
});

if(process.env.NODE_ENV !== 'test'){
  const port = process.env.PORT || 9090;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = { app, server, io };
