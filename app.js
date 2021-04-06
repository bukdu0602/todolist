//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// mongoose schema
const itemsSchema = new mongoose.Schema({
  name: String
});
// mongoose model
const Item = mongoose.model("Item", itemsSchema);
// mongoose create
const item1 = new Item({
  name: "Welcome to your todolist!",
});
const item2 = new Item({
  name: "Hit the + button to add a new item.",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

//mongoose schema 2
const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);


// when user get /

app.get("/", function(req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day = today.toLocaleDateString("en-US", options);

  Item.find(function(err, items) {
    if (items.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("success");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: day,
        newListItem: items
      });
    }
  });
});

//when
app.post("/", function(req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day = today.toLocaleDateString("en-US", options);

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item4 = new Item({
    name: itemName,
  });
  if (listName === day){
  item4.save();
  res.redirect("/");
} else {
   List.findOne({name: listName}, function(err, found){
     found.items.push(item4);
     console.log(found);
     console.log(found.items);
     found.save();
     res.redirect("/" + listName);
   });
}
  // let item = req.body.newItem;
  // let it = req.body.added;
  // console.log(req.body);
  // if (req.body.list === "work List") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else if (req.body.list2 === "hello") {
  //   newList.push(it);
  //   res.redirect("/finished");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete", function(req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day = today.toLocaleDateString("en-US", options);

  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if(listName === day){
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (err) {
        console.log("err");
      } else {
        console.log("succesfullly deleted from DB");
        res.redirect("/");
      }
    });
  }else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err) {
        res.redirect("/"+ listName);
      }
    }) ;
  }

});

app.get("/:parameter", function(req, res) {
  const customListName = _.capitalize(req.params.parameter);
List.findOne({name: customListName}, function(err, found){
  // console.log(found);
if (found){
  res.render("list", {
    listTitle: found.name,
    newListItem: found.items
  });
}  else{
  const list = new List({
    name: customListName,
    items: defaultItems
  });
  list.save();
  res.redirect("/" + customListName);
}
});

});

app.get("/about", function(req, res) {
  res.render("about");
});
//
// app.get("/finished", function(req, res) {
//   res.render("done", {
//     a: items,
//     b: workItems,
//     c: "hello",
//     d: newList
//   });
// });



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
