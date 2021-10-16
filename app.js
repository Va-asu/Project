const express=require("express");
const bodyparser=require("body-parser");

const app=express();

app.get("/",function(req,res)
{
    res.send("hello world");
});

app.listen(3000,function(req,res){
    console.log("running at 3000");
});