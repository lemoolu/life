
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = factory(require('angular'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['angular'], factory);
    } else {
        // Global Variables
        factory(root.angular);
    }
}(this, function (angular) {
    'use strict';

    var m = angular.module('Dialog', []);

    var $el = angular.element;

    m.provider('dialog', function(){
        var defaults = this.defaults = {
            parent : null,
            scope : null,
            template : null,
            templateUrl : null,
            cache : true,
            hasClose : true,
            hasMask : true,
            size : null,
            css : null,
            onConfirm : function () {},
            onAfterCreate : function(){},
            onClose : function(){}
        };

        var globalId = 0;
        var mask = null;

        this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller',
            function ($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller) {

                function Dialog(){
                }
                Dialog.instances = [];
                Dialog.prototype = {

                    //创建弹出框html 结构
                    createDialog : function(template){
                        globalId += 2;
                        template = template || '';
                        var d = $el("<div class='ui-dialog' id='dialog" + globalId + "'>" +
                        "<div class='ui-dialog-bg'></div>" +
                        "<div class='ui-dialog-title'></div>"+
                        "<div class='ui-dialog-content'>" +
                            "<div class='ui-dialog-content-main'></div>"+
                            "<div class='ui-dialog-content-buttons'></div>"+
                        "</div>" +
                        "</div>");

                        this.id = globalId;
                        Dialog.instances.push({
                            id : this.id,
                            hasMask : this.opts.hasMask
                        });

                        d.css({'z-index': globalId + 1000});

                        this.setMask();
                        return d;
                    },
                    setMask : function(){
                        if(mask == null){
                            mask = $el("<div class='ui-mask'></div>");
                            $('body').append(mask);
                            mask.hide();
                        }
                        if(Dialog.instances.length>0){
                            var isShow = 0;
                            for(var i in Dialog.instances){
                                if(Dialog.instances[i]['hasMask'] == true){
                                    mask.css({ 'z-index' :  Dialog.instances[i]['id']+1000-1 });
                                    mask.show();
                                }
                                isShow += Dialog.instances[i]['hasMask'];
                            }
                            if(isShow == 0){
                                mask.hide();
                            }
                        }
                        else{
                            mask.hide();
                        }
                    },
                    //option初始化
                    createOption : function(opts){
                        var options = angular.copy(defaults);
                        opts = opts || {};
                        angular.extend(options, opts);
                        return options;
                    },
                    create : function(opts){
                        this.opts = this.createOption(opts);
                        this.$dialog = this.createDialog();
                        var that = this;

                        this.$dialog.find('.ui-dialog-title').html(this.opts.title);

                        if(this.opts.hasClose)
                            this.$dialog.append("<div class='ui-dialog-close' ng-click='closeThisDialog()'><img src='images/close@3x.png'></div>");

                        this.scope = angular.isObject(this.opts.scope) ? this.opts.scope.$new() : $rootScope.$new();

                        this.scope.closeThisDialog = function(){
                            that.opts.onCancel && that.opts.onCancel();
                            that.close();
                        };
                        $compile(this.$dialog)(this.scope);

                        if(this.opts.size)
                            this.setSize(this.opts.size);
                        if(this.opts.css)
                            this.$dialog.css(this.opts.css);
                        else
                            this.$dialog.addClass('ui-dialog-init');

                        if(this.opts.parent != null)
                            this.opts.parent.append(this.$dialog);
                        else
                            $('body').append(this.$dialog);


                        return this;
                    },
                    setSize : function(size){
                        this.opts.size = size;
                        if(this.opts.size && angular.isObject(this.opts.size)){
                            this.$dialog.css({
                                width : this.opts.size.width + 'px',
                                height : this.opts.size.height + 'px'
                            });
                        }
                        if(this.opts.css == null){
                            this.$dialog.css({
                                'margin-left' : this.opts.size.width/-2 + 'px',
                                'margin-top' : this.opts.size.height/-2 + 'px'
                            });
                        }
                    },
                    close : function(){
                        for(var i in Dialog.instances){
                            if(Dialog.instances[i]['id'] == this.id)
                                Dialog.instances.splice(i, 1);
                        }
                        globalId -= 2;
                        this.setMask();
                        this.opts.onClose();
                        this.scope.$destroy();
                        this.$dialog.remove();
                    }
                };

                var privateMethods = {

                    //http请求加载html
                    loadTemplateUrl : function  (tmpl, config) {
                        return $http.get(tmpl, (config || {})).then(function(res) {
                            return res.data || '';
                        });
                    },
                    //加载html
                    loadTemplate : function(template, templateUrl, isCache, callback){
                        var self = this;
                        function load(){
                            if(template){
                                return template;
                            }
                            if(templateUrl){
                                if (typeof isCache === 'boolean' && !isCache) {
                                    return self.loadTemplateUrl(templateUrl, {cache: false});
                                }
                                else{
                                    return ($templateCache.get(templateUrl) || self.loadTemplateUrl(templateUrl, {cache: true}));
                                }
                            }
                        }
                        $q.when(load()).then(function(template){
                            $templateCache.put(templateUrl, template);
                            callback(template);
                        });
                    }
                };

                var publicMethods = {
                    //标准对话框，只创建窗体
                    open : function(opts){

                        var d = new Dialog().create(opts);
                        var $dialog = d.$dialog;
                        var options = d.opts;
                        var scope = d.scope;

                        privateMethods.loadTemplate(options.template, options.templateUrl, options.cache, function(template){

                            $dialog.find('.ui-dialog-content-main').html(template);
                            $dialog.find('.ui-dialog-content-buttons').remove();
                            $dialog.find('.ui-dialog-content').css('padding-bottom', '0');


                            if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {
                                var controllerInstance = $controller(options.controller, {
                                    $scope: scope,
                                    $element: $dialog
                                });
                                $dialog.data('$ngDialogControllerController', controllerInstance);
                            }
                            $compile($dialog)(scope);
                            if(options.onAfterCreate != null){
                                options.onAfterCreate();
                            }
                        });
                        return d;
                    },
                    confirm : function(opts){
                        var d = new Dialog().create(opts);
                        var $dialog = d.$dialog;
                        var options = d.opts;
                        var scope = d.scope;

                        scope.onConfirm = function(){
                            options.onConfirm && options.onConfirm(scope);
                            scope.closeThisDialog();
                        };
                        privateMethods.loadTemplate(options.template, options.templateUrl, options.cache, function(template){

                            $dialog.find('.ui-dialog-content-main').html(template);
                            $dialog.find('.ui-dialog-content-buttons').append("" +
                            '<button type="button" class="btn btn-default btn-sm" style="float: left" ng-click="onConfirm()">确定</button>' +
                            '<button type="button" class="btn btn-default btn-sm" style="float: right" ng-click="closeThisDialog()">取消</button>');
                            $dialog.find('.ui-dialog-content').css('padding-bottom', '30px');

                            $compile($dialog)(scope);
                            if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {
                                var controllerInstance = $controller(options.controller, {
                                    $scope: scope,
                                    $element: $dialog
                                });
                                $dialog.data('$ngDialogControllerController', controllerInstance);
                            }
                            if(options.onAfterCreate != null){
                                options.onAfterCreate();
                            }
                        });
                        return d;
                    }
                };

                return publicMethods;
            }
        ]
    });

    return m;
}));