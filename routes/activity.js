var express = require('express');
var extend = require('node.extend');

var Life = require('../config/life');
var Req = require('../config/request');

var router = express.Router();
var app = express();

var User = Req.User;
var Activity = Req.Activity;


//活动添加 第一步
router.get('/add/a/:id?', function(req, res, next){
    extend(true, res.locals.resData.data, {
        id : req.params.id || ''
    });
    console.log(res.locals.resData.data.id);
    res.render('activity-add-a', res.locals.resData);
});
//活动添加 第二步
router.get('/add/b/:id?', function(req, res, next){
    extend(true, res.locals.resData.data, {
        id : req.params.id || ''
    });
    console.log(res.locals.resData.data.id);
    res.render('activity-add-b', res.locals.resData);
});

//活动详情
router.get('/detail/:id?', function(req, res, next){
    Activity.GetById(req.params.id).IsAttention(req.params.id)
        .withCookie(res.locals.resData.cookies)
        .done(function(_resData, _attentionData){
            console.log(_resData);
            res.locals.resData.data = _resData.data;
            res.locals.resData.data.isAttention = _attentionData.data;
            res.render('activity-detail', res.locals.resData);
        })
});


module.exports = router;