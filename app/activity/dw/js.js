ApiJS.signRequest('GET', '/note/getNotesByActivityId?activityId=305795555106960384', {
        loginUserId: DeviceJS.loginUser.userId,
        deviceType: DeviceJS.loginUser.device.deviceType,
        appVersion: DeviceJS.loginUser.device.appVersion != null && DeviceJS.loginUser.device.appVersion != '' ? DeviceJS.loginUser.device.appVersion : DeviceJS.loginUser.device.version,
        pageNextId: '0',
        pageSize: 6
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
        }else{

        }
});

function getNoteHtml(noteId,notecontnet,userNickName,userHeadPhoto,noteImage,likeCount) {
    var s = '<li class="topic-content">';
    s += '<button onclick="clickLikeCount(\'' + noteId + '\')" id="likeCount'+noteId+'">' + likeCount + '</button>';
    s += "</li>";
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
