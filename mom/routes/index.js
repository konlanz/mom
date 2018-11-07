"use strict"
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var messages = require('express-messages');
var router = express.Router();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var validator = require('express-validator');


var products = require('../schema/products');
var orders = require('../schema/orders');


router.get('/', (req, res, next)=>{
  req.session.destroy();
  products.find({category:'breakfast'},function(err, dat){
    if (err) throw err;

    res.render('user', {dat:dat}
     
    );    
  });


});

router.get('/signup', (req, res, next)=>{
  var cart = req.session.checkout;
  res.render('signup',{data:cart});
});

router.post('/checkout', (req, res)=>{
  var name = req.body.name;
  var email = req.body.email;
  var hostel = req.body.hostel;
  var room = req.body.room;
  var phone = req.body.phone;
  req.checkBody("phone", 'You must enter a real Phone number').isLength(9);
  
  var errors = req.validationErrors();
  if(errors){
    const msg= errors;
    console.log(msg);
    req.flash('error',"You must enter a phone number with length 10.");
    
    res.redirect('/signup');
  }else{
    var data = req.session.checkout;
    var forder = {
      name:name,
      Hostel:hostel,
      Room:room,
      phone:phone,
      mprod:data.mprod,
      sprod:data.sprod,
      mqty:data.mqty,
      sqty:data.sqty,
      total:data.total,
      Date:data.Date,
      Month:data.Month,
      Year:data.Year
    }
   var sve = new orders(forder).save();
  
   req.flash('sucess', "Thanks for your order");
   res.redirect('/');
   
  }

  

});
//ths for securing the the routes;
function secur(req, res, next){
  if(req.session.user){
    next();
  }else{
    res.redirect('/');
  }
}



router.post('/shop', (req, res, next)=>{
  req.session.mainp = req.session.mainp || {};
  var mainp = req.session.mainp; 
  var prod = req.body.prod;
  var items="items";
  products.findOne({prodname:prod},function(err, result){
    if(err){
     throw err;
    }
    if(mainp[items]){
      mainp[items].qty++;
    }else{
      mainp[items]= {
        item:result._id,
        name:result.prodname,
        price:result.prodprice,
        qty:1,
        photo:result.prodimage
      }
    }        
    
    req.flash('success','You Selected a product please slect your add ons');
    res.redirect('/users');
    });
  
});


router.get('/logout', (req, res, next)=>{
  delete req.session;
  
  res.redirect('/');
})

module.exports = router;
