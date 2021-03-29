//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let items = ["Cook food", "Buy Food", "Pick up Justin"];
let workItems = [];

app.get("/", function(req, res){
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
let day = today.toLocaleDateString("en-US", options);

  res.render("list", {listTitle:day, newListItem: items});
});


app.post("/", function(req, res){
  let item = req.body.newItem;
  console.log(req.body);
  if (req.body.list ==="work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }


});

app.get("/work", function(req,res){
  res.render("list", {listTitle:"work List", newListItem:workItems});
});



app.listen(3000, function(){
  console.log("Server started on port 3000");
});
