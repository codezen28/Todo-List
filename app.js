const express=require("express");  // Here we are supposed to create a node app for which we will require express 
const https=require("https");      // To make https request to other server 
const mongoose=require("mongoose");
const bodyParser=require("body-parser");    // This package is used to fetch the input through post request
//+const date=require(__dirname+"/date.js")
const app=express();     // Creating the express app

app.set("view engine", "ejs");               // This will tell express to use ejs as its view engine

let workItems=[];
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));             // To use the static files and folders

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const itemsSchema=new mongoose.Schema({
    name:String                             // Creating the schema of Items
});

const Item=mongoose.model("Item", itemsSchema);       // Creating the model 

const item1=new Item({
    name:"Welcome to our ToDo List"
});

const item2=new Item({
    name:"Hit the + to add new item"
});

const item3= new Item({
    name:"<-- Hit this to delete item"
});

const defaultItems={item1,item2,item3};

// Item.insertMany(defaultItems,function(err,docs){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("Successful");
//     }
// });

await Item.insertMany(defaultItems).then(
    (result) => {
       console.log("Items added succesfully");
    }
  ).catch(
    (err) => {
       console.log(err);
    }
  );

app.get("/",function(req,res){
    let today=new Date();
    let currentDay=today.getDay();
    
   
   let options={
    weekday:"long",
    day:"numeric",
    month :"long"
   };
   let day=today.toLocaleDateString("en-US",options);
res.render("list",{listTitle:day, newListItems:items});
});


app.post("/",function(req,res){
   let item= req.body.newItem;
 
 
 if(req.body.list==="Work"){
    workItems.push(item);
    res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
})

app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",newListItems:workItems});
});

// app.post("/work",function(req,res){
//     let item=req.body.newItem;
   
// });



app.listen(3000,function(){
    console.log("Port is ready");
});