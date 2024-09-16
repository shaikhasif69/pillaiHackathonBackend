// const connectDB = require("./db");
// require("dotenv").config();
// const port = process.env.PORT;
const port = 3000;
import http from "http";
import express from "express";
import { connectDB } from "./db.js";
import userRouter from "./routes/userRoutes.js";
import communityRouter from "./routes/communityRoutes.js";
import councilRoutes from "./routes/council.js";
import socketHandler from "./socket.js";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
connectDB();

app.use("/users", userRouter);
app.use("/build", communityRouter);
app.use("/council", councilRoutes);
app.get("/", (req, res) => {
  res.send(
    `aai ghala changes adhich sangat java  mala 18 parent backend end krycha aahe m on a mission to find a  girl`
  );
});
// Socket.io middleware and connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return next(new Error("Authentication error"));
    }
  } else {
    next(new Error("No token provided"));
  }
});

socketHandler(io);
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
