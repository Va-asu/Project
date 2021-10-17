const express=require("express");
const bodyparser=require("body-parser");
const axios = require('axios');
const mongoose=require("mongoose");

const app=express();
app.use(bodyparser.urlencoded({extended:true}));



mongoose.connect("mongodb+srv://Vasudev:vasu123@cluster0.ad0pn.mongodb.net/backendDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const con=mongoose.connection;
con.on('open',function(){
    console.log("connected to database");
});

const devices=new mongoose.Schema({
    deviceName:String,
    Locations:String
});

const Data=mongoose.model("Data",devices);

app.use(express.json());

var finalObject=[];

app.get("/",function(req,res){
    res.send("please after / use devive name either MI or samsung");
})

app.get("/:name",function(req,res){
    
    Data.find({deviceName:req.params.name}).exec()
    .then((result) => {
        var loc=[];
   
        var i=result.length-1,count=0;
       while(i>=0&&count<=50){
           loc[i]=result[i].Locations;
           axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
               params:{
                   address:loc[i],
                   key:'AIzaSyA5bwbEsAOUMOI4RK2zXcIayG4vjuQSpcw'
               }
           }).then(function(response){
               var add=response.data.results[0].formatted_address;
               var lat=response.data.results[0].geometry.location.lat;
               var lng=response.data.results[0].geometry.location.lng;
               let obj={};
               obj.add=String(add);
               obj.Location=[lat,lng];
               finalObject.push(obj);
           }).catch(function(error){
               console.log(error);
           })
           count++;
           i--;
       }
    })
    var arr=finalObject;
    finalObject=[];
    console.log(arr);
    //res.write("locations of "+req.params.name+" is :- "+arr);
     res.json(arr);
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
    console.log("server running...");
});