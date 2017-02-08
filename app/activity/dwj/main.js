
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
		'params': '{"activityId":"231843982614332416"}'
	},function(response){
		if (response.success == '1') {
			window.wxc.xcConfirm("活动已经结束了<br/>请多多关注其他热门活动");
			//window.location.href = 'gamecircle://topic/topicDetail/?id=241841854428748800';
		}else{
			window.location.href = 'http://site.youka.youmengchuangxiang.com/topic/241841854428748800';
		}
	});
});
