'use strict';
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
var loading = false;
var loadComplete = true;
var pageSize = 5;
var topicId = null;
var tag = 0;
var num = 0;
var pageNo = 1;
var pageNextId = 0;
var topictype = 1;
var shareId = getQueryString('shareId');
var topicId = getQueryString('topicId');
var noteUrl = "http://www.youmengchuangxiang.com/app/";

$(".nav div").click(function () {
    var _this = this.index;
    $(this).css({"background": "url(images/1px.png)no-repeat center 33px"}).children("span").css({"color": "#0BB276"}).end().siblings().css({"background": ""}).children("span").css({"color": "#ACACAC"});
})

function toggleDanmuState() {
    if (tag == 0) {
        ImageDanmu.toggleState();
    } else {
        VideoDanmu.toggleState();
    }
}

function stringToDate(time) {
    if (time || time.length >= 14) {
        var year = parseInt(time.substring(0, 4), 10);
        var month = parseInt(time.substring(4, 6), 10) - 1;
        var day = parseInt(time.substring(6, 8), 10);
        var hour = parseInt(time.substring(8, 10), 10);
        var minute = parseInt(time.substring(10, 12), 10);
        var second = parseInt(time.substring(12, 14), 10);
        return new Date(year, month, day, hour, minute, second);
    }
    return null;
}

function getDateDiff(longTime1, longTime2) {
    var diffTime = parseInt(((longTime1 - longTime2) / 1000), 10);
    if (diffTime < 60) {
        return '刚刚';
    }
    diffTime = parseInt((diffTime / 60), 10);
    if (diffTime >= 1 && diffTime < 60) {
        return diffTime + '分钟以前';
    }
    diffTime = parseInt((diffTime / 60), 10);
    if (diffTime < 24) {
        return diffTime + '小时以前';
    }
    diffTime = parseInt((diffTime / 24), 10);
    if (diffTime < 31) {
        return diffTime + '天以前';
    }
    diffTime = parseInt((diffTime / 30), 10);
    if (diffTime < 12) {
        return diffTime + '个月以前';
    }
    diffTime = parseInt((diffTime / 12), 10);
    return diffTime + '年以前';
}

$(function () {
    if (shareId && shareId.length > 0) {
        ApiJS.signRequest('GET', '/share/get', {
                shareId: shareId
            },
            function (response) {
                if (response.success == '1') {
                    var topic = response.object[0];
                    var userExt = response.object[1];
                    topicId = topic.topicId;
                    $('.userPhoto img').attr('src', CommonJS.getOssUrl(topic.bucket, topic.attachmentUrl));
                    $('.userMessage .nickName').html(decodeURIComponent(topic.topic));
                    $('.userMessage .noteCount').html(topic.noteCount);
                    $('.userMessage .funsCount').html(topic.funsCount);
                    requestNotes();
                    $(".topicHot").addClass("cursor");
                    $(".topicHot").click(function () {
                        pageNo = 1;
                        pageNextId = 0;
                        topictype = 2;
                        if (num == 0) {
                            $("#content").children().remove();
                            requestNotes();
                            $(".topicHot").removeClass("cursor");
                            $(".topicNew").addClass("cursor");
                        }
                        num = 1;
                    })
                    $(".topicNew").click(function () {
                        pageNo = 1;
                        pageNextId = 0;
                        topictype = 1;
                        if (num == 1) {
                            $("#content").children().remove();
                            requestNotes();
                            $(".topicHot").addClass("cursor");
                            $(".topicNew").removeClass("cursor");
                        }
                        num = 0;
                    })
                }
            });
    } else if (topicId && topicId.length > 0) {
        ApiJS.signRequest('GET', '/topic/get', {
                topicId: topicId
            },
            function (response) {
                if (response.success == '1') {
                    var topic = response.topic;
                    var userExt = response.userExt;
                    $('.userPhoto img').attr('src', CommonJS.getOssUrl(topic.bucket, topic.attachmentUrl));
                    $('.userMessage .nickName').html(decodeURIComponent(topic.topic));
                    $('.userMessage .noteCount').html(topic.noteCount);
                    $('.userMessage .funsCount').html(topic.funsCount);
                    requestNotes();
                    $(".topicHot").addClass("cursor");
                    $(".topicHot").click(function () {
                        pageNo = 1;
                        pageNextId = 0;
                        topictype = 2;
                        if (num == 0) {
                            $("#content").children().remove();
                            requestNotes();
                            $(".topicHot").removeClass("cursor");
                            $(".topicNew").addClass("cursor");
                        }
                        num = 1;
                    })
                    $(".topicNew").click(function () {
                        pageNo = 1;
                        pageNextId = 0;
                        topictype = 1;
                        if (num == 1) {
                            $("#content").children().remove();
                            requestNotes();
                            $(".topicHot").addClass("cursor");
                            $(".topicNew").removeClass("cursor");
                        }
                        num = 0;
                    })
                }
            });
    }
    $("#download").click(function () {
        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.ymcx.gamecircle";
    });
});
function requestNotes() {
    if (!loading) {
        loading = true;
        $('#content').append('<div id="loading" style="margin-top: 5px; margin-bottom: 5px; text-align: center;"><img src="../images/loading.gif" width="20"></div>');
        self.setTimeout(function () {
            ApiJS.signRequest('GET', '/v20160912/note/getNotesByTopicId', {
                    type: topictype,
                    topicId: topicId,
                    pageNo: pageNo,
                    pageNextId: pageNextId,
                    pageSize: pageSize
                },
                function (response) {
                    if (response.success == '1') {
                        var userExts = {};
                        if (response.data.userExts && response.data.userExts.length > 0) {
                            for (var i = 0; i < response.data.userExts.length; i++) {
                                var ue = response.data.userExts[i];
                                userExts[ue.userId] = ue;
                            }
                        }
                        var noteAttaches = {};
                        if (response.data.noteAttaches && response.data.noteAttaches.length > 0) {
                            var notes = response['data']['noteAttaches'];
                            for (var i = 0; i < notes.length; i++) {
                                var noteId = notes[i]['noteId'];
                                var clone = copy(notes[i]);
                                if (!noteAttaches[noteId]) {
                                    noteAttaches[noteId] = [];
                                }
                                noteAttaches[noteId].push(clone);
                            }
                            ;
                            function copy(obj) {
                                var result = {};
                                for (var i in obj) {
                                    result[i] = obj[i];
                                }
                                return result
                            }
                        }
                        var notes = response.data.notes;
                        if (notes && notes.length > 0) {
                            for (var i = 0; i < notes.length; i++) {
                                var cm = response.data.notes[i];
                                var ue = userExts[cm.userId];
                                var na = noteAttaches[cm.noteId];
                                var longTime1 = new Date().getTime();
                                var varDateTime = stringToDate(cm.time);
                                var longTime2 = varDateTime.getTime();
                                var varTime = '';
                                if (longTime1 < longTime2) {
                                    varTime = varDateTime('yyyy-MM-dd hh:mm:ss');
                                } else {
                                    varTime = getDateDiff(longTime1, longTime2);
                                }
                                var userNickName = decodeURIComponent(ue.nickName);
                                var userHeadPhoto = CommonJS.getOssUrl(ue.bucket, ue.headPhoto);
                                var deviceHeight = $(document).height();
                                var s = "";
                                s = '<div class="' + cm.noteId + '"><ul id="userinfo">';
                                s += '<li><img class="headPhoto" src="' + userHeadPhoto + '"></li>';
                                s += '<li><span id="nickName">' + userNickName + '</span><br/><span id="stime">' + varTime + '</span></li>';
                                s += '</ul>';
                                s += '<div class="content"></div>'
                                if (cm.content && cm.content.length > 0) {
                                    s += '<p class="lead text-indent2" style="font-size:16px;padding: 5px 13px 5px 13px;;background-color:white">';
                                    var str = decodeURIComponent(cm.content);
                                    var reg = /(#[^#]*#)/g;
                                    str = str.replace(reg, "<span style='color:orange;margin-left:13px'>$1</span>");
                                    s += Emoji.trans(str);
                                    s += '</p>';
                                }
                                s += '<div id="sharefrom" style="overflow:hidden;margin-bottom:5px;padding-bottom: 10px;background-color: white;"><span id="share">' + cm.gameName + '</span><div style="float:right;display:inline-block;"><div class="note_icon note_zan"   onclick="clickLikeCount(\'' + cm.noteId + '\',\'' + 1 + '\')" id="likeCount' + cm.noteId + '">' + cm.likeCount + '</div><div class="note_icon note_hate"    onclick="clickLikeCount(\'' + cm.noteId + '\',\'' + 0 + '\')" id="hateCount' + cm.noteId + '">' + cm.hateCount + '</div><a href="https://www.youmengchuangxiang.com/app/note/index.html?noteId=' + cm.noteId + '"><div class="note_icon note_commentCount">' + cm.commentCount + '</div></a></div></div></div>';
                                $('#content').append(s);
                                var naWidth = '100%';
                                var naMargin = '0px';
                                if (na && na.length > 1) {
                                    naWidth = '30%'
                                    naMargin = '2.5%'
                                }
                                ;
                                for (var j = 0; j < na.length; j++) {
                                    if (na[j].tag == '1') {
                                        if (na[j].videoUrl && na[j].videoUrl.length > 0) {
                                            var vid = '<li style="width:' + naWidth + ';margin-left:' + naMargin + ';margin-top:' + naMargin + '"><a href="' + noteUrl + 'note/index.html?noteId=' + cm.noteId + '"><video style="background-color:black" webkit-playsinline="true" height="100%" width="100%"  src="' + na[j].videoUrl + '">your browser does not support the video tag</video> <div class="playbg"></div> </a></li>'
                                            $('.' + cm.noteId + ' .content').append(vid);
                                        }
                                    } else if (na[j].bucket && na[j].bucket.length > 0 && na[j].attachmentUrl && na[j].attachmentUrl.length > 0) {
                                        var pic = '<li onclick=\'javascript:self.location.href ="' + noteUrl + 'note/index.html?noteId=' + cm.noteId + '"\'    style="cursor:pointer;width:' + naWidth + ';margin-left:' + naMargin + ';margin-top:' + naMargin + ';background:url(https://' + na[j].bucket + '.oss-cn-beijing.aliyuncs.com/' + na[j].attachmentUrl + ')no-repeat center center;background-size:cover"></li>'
                                        $('.' + cm.noteId + ' .content').append(pic);
                                    }
                                    if (na && na.length > 1) {
                                        tag = cm.tag;
                                        var height = $('.' + cm.noteId + ' .content li').width();
                                        $('.' + cm.noteId + ' .content li').css("height", height);
                                    }
                                    ;
                                }
                            }
                            loadComplete = false;
                        } else {
                            loadComplete = true;
                        }
                        $('#loading').remove();
                        loading = false;
                    }
                });
            pageNo++;
        }, 500)
    }
}

function clickLikeCount(noteId, like) {

    ApiJS.signRequest('POST', '/note/like', {
            noteId: noteId,
            like: like
        },
        function (response) {
            if (response.success == '1') {
                var likeCountSpan = $("#likeCount" + noteId);
                var hateCountSpan = $("#hateCount" + noteId);
                if (like == 1) {
                    if (response.first) {
                        likeCountSpan.html(parseInt(likeCountSpan.html(), 10) + 1);
                    } else {
                        likeCountSpan.html(parseInt(likeCountSpan.html(), 10) + 1);
                        hateCountSpan.html(parseInt(hateCountSpan.html(), 10) - 1);
                    }
                } else {
                    if (response.first) {
                        hateCountSpan.html(parseInt(hateCountSpan.html(), 10) + 1);
                    } else {
                        hateCountSpan.html(parseInt(hateCountSpan.html(), 10) + 1);
                        likeCountSpan.html(parseInt(likeCountSpan.html(), 10) - 1);
                    }
                }
            } else {
                window.wxc.xcConfirm(response.message);
            }
        });
}


$(window).scroll(function () {
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var windowHeight = $(this).height();
    if (scrollTop + windowHeight == scrollHeight) {
        if (num == 0) {
            topictype = 1;
            if (!loadComplete) {
                requestNotes()
            }
        } else if (num = 1) {
            topictype = 2;
            if (!loadComplete) {
                requestNotes()
            }
        }

    }
});
