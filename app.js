const express = require("express");
const connectDB = require("./db");
require("dotenv").config();
const http = require("http");
const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("hello world@")
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
