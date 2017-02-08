var DeviceJS = DeviceJS || (function (Math, undefined) {
    var D = {
        loginUser: {
            //用户信息
            userId: '',
            userType: '',
            token: '',
            nickName: '',
            bucket: '',
            headPhoto: '',
            device: {
                channelId: '',
                deviceType: '',
                deviceId: '',
                manufacturer: '',
                model: '',
                osVersion: '',
                appVerison: '',//客户端版本
                version: ''//@Deprecated客户端版本，请使用appVerison
            }
        },
        extraParams: {
            //扩展参数
        },
        setLoginUser: function(o) {
            D.loginUser = o;
            if (D.onLoginUserInit) {
                D.onLoginUserInit(o);
            }
        },
        setExtraParams: function(o) {
            D.extraParams = o;
            if (D.onExtraParamsInit) {
                D.onExtraParamsInit(o);
            }
        },
        onLoginUserInit: function(o) {
        },
        onExtraParamsInit: function(o) {
        },
        getSignature: function() {
            var result = {
                deviceType: D.loginUser.device.deviceType,
                appVersion: D.loginUser.device.appVersion != null && D.loginUser.device.appVersion != '' ? D.loginUser.device.appVersion : D.loginUser.device.version
            };
            var source = SignatureJS.generate(D.loginUser.userId, D.loginUser.token);
            for (var key in source) {
                result[key] = source[key];
            }
            return result;
        }
    };
    return D;
}(Math));