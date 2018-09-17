"use strict"
var mongodb = require('mongodb');
var mongoose = require('mongoose');
 var dburl = "mongodb://localhost:27017/moms";
 mongoose.connect(dburl, (err, db)=>{
    if(err){
        throw err;
    }
    else{
        console.log("hey you conected");
    }

 })