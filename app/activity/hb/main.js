
var ele = document.getElementById("bg_img");
var timestamp = Date.parse(new Date());
ele.src = ele.src+"?m="+timestamp;
$("#btn").click(function() {
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
		'params': '{"activityId":"316012683508546560"}'
	},function(response){
		if (response.success == '1') {
			window.wxc.xcConfirm("活动已经结束了<br/>请多多关注其他热门活动");
			//window.location.href = 'gamecircle://topic/topicDetail/?id=316015250271736832';
		}
		if(!MobileJS.isMobile()){
			window.location.href = 'http://site.youka.youmengchuangxiang.com/topic/316015250271736832';
		}
	});
});