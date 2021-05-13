const express = require("express");
const path = require("path");
const messages = [];
const users = [];
const app = express();

app.use(express.static(path.join(__dirname, "/client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/index.html"));
});

app.use((req, res) => {
  res.status(404).send("404 page not found...");
});

const server = app.listen(8000, () => {
  console.log("server is running on port: 8000");
});
