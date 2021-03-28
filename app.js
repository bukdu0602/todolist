//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
  let today = new Date();
  let currentDay = today.getDay();
  let daysinArray = ["Sunday", "Monday", "Tuesday", "Wedsneday", "Thursday", "Friday", "Saturday"];
  let newDay = daysinArray[currentDay];
  res.render("list", {kindOfDay:newDay});

});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
