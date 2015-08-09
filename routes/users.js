var express = require('express');
var extend = require('node.extend');

var Life = require('../config/life');
var Req = require('../config/request');

var router = express.Router();
var app = express();

var User = Req.User;
var Activity = Req.Activity;



//登陆
router.get('/login', function(req, res, next){
    //request.UserGetWechatPath(null, function(res){
    //    scope.wechatPath = res.data;
    //});
    User.GetWechatPath()
        .withCookie(res.locals.resData.cookies)
        .done(function(_resData){
            console.log(_resData);
            //添加微信登陆链接
            res.locals.resData.wechatUrl = _resData.data;
            res.render('users-login', res.locals.resData);
        });

});
//注册
router.get('/signup', function(req, res, next){
    res.render('users-signup', res.locals.resData);
});



//个人详情
router.use('/info', function(req, res, next){
    User.GetInfo()
        .withCookie(res.locals.resData.cookies)
        .done(function(_resData){
            res.locals.resData.data = _resData.data;
            next();
        });
});
//个人详情 显示页面
router.get('/info/show', function(req, res, next){
    res.locals.resData.data.type = 'show';
    res.render('users-info', res.locals.resData);
});
//个人详情 编辑信息
router.get('/info/edit', function(req, res, next){
    res.locals.resData.data.type = 'edit';
    res.render('users-info', res.locals.resData);
});
//个人详情 编辑头像
router.get('/info/editIcon', function(req, res, next){
    res.locals.resData.data.type = 'editIcon';
    res.render('users-info', res.locals.resData);
});
//个人详情 编辑密码
router.get('/info/editPassword', function(req, res, next){
    res.locals.resData.data.type = 'editPassword';
    res.render('users-info', res.locals.resData);
});

//个人消息页面
router.get('/message', function(req, res, next){
    res.render('users-message', res.locals.resData);
});

//个人活动公共
router.use('/activities/', function(req, res, next){
    res.locals.resData.data = {
        type : 'draft',
        hotTag : null,
        tag : null,
        list : [],
        reqData : {
            "pageNumber": 1,
            "pageSize": 15,
            "orderType": "desc",
            "condition" : null
        }
    };
    next();
});
//我的活动 草稿箱
router.get('/activities/draft', function(req, res, next){
    extend(true, res.locals.resData.data, {
        type : 3
    });
    res.render('users-activities', res.locals.resData);
});
//我的活动 审核中
router.get('/activities/auditing', function(req, res, next){
    extend(true, res.locals.resData.data, {
        type : 2
    });
    res.render('users-activities', res.locals.resData);
});
//我的活动 成功发起的
router.get('/activities/published', function(req, res, next){
    extend(true, res.locals.resData.data, {
        type : 1
    });
    res.render('users-activities', res.locals.resData);
});
//我的活动 审核不通过
router.get('/activities/publishfailed', function(req, res, next){
    extend(true, res.locals.resData.data, {
        type : 0
    });
    res.render('users-activities', res.locals.resData);
});
//我的活动 我参与的
router.get('/activities/joinin', function(req, res, next){
    extend(true, res.locals.resData.data, {
        type : 4
    });
    res.render('users-activities', res.locals.resData);
});
//我的活动 收藏夹
router.get('/activities/collection', function(req, res, next){
    extend(true, res.locals.resData.data, {
        type : 5
    });
    res.render('users-activities', res.locals.resData);
});
//报名管理
router.get('/activity/sign/:activityId?', function(req, res, next){
    extend(true, res.locals.resData.data, {
        activityId : req.params.activityId
    });
    res.render('users-activities-sign', res.locals.resData);
});
//报名管理
router.get('/message', function(req, res, next){
    res.render('users-message', res.locals.resData);
});

//修改密码
router.get('/forgetpassword', function(req, res, next){

});

module.exports = router;