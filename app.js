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

app.get("/:name",function(req,res){
    Data.find({deviceName:req.params.name}).exec()
    .then((result) => {
       // console.log(result);
        var loc=[];
        let finalObject=[];
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
               //console.log(obj);
               finalObject.push(obj);
               console.log(finalObject);
           }).catch(function(error){
               console.log(error);
           })
           count++;
           i--;
       }
      
       res.json(finalObject);
    })
})

app.listen(3000,function(req,res){
    console.log("running at 3000");
});