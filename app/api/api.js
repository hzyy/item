/**
 * ApiJS core components.
 */
var ApiJS = ApiJS || (function (Math, undefined) {
    var A = {
        signRequest: function(type, url, params, callback) {
            var data = null;
            if (params != null && params.loginUserId != null && params.loginUserId != '' && params.token != null && params.token != '') {
                data = SignatureJS.generate(params.loginUserId, params.token);
            } else {
                data = SignatureJS.generate();
            }
            $.ajax({
                type: type,
                url: 'http://api.youka.youmengchuangxiang.com' + url,
                data: $.extend(data, params),
                success: function(response) {
                    if (callback) {
                        callback(response);
                    }
                }
            });
        }
    };
    return A;
}(Math));

//ApiJS.signRequest('GET', '/note/get', {
//    loginUserId: DeviceJS.loginUser.userId,
//    deviceType: DeviceJS.loginUser.device.deviceType,
//    appVersion: DeviceJS.loginUser.device.appVersion != null && DeviceJS.loginUser.device.appVersion != '' ? DeviceJS.loginUser.device.appVersion : DeviceJS.loginUser.device.version,
//    noteId: noteId
//},
//function(response){
//
//});
//
//
//ApiJS.signRequest('GET', '/note/get', {
//    noteId: noteId
//},
//function(response){
//
//});