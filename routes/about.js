var express = require('express');
var extend = require('node.extend');

var Life = require('../config/life');
var Req = require('../config/request');

var router = express.Router();
var app = express();

var User = Req.User;
var Activity = Req.Activity;

//关于我们
router.get('/aboutus', function(req, res, next){
    res.render('about-aboutus', res.locals.resData);
});
//寻求合作
router.get('/cooperation', function(req, res, next){
    res.render('about-cooperation', res.locals.resData);
});
//如何使用
router.get('/howtouse', function(req, res, next){
    res.render('about-howtouse', res.locals.resData);
});


module.exports = router;