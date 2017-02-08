ApiJS.signRequest('GET', '/v20160912/note/getNotesByActivityId', {
//ApiJS.signRequest('GET', '/note/getNotesByActivityId', {
    activityId:'297085820371416064',
    //loginUserId: DeviceJS.loginUser.userId,
    //deviceType: DeviceJS.loginUser.device.deviceType,
    //appVersion: DeviceJS.loginUser.device.appVersion != null && DeviceJS.loginUser.device.appVersion != '' ? DeviceJS.loginUser.device.appVersion : DeviceJS.loginUser.device.version,
    pageNextId: '0',
    pageSize: 2
    }, function (response) {
    if (response.success == '1') {
        var userExts = {};
        if (response.data.userExts && response.data.userExts.length > 0) {
            for (var i = 0; i < response.data.userExts.length; i++) {
                var ue = response.data.userExts[i];
                userExts[ue.userId] = ue;
            }
        }
        var notes = response.data.notes;
        if (notes && notes.length > 0) {
            var htmls = "";
            for (var i = 0; i < notes.length; i++) {
                var cm = response.data.notes[i];
                var ue = userExts[cm.userId];
                $('.topic').append(
                    getNoteHtml(
                        cm.noteId,
                        decodeURIComponent(cm.content),
                        decodeURIComponent(ue.nickName),
                        CommonJS.getOssUrl(ue.bucket, ue.headPhoto),
                        CommonJS.getOssUrl(cm.bucket, cm.attachmentUrl),
                        cm.likeCount
                    )
                );
            }
        }
    }
});

function getNoteHtml(noteId,notecontnet,userNickName,userHeadPhoto,noteImage,likeCount) {
    var s = '<li class="topic-content">';
    s += '<img src="' + noteImage + '" alt="usericon"/>';
    s += '<p class="username">' + userNickName + '</p>';
    s += '<p class="txt">' + notecontnet + '</p>';
    s += '<button onclick="clickLikeCount(\'' + noteId + '\')" id="likeCount'+noteId+'">' + likeCount + '</button>';
    s += "</li>";
    return s;
}

function clickLikeCount(noteId) {
    if(DeviceJS.loginUser.token == ''|| DeviceJS.loginUser.token == '(null)'){
        if(DeviceJS.loginUser.device.deviceType =='android'){
            window.location.href = 'app://activity/ActivityOperateAction?class=com.ymcx.gamecircle.activity.LoginRegistActivity';
        }else{
            window.location.href = 'gamecircle://login/loginDetail?id='+DeviceJS.loginUser.userId;
        }
    }else{
        ApiJS.signRequest('POST', '/note/like', {
                loginUserId: DeviceJS.loginUser.userId,
                token: DeviceJS.loginUser.token,
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
}



























