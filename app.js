const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");

const app=express();
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/backendDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const con=mongoose.connection;
con.on('open',function(){
    console.log("connected to database");
});

const devices=new mongoose.Schema({
    deviceName:String,
    Location:String
});

const Data=mongoose.model("Data",devices);

app.use(Express.json());

app.get("/:name",function(req,res){
    Data.find({deviceName:req.params.name}).exec()
    .then((result) => {
        var loc=[];
       for (let i =result.length-1;i>=0;i--) {
           loc[i]=result[i].Location;
       }
       res.json(loc); 
    })
})

app.listen(3000,function(req,res){
    console.log("running at 3000");
});