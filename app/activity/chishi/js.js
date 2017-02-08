'use strict';
var hostName = "http://api.youka.youmengchuangxiang.com";

function getOssUrl(bucket, url) {
    if (url.toLowerCase().substring(0,4)=='http') {
        return url;
    } else if (bucket != null && bucket.length > 0 && url != null && url.length > 0) {
        return 'http://' + bucket + '.oss-cn-beijing.aliyuncs.com/' + url;
    }
    return "";
}

function requestNotes() {
    var signatureObject = DeviceJS.getSignature();
    $.ajax({
        type: 'GET',
        url: hostName + '/duanwu/getNotes',
        data: $.extend({
            pageNextId: '0',
            pageSize: 5
        }, DeviceJS.getSignature()),
        success: function (response) {
            console.log(response);
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
                                getOssUrl(ue.bucket, ue.headPhoto),
                                getOssUrl(cm.bucket, cm.attachmentUrl),
                                cm.likeCount
                            )
                        );
                    }
                }
            }
        }
    });
}

function getNoteHtml(noteId,notecontnet,userNickName,userHeadPhoto,noteImage,likeCount) {
    var s = '<li class="topic-content">';
    s += '<div class="content-img"><img src="' + noteImage + '" alt="topicimg"/></div>';
    s += '<div class="content"><div class="content-title"><p>' + notecontnet + '</p></div><div class="content-body">&nbsp;<img src="' + userHeadPhoto + '" alt="user-icon"><span class="username">' + userNickName + '</span></div><div class="content-foot"><span id="likeCount'+noteId+'" >' + likeCount + '</span><button onclick="clickLikeCount(\'' + noteId + '\')" id ="btn-like"></button></div></div>';
    s += "</li>";
    return s;
}
function clickLikeCount(noteId) {
    $.ajax({
        type: 'POST',
        url: hostName + '/note/like',
        data: $.extend({
            noteId: noteId,
            like: 1
        }, DeviceJS.getSignature()),
        success: function (response) {
            if (response.success == '1') {
                var likeCountSpan = $("#likeCount"+noteId);
                likeCountSpan.html(parseInt(likeCountSpan.html(), 10) + 1);
            } else {
                window.wxc.xcConfirm(response.message);
            }
        }
    });
}

DeviceJS.onLoginUserInit = function(o) {
    requestNotes();
}



window.onload=function(){
    DeviceJS.setLoginUser({
        //用户信息
        userId: '79028802771419126',
        userType: '',
        token: '498741DCA8C300D5888EF4E57D0079C2',
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
            version: ''
        }
    });
}







































