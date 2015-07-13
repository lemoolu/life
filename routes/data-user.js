var express = require('express');
var router = express.Router();
var app = express();

var userData = module.exports = {};

var ModelProxy = require( '../lib/modelproxy/modelproxy');
ModelProxy.init( './interface.json' );
var User = new ModelProxy('User.*');

userData.getIsLogin = function(cookie){
    User.GetLoginStatus().withCookie(cookie).done(function(res, cookie){
        console.log(res);
        console.log(cookie);
    });
    console.log('getIsLogin2');

};