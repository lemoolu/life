var express = require('express');
var router = express.Router();
var app = express();

var activityData = module.exports = {};

var ModelProxy = require( '../lib/modelproxy/modelproxy');
ModelProxy.init( './interface.json' );
var ActivityModel = new ModelProxy('Activity.*');

activityData.get = function(){
};