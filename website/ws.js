const express = require("express");
const app = express();
const port = 8000;

app.use(express.static(__dirname + "/"));

app.get("/", function(req, res) {
  console.log(__dirname);
  res.sendFile(__dirname + "/" + "createEvent.html");
});

app.get("/bet", function(req, res) {
  console.log(__dirname);
  res.sendFile(__dirname + "/" + "bet.html");
});

app.get("/score", function(req, res) {
  console.log(__dirname);
  res.sendFile(__dirname + "/" + "score.html");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
