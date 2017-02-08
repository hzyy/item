ApiJS.signRequest('GET', '/note/getNotesByActivityId?activityId=315635530887506944', {
    pageNextId: '0', pageSize: 3
}, function (response) {
    if (response.success == '1') {
        var userExts = {};
        if (response.userExts && response.userExts.length > 0) {
            for (var i = 0; i < response.userExts.length; i++) {
                var ue = response.userExts[i];
                userExts[ue.userId] = ue;
            }
        }
        var notes = response.notes;
        if (notes && notes.length > 0) {
            var htmls = "";
            for (var i = 0; i < notes.length; i++) {
                var cm = response.notes[i];
                var ue = userExts[cm.userId];
                $('.content').append(
                    getNoteHtml(
                        cm.noteId,
                        cm.likeCount
                    )
                );
            }
        }
    }
});

function getNoteHtml(noteId,likeCount) {
    var s = '<li>';
    s += '<button onclick="clickLikeCount(\'' + noteId + '\')" class="btn"></button>';
    s += '<p style="float:left;color:white;margin-left:20%;margin-top: 6%">喜欢人数</p>';
    s += '<p class="likeCount1" id="likeCount'+noteId+'" style="padding:0px;" >' + likeCount + '</p>';
    s += '</li>';
    return s;
}

function clickLikeCount(noteId) {
    ApiJS.signRequest('POST', '/note/like', {
            loginUserId: DeviceJS.loginUser.userId,
            deviceType: DeviceJS.loginUser.device.deviceType,
            appVersion: DeviceJS.loginUser.device.appVersion != null && DeviceJS.loginUser.device.appVersion != '' ? DeviceJS.loginUser.device.appVersion : DeviceJS.loginUser.device.version,
            noteId: noteId,
            like: 1
        },
        function (response) {
            if (response.success == '1') {
                var likeCountSpan = $("#likeCount" + noteId);
                likeCountSpan.html(parseInt(likeCountSpan.html(), 10) + 1);
            } else {
                window.wxc.xcConfirm(response.message);
            }
        });
}


// window.onload=function(){
//     requestNotes();
// }

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
        'appVersion': DeviceJS.loginUser.device.appVersion,
        'params': '{"activityId":"315635530887506944"}'
    },function(response){
        if (response.success == '1') {
            if(DeviceJS.loginUser.device.deviceType == "ios"){
                window.location.href = 'gamecircle://game/gameDetail/?gameId=58154312454766593';
            }else{
                window.location.href = 'gamecircle://game/gameDetail/?id=58154312454766593';
            }
        }
    });
});











































