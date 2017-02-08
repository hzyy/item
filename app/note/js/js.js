function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var loading = false;
var loadComplete = true;
var pageNextId = 0;
var pageSize = 20;
var mood = 1;
var noteId = getQueryString('noteId');
var shareId = getQueryString('shareId');
var subObjectId = 0;
var danmuInstances = {};

function toggleNoteAttach(noteAttachId) {
    subObjectId = noteAttachId;
    if (danmuInstances[noteAttachId].tag == 0) {
        danmuInstances[noteAttachId].start();
    }
}

function toggleDanmuState() {
    danmuInstances[subObjectId].toggleState();
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

// 按钮+1动画
(function ($) {
    $.extend({
        tipsBox: function (options) {
            options = $.extend({
                obj: null,  //jq对象，要在那个html标签上显示
                str: "+1",  //字符串，要显示的内容;也可以传一段html，如: "<b style='font-family:Microsoft YaHei;'>+1</b>"
                startSize: "12px",  //动画开始的文字大小
                endSize: "20px",    //动画结束的文字大小
                interval: 600,  //动画时间间隔
                color: "red",    //文字颜色
                callback: function () {
                }    //回调函数
            }, options);
            $("body").append("<span class='num'>" + options.str + "</span>");
            var box = $(".num");
            var left = options.obj.offset().left + options.obj.width() / 2;
            var top = options.obj.offset().top - options.obj.height();
            box.css({
                "position": "absolute",
                "left": left + "px",
                "top": top + 10 + "px",
                "z-index": 9999,
                "font-size": options.startSize,
                "line-height": options.endSize,
                "color": options.color
            });
            box.animate({
                "font-size": options.endSize,
                "opacity": "0",
                "top": top - parseInt(options.endSize) + "px"
            }, options.interval, function () {
                box.remove();
                options.callback();
            });
        }
    });
})(jQuery);

$(function () {
    if (shareId && shareId.length > 0) {
        ApiJS.signRequest('GET', '/share/get', {shareId: shareId}, function (response) {
            if (response.success == '1') {
                var note = response.object[0];
                var userExt = response.object[2];
                var game = response.object[3];
                noteId = note.noteId;
                $("#btn-like").on("click", function () {
                    clickLikeCount(1);
                });
                $("#btn-hate").on("click", function () {
                    clickLikeCount(0);
                });

                $('#share').html(decodeURIComponent(game.name))
                $('#headPhoto').attr('src', CommonJS.getOssUrl(userExt.bucket, userExt.headPhoto));
                $('#nickName').html(decodeURIComponent(userExt.nickName));

                var content = "";
                if (note.tag == '1') {
                    if (note.videoUrl && note.videoUrl.length > 0) {
                        danmuInstances[note.noteId] = new VideoDanmu();
                        content += '<div class="' + note.noteId + '" style="position:relative;word-break:break-all;overflow:hidden;width:100%;background-color:black" id="danmu" class="video"><video webkit-playsinline="true" width="100%" height="100%" onclick="danmuInstances[\'' + note.noteId + '\'].videoPlay(\'' + note.noteId + '\')" onplay="danmuInstances[\'' + note.noteId + '\'].init(this, \'' + note.noteId + '\');" onpause="danmuInstances[\'' + note.noteId + '\'].paused()"  onseeked="danmuInstances[\'' + note.noteId + '\'].seeking()" ontimeupdate="danmuInstances[\'' + note.noteId + '\'].show();" controls="controls" poster="' + note.attachmentUrl + '" src="' + note.videoUrl + '">your browser does not support the video tag</video></div>';
                    }
                } else {
                    if (note.bucket && note.bucket.length > 0 && note.attachmentUrl && note.attachmentUrl.length > 0) {
                        content += '<div style="position:relative;word-break:break-all;overflow:hidden;width:100%"  id="danmu" class="' + note.noteId + '"><img src="https://' + note.bucket + '.oss-cn-beijing.aliyuncs.com/' + note.attachmentUrl + '" onload="imgDanmuItem.start(\'' + note.noteId + '\',\'' + note.noteId + '\');" width="100%"></div>';
                    }
                }

                if (note.content && note.content.length > 0) {
                    content += '<p class="lead text-indent2" style="font-size:16px;padding: 10px 13px 5px 13px;background-color:white">';
                    var str = decodeURIComponent(note.content);
                    var reg = /(#[^#]*#)/g;
                    str = str.replace(reg, "<span style='color:orange;'>$1</span>");
                    content += Emoji.trans(str);
                    content += '</p>';
                }

                var longTime1 = new Date().getTime();
                var varDateTime = stringToDate(note.time);
                var longTime2 = varDateTime.getTime();
                var varTime = '';
                if (longTime1 < longTime2) {
                    varTime = varDateTime('yyyy-MM-dd hh:mm:ss');
                } else {
                    varTime = getDateDiff(longTime1, longTime2);
                }
                $('#stime').html(decodeURIComponent(varTime));
                $('#hateCount').html(note.hateCount);
                $('#likeCount').html(note.likeCount);
                $('#commentCount').html(note.commentCount);
                $('#content').html(content);

                $("#submit").click(function () {
                    var content = $("#answer").val();
                    if (content == '') {
                        window.wxc.xcConfirm("评论内容不能为空");
                        return false;
                    }
                    if (content.length > 300) {
                        window.wxc.xcConfirm("不能超过300个字符");
                        return false;
                    }
                    commentPost(content);
                });
                requestComments();
            } else {
                $('#content').html('<center>分享信息不存在或已被删除</center>');
            }
        });
    } else if (noteId && noteId.length > 0) {
        ApiJS.signRequest('GET', '/v20160912/note/get', {noteId: noteId}, function (response) {
            if (response.success == '1') {
                var note = response.data.note;
                var userExt = response.data.userExt;
                var game = response.data.game;
                var noteAttaches = response.data.noteAttaches;
                $("#btn-like").on("click", function () {
                    clickLikeCount(1);
                });
                $("#btn-hate").on("click", function () {
                    clickLikeCount(0);
                });
                $('#share').html(decodeURIComponent(game.name))
                $('#headPhoto').attr('src', CommonJS.getOssUrl(userExt.bucket, userExt.headPhoto));
                $('#nickName').html(decodeURIComponent(userExt.nickName));
                if (noteAttaches && noteAttaches.length > 0) {
                    $('#content').append('<div class="banner"><div class="large_box"><ul></ul></div><div class="small_box"><div class="small_list" id="small_list" style="white-space:nowrap;"><ul id="ul_smallBox"></ul></div></div></div>');
                    for (var i = 0; i < noteAttaches.length; i++) {
                        if (noteAttaches[i].tag == '1') {
                            var lageVideo = '<li class="' + noteAttaches[i].id + '"><video id="' + noteAttaches[i].id + '" class="pause" webkit-playsinline="true" width="100%" height="100%" controls="controls" src="' + noteAttaches[i].videoUrl + '" poster="' + noteAttaches[i].attachmentUrl + '">your browser does not support the video tag</video></li>';
                            var small_list = '<li onclick="toggleNoteAttach(\'' + noteAttaches[i].id + '\');"><video poster="' + noteAttaches[0].attachmentUrl + '"></video><div class="play_bg" number="' + noteAttaches[i].id + '"></div><div class="play_bg1"></div></li>';
                            $('.large_box ul').append(lageVideo);
                            $('.small_list ul').append(small_list);
                            danmuInstances[noteAttaches[i].id] = new VideoDanmu(note.noteId, noteAttaches[i].id);
                        } else {
                            var lageImg = '<li class="' + noteAttaches[i].id + '" style="position:relative;"><img style="display:block;margin: 0 auto;vertical-align: middle;position: absolute;margin: auto;top: 0;left: 0;right: 0;bottom: 0;width: auto;height:auto;max-height: 100%;max-width: 100%;" src="https://' + noteAttaches[i].bucket + '.oss-cn-beijing.aliyuncs.com/' + noteAttaches[i].attachmentUrl + '" ></li>';
                            var small_list = '<li onclick="toggleNoteAttach(\'' + noteAttaches[i].id + '\');" style="background:url(https://' + noteAttaches[i].bucket + '.oss-cn-beijing.aliyuncs.com/' + noteAttaches[i].attachmentUrl + ')no-repeat center center;background-size:cover"><div class="play_bg" number="' + noteAttaches[i].id + '" ></div></li>';
                            $('.large_box ul').append(lageImg);
                            $('.small_list ul').append(small_list);
                            danmuInstances[noteAttaches[i].id] = new ImageDanmu(note.noteId, noteAttaches[i].id);
                        }
                        if (i == 0) {
                            subObjectId = noteAttaches[i].id;
                            if (danmuInstances[noteAttaches[i].id].tag == 0) {
                                danmuInstances[noteAttaches[i].id].start();
                            }
                        }
                    }
                    if (noteAttaches.length <= 1) {
                        $('.small_box').css('display', 'none');
                    }
                }
                $(".small_box li:nth-child(1)").addClass("on");
                $(".banner").thumbnailImg({
                    large_elem: ".large_box",
                    small_elem: ".small_list"
                });

                // smallbox touch事件
                if (noteAttaches && noteAttaches.length >= 5) {
                    var small_list = document.getElementById("small_list"),
                        ul_smallBox = document.getElementById("ul_smallBox"),
                        list = ul_smallBox.getElementsByTagName("li"),
                        ul_smallBox_width = list.length * 72,
                        moveWidth = small_list.clientWidth - ul_smallBox_width;
                    ul_smallBox.addEventListener("touchstart", touchstart, false)
                    ul_smallBox.addEventListener("touchmove", touchmove, false)
                    ul_smallBox.addEventListener("touchend", touchend, false)
                    function touchstart(event) {
                        var touch = event.changedTouches[0],
                            x = Number(touch.pageX);
                        tmpX = x - ul_smallBox.offsetLeft;
                    }
                    function touchmove(event) {
                        var touch = event.changedTouches[0],
                            x1 = Number(touch.pageX);
                        var L = x1 - tmpX;
                        if (L <= moveWidth) {
                            ul_smallBox.style.marginLeft = moveWidth + "px";
                        } else if (L >= 0) {
                            ul_smallBox.style.marginLeft = 0 + "px";
                        } else {
                            ul_smallBox.style.marginLeft = L + "px";
                        }
                    }
                    function touchend(event) {
                        ul_smallBox.touchmove = null;
                    };
                }
                ;

                var content = "";
                if (note.content && note.content.length > 0) {
                    content += '<p class="lead text-indent2" style="font-size:16px;padding: 10px 13px 5px 13px;background-color:white">';
                    var str = decodeURIComponent(note.content);
                    var reg = /(#[^#]*#)/g;
                    str = str.replace(reg, "<span style='color:orange;'>$1</span>");
                    content += Emoji.trans(str);
                    content += '</p>';
                }

                var longTime1 = new Date().getTime();
                var varDateTime = stringToDate(note.time);
                var longTime2 = varDateTime.getTime();
                var varTime = '';
                if (longTime1 < longTime2) {
                    varTime = varDateTime('yyyy-MM-dd hh:mm:ss');
                } else {
                    varTime = getDateDiff(longTime1, longTime2);
                }
                $('#stime').html(decodeURIComponent(varTime));
                $('#hateCount').html(note.hateCount);
                $('#likeCount').html(note.likeCount);
                $('#commentCount').html(note.commentCount);
                $('#content').append(content);

                $(".commentLike").click(function () {
                    if (mood == 0) {
                        $(this).css({
                            'background': 'url("images/hover@2x.png")no-repeat center center',
                            'background-size': '80%'
                        });
                        $(".commentHate").css({
                            'background': 'url("images/cailink@2x.png")no-repeat center center',
                            'background-size': '90%'
                        });
                    }
                    mood = 1;
                });
                $(".commentHate").click(function () {
                    if (mood == 1) {
                        $(this).css({
                            'background': 'url("images/caihover@2x.png")no-repeat center center',
                            'background-size': '90%'
                        });
                        $(".commentLike").css({
                            'background': 'url("images/link@2x.png")no-repeat center center',
                            'background-size': '90%'
                        });
                    }
                    mood = 0;
                });

                $("#ul_smallBox li").click(function () {
                    subObjectId = $("#ul_smallBox .on .play_bg").attr("number");
                })

                $("#submit").click(function () {
                    var content = $("#answer").val();
                    if (content == '') {
                        window.wxc.xcConfirm("评 论内容不能为空");
                        return false;
                    }
                    if (content.length > 300) {
                        window.wxc.xcConfirm("不能超过300个字符");
                        return false;
                    }
                    if (noteAttaches && noteAttaches.length > 1) {
                        subObjectId = $("#ul_smallBox .on .play_bg").attr("number");
                    }
                    commentPost(content);
                });
                requestComments();
            } else {
                $('#content').html('<center>信息不存在或已被删除</center>');
            }
        });
    }
    $("#download").click(function () {
        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.ymcx.gamecircle";
    });
    $(window).bind('orientationchange', function (e) {
        danmuInstances[subObjectId].start();
        danmuInstances[subObjectId].init();
    });
});

function commentPost(content) {
    var axisX = Math.random().toFixed(2);
    if (axisX < 0.1) {
        axisX = 0.1;
    } else if (axisX > 0.9) {
        axisX = 0.9;
    }
    var axisY = Math.random().toFixed(2);
    if (axisY < 0.1) {
        axisY = 0.1;
    } else if (axisY > 0.9) {
        axisY = 0.9;
    }
    ApiJS.signRequest('POST', '/v20160912/comment/post', {
            type: 3,
            objectId: noteId,
            axisX: axisX,
            axisY: axisY,
            mood: mood,
            subObjectId: subObjectId,
            content: encodeURIComponent(content)
        },
        function (response) {
            if (response.success == '1') {
                $('#answer').val('');
                var headPhotoUrl = CommonJS.getOssUrl('gamecircle-pic', 'default-head-photo.jpeg');
                var htmls = getCommentHtml(headPhotoUrl, '来自Web页', content, '刚刚', 0, response.data.commentId);
                $('#comment').prepend(htmls);
                var commentCountSpan = $('#commentCount');
                commentCountSpan.html(parseInt(commentCountSpan.html(), 10) + 1);
                Danmu.danmuList.push({
                    id: response.data.commentId,
                    icon: headPhotoUrl,
                    text: Emoji.trans(decodeURIComponent(content)),
                    mood: mood,
                    top: parseInt((Danmu.danmuImgHeight * axisY), 10),
                    left: parseInt((Danmu.danmuImgWidth * axisX), 10)
                });
            }
        });
}

function requestComments() {
    if (!loading) {
        loading = true;
        $('#comment').append('<div id="loading" style=" margin-bottom: 5px; text-align: center;"><img src="../images/loading.gif" width="20"></div>');
        self.setTimeout(function () {
            ApiJS.signRequest('GET', '/v20160912/comment/getComments', {
                    type: 3,
                    objectId: noteId,
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
                        var comments = response.data.comments;
                        if (comments && comments.length > 0) {
                            var htmls = "";
                            var longTime1 = new Date().getTime();
                            for (var i = 0; i < comments.length; i++) {
                                var cm = comments[i];
                                var ue = userExts[cm.userId];
                                var nickName = "";
                                var likeCount = "";
                                if (cm.userId == '0') {
                                    nickName = "来自Web页";
                                } else {
                                    nickName = decodeURIComponent(ue.nickName);
                                }
                                if (!ue.bucket || ue.bucket.length == 0 || !ue.headPhoto || ue.headPhoto.length == 0) {
                                    ue.bucket = 'gamecircle-pic';
                                    ue.headPhoto = 'default-head-photo.jpeg';
                                }
                                var commentDateTime = stringToDate(cm.time);
                                var longTime2 = commentDateTime.getTime();
                                var diffTime = '';
                                if (longTime1 < longTime2) {
                                    diffTime = commentDateTime('yyyy-MM-dd hh:mm:ss');
                                } else {
                                    diffTime = getDateDiff(longTime1, longTime2);
                                }
                                htmls += getCommentHtml(CommonJS.getOssUrl(ue.bucket, ue.headPhoto), nickName, Emoji.trans(decodeURIComponent(cm.content)), diffTime, cm.likeCount, cm.commentId);
                                if (i == comments.length - 1) {
                                    pageNextId = comments[i].commentId;
                                }
                            }
                            $('#comment').append(htmls);
                            loadComplete = false;
                        } else {
                            loadComplete = true;
                        }
                        $('#loading').remove();
                        loading = false;
                    }
                });
        }, 1000);
    }
}

function clickLikeCount(like) {
    ApiJS.signRequest('POST', '/note/like', {
            noteId: noteId,
            like: like
        },
        function (response) {
            if (response.success == '1') {
                var likeCountSpan = $("#likeCount");
                var hateCountSpan = $("#hateCount");
                if (like == '1') {
                    if (response.first) {
                        $.tipsBox({
                            obj: $('#btn-like').find('div'),
                            str: "+1",
                            color: "#20BB7E"
                        });
                        likeCountSpan.html(parseInt(likeCountSpan.html(), 10) + 1);
                    } else {
                        $.tipsBox({
                            obj: $('#btn-like').find('div'),
                            str: "+1",
                            color: "#20BB7E"
                        });
                        likeCountSpan.html(parseInt(likeCountSpan.html(), 10) + 1);
                        hateCountSpan.html(parseInt(hateCountSpan.html(), 10) - 1);
                        hateCountSpan.prev('img').attr('src', 'images/cai_nor.png');
                    }
                    likeCountSpan.prev('img').attr('src', 'images/zan_sel.png');
                } else {
                    if (response.first) {
                        $.tipsBox({
                            obj: $('#btn-hate').find('div'),
                            str: "-1",
                            color: "#B0B0B0"
                        });
                        hateCountSpan.html(parseInt(hateCountSpan.html(), 10) + 1);
                    } else {
                        $.tipsBox({
                            obj: $('#btn-hate').find('div'),
                            str: "-1",
                            color: "#B0B0B0"
                        });
                        hateCountSpan.html(parseInt(hateCountSpan.html(), 10) + 1);
                        likeCountSpan.html(parseInt(likeCountSpan.html(), 10) - 1);
                        likeCountSpan.prev('img').attr('src', 'images/zan_nor.png');
                    }
                    hateCountSpan.prev('img').attr('src', 'images/cai_sel.png');

                }
            } else {
                window.wxc.xcConfirm(response.message);
            }
        });
}

function getCommentHtml(headPhotoUrl, nickName, commentContent, stime, likeCount, commentId) {
    var s = '<div class="media border-b" style="border-top:1px solid #EBEBEB;padding-bottom:10px">';
    s += '<div class="media-left" style="padding-left:13px;padding-top:16px;"><a><img class="media-object" src="' + headPhotoUrl + '" style="width: 50px;height: 50px;border-radius:100% ;"></a></div>';
    s += '<div class="media-body"><h5 class="media-heading" style="margin-bottom:0;margin-top:20px;"><span>' + nickName + '</span>&nbsp;</br><span style="color:#A5A5A5;font-size:10px;line-height:25px;">' + stime + '</span></h5><p style="color:#5E5A5A;">' + commentContent + '</p></div>';
    s += '<div class="media-right"   onclick="commentLikeCount(\'' + commentId + '\')" style="background:url(images/zan_nor.png)no-repeat  center 20px; text-align:center;cursor:pointer;color:#B0B0B0;padding-right:10px;padding-top:40px;"><span class="likeCount" id="likeCount' + commentId + '" style="padding:4px 3px 0 5px;float:left" class="pull-right">' + likeCount + '</span></div>';
    s += "</div>";
    return s;
}

function commentLikeCount(commentId) {
    ApiJS.signRequest('POST', '/comment/like', {like: 1, commentId: commentId}, function (response) {
        if (response.success == '1') {
            var likeCountSpan = $("#likeCount" + commentId);
            likeCountSpan.html(parseInt(likeCountSpan.html(), 10) + 1);
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
        if (!loadComplete) {
            requestComments();
        }
    }
});





