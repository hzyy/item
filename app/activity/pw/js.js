$("#btn3").click(function() {
    ReportJS.report({
        'eventId': 'activity_participate',
        'userId': DeviceJS.loginUser.userId,
        'userType': DeviceJS.loginUser.userType,
        'channelId': DeviceJS.loginUser.device.channelId,
        'deviceType': DeviceJS.loginUser.device.deviceType,
        'deviceId': DeviceJS.loginUser.device.deviceId,
        'manufacturer': DeviceJS.loginUser.device.manufacturer,
        'model': DeviceJS.loginUser.device.model,
        'osVersion': DeviceJS.loginUser.device.osVersion,
        'appVersion': DeviceJS.loginUser.device.appVersion != null && DeviceJS.loginUser.device.appVersion != '' ? DeviceJS.loginUser.device.appVersion : DeviceJS.loginUser.device.version,
        'params': '{"activityId":"315635530887506944"}'
    },function(response){
        if (response.success == '1') {
            window.wxc.xcConfirm("活动已经结束了<br/>请多多关注其他热门活动");
            //if(DeviceJS.loginUser.device.deviceType == "ios"){
            //    window.location.href = 'gamecircle://game/gameDetail/?gameId=58154312454766593';
            //}else{
            //    window.location.href = 'gamecircle://game/gameDetail/?id=58154312454766593';
            //}
        }
        if(!MobileJS.isMobile()){
            window.location.href = 'http://site.youka.youmengchuangxiang.com/game/58154312454766593';
        }
    });
});












































