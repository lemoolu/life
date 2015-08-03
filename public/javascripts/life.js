var Life = {};
//错误代码
Life.ErrorCode = {
    '001' : '参数格式不正确',
    '002' : '需要管理员或用户登陆',
    '003' : '未知错误',

    '101' : '当前用户需要登录',
    '102' : '当前用户无此操作权限',
    '103' : '验证码无效',
    '104' : '用户名或密码无效',
    '105' : '该用户已存在',
    '109' : '您已经报名了该活动，不能再次报名，如果想重新报名，请先到我的活动中取消报名。',

    '201' : '当前用户需要登录',
    '202' : '当前用户无此操作权限',
    '203' : '验证码无效',
    '204' : '用户名或密码无效',
    '205' : '审核锁定',
    '1001' : '修改密码失败，原密码错误。'
};
//表单内容转对象
Life.FormToJson = function($form){
    var array = $form.serializeArray();
    var json = {};
    for(var i in array){
        json[array[i]['name']] = array[i]['value'];
    }
    return json;
};
//md5加密
Life.Md5Encrypt = function(str){
    return $.md5(str);
};
Life.fileUpLoad = function(config){
    //var _c = {
    //    node : null,
    //    success : function(res){}
    //}
    var html = $('<form method="post" target="_iframe" enctype="multipart/form-data" action="http://127.0.0.1:8080/life/common/upload.json?path=http://127.0.0.1:8808/upload.html">' +
    '<input type="file" name="file" id="_file-input"/> <input type="SUBMIT" value="upload" id="_file-submit"/>' +
    '</form>' +
    '<IFRAME id="_iframe" name="_iframe" src="about:blank" frameborder="1">' +
    '</IFRAME>');

    $('body').append(html);
    console.log(config.node.val());
    $('input#_file-input')[0].value = config.node.val();
    $('input#_file-submit').click();

};
Life._fileUpLoadCallback = function(){
    alert(344234);
}