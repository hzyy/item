ApiJS.signRequest('GET', '/duanwu/getNotes', {pageNextId: '0', pageSize: 5}, function (response) {
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
                $('#topic').append(
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
    s += '<div class="content-img"><img src="' + noteImage + '" alt="topicimg"/></div>';
    s += '<div class="content"><div class="content-title"><p>' + notecontnet + '</p></div><div class="content-body">&nbsp;<img src="' + userHeadPhoto + '" alt="user-icon"><span class="username">' + userNickName + '</span></div><div class="content-foot"><span id="likeCount'+noteId+'" >' + likeCount + '</span><button onclick="clickLikeCount(\'' + noteId + '\')" id ="btn-like"></button></div></div>';
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


























