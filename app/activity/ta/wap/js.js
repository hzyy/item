'use strict';
var hostName = "http://api.youka.youmengchuangxiang.com";

function requestNotes() {
    var signatureObject = DeviceJS.getSignature();
    $.ajax({
        type: 'GET',
        url: hostName + '/note/getNotesByActivityId',
        data: {
            nonce: signatureObject.nonce,
            timestamp: signatureObject.timestamp,
            signature: signatureObject.signature,
            activityId: '314262334196120576',
            pageNextId: '0',
            pageSize: 2
        },
        success: function (response) {
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
        }
    });
}

function getNoteHtml(noteId,likeCount) {
    var s = '<li>';
        s += '<button onclick="clickLikeCount(\'' + noteId + '\')" class="btn"></button>';
        s += '<span class="likeCount1" id="likeCount'+noteId+'" >' + likeCount + '</span>';
        s += '</li>';
    return s;
}
function clickLikeCount(noteId) {
    var signatureObject = SignatureJS.generate();
    $.ajax({
        type: 'POST',
        url: hostName + '/note/like',
        data:{
            nonce: signatureObject.nonce,
            timestamp: signatureObject.timestamp,
            signature: signatureObject.signature,
            noteId:noteId
        },
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

// DeviceJS.onLoginUserInit = function(o) {
//     requestNotes();
// }
window.onload=function(){
    requestNotes();
}













































