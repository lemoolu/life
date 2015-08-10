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


router.use('/discover', function(req, res, next){
    res.locals.resData.data = {
        type : 'dateCreated',
        list : null,
        hotTag : null,
        tag : null,
        reqData : {
            "pageNumber": 1,
            "pageSize": 15,
            "property": null,
            "keyword": null,
            "orderBy": 'dateCreated',
            "condition": {
            }
        }
    };

    res.locals.resData.onGetData = function(){
        Activity.GetActivities(JSON.stringify(res.locals.resData.data.reqData))
            .GetTags()
            .GetHotTags()
            .withCookie(res.locals.resData.cookies)
            .done(function(_res, _tag, _hotTag){
                res.locals.resData.data.list = _res.data.list;
                res.locals.resData.data.tag = _tag.data;
                res.locals.resData.data.hotTag = _hotTag.data;
                Life.Log(_hotTag);
                if(_res.data.totalCount <= _res.data.pageSize)
                    res.locals.resData.data.hasMore = false;
                else
                    res.locals.resData.data.hasMore = true;

                res.render('activity-discover', res.locals.resData);
            });
    };




    next();
});

//发现活动
router.get('/discover', function(req, res, next){
    res.locals.resData.onGetData();
});

//首页 按时间排序
router.get('/discover/dateCreated', function(req, res, next) {

    extend(true, res.locals.resData.data, {
        type : 'dateCreated',
        reqData : {
            "orderBy": 'dateCreated'
        }
    });

    res.locals.resData.onGetData();
});
//首页 按推荐排序
router.get('/discover/recommended', function(req, res, next) {
    extend(true, res.locals.resData.data, {
        type : 'recommended',
        reqData : {
            "orderBy": 'recommended'
        }
    });
    res.locals.resData.onGetData();
});
//首页 分类
router.get('/discover/sort/:tagId/:tagName', function(req, res, next) {
    extend(true, res.locals.resData.data, {
        type : 'sortTag',
        tagName : req.params.tagName,
        reqData : {
            "orderBy": 'dateCreated',
            "condition": {
                tagId : req.params.tagId
            }
        }
    });
    res.locals.resData.onGetData();
});
//首页 搜索
router.get('/discover/search/:key', function(req, res, next) {
    extend(true, res.locals.resData.data, {
        type : 'search',
        keyWord : req.params.key,
        reqData : {
            "orderBy": 'dateCreated',
            "keyword": req.params.key
        }
    });
    res.locals.resData.onGetData();
});


module.exports = router;