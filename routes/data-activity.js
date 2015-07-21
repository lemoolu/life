var express = require('express');
var router = express.Router();
var app = express();


var ModelProxy = require( '../lib/modelproxy/modelproxy');
ModelProxy.init( './interface.json' );
var Activity = new ModelProxy('Activity.*');


var activityData = module.exports = {};

var cookie = '';

function indexGetList(){
    var reqData = {
        "pageNumber": 1,
        "pageSize": 15,
        "property": null,
        "keyword": null,
        "orderBy": null,
        //"orderType": "desc",
        "condition": {
        }
    };
    Activity.GetActivities(JSON.stringify(reqData)).withCookie(cookie).done(function(res){
        console.log(res);
    })
}

activityData.index = function(type){
    var data = {
    };
    var s = indexGetList();
    console.log(s);
};