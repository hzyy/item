'use strict';
var hostName = "http://api.youka.youmengchuangxiang.com";
var stsToken = null;
var isInit = true;
var type = 5;
var objectId = '114486613279142912';
var pageNo = 1;
var pageSize = 20;
var pageCount = 1;

$(function() {
    var Base64Binary = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        /* will return a  Uint8Array type */
        decodeArrayBuffer: function(input) {
            var bytes = (input.length / 4) * 3;
            var ab = new ArrayBuffer(bytes);
            this.decode(input, ab);

            return ab;
        },

        removePaddingChars: function(input) {
            var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
            if (lkey == 64) {
                return input.substring(0, input.length - 1);
            }
            return input;
        },

        decode: function(input, arrayBuffer) {
            //get last chars to see if are valid
            input = this.removePaddingChars(input);
            input = this.removePaddingChars(input);

            var bytes = parseInt((input.length / 4) * 3, 10);

            var uarray;
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            var j = 0;

            if (arrayBuffer) uarray = new Uint8Array(arrayBuffer);
            else uarray = new Uint8Array(bytes);

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            for (i = 0; i < bytes; i += 3) {
                //get the 3 octects in 4 ascii chars
                enc1 = this._keyStr.indexOf(input.charAt(j++));
                enc2 = this._keyStr.indexOf(input.charAt(j++));
                enc3 = this._keyStr.indexOf(input.charAt(j++));
                enc4 = this._keyStr.indexOf(input.charAt(j++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                uarray[i] = chr1;
                if (enc3 != 64) uarray[i + 1] = chr2;
                if (enc4 != 64) uarray[i + 2] = chr3;
            }

            return uarray;
        }
    };

    var commentPost = function(bucket, fileUrl, content) {
        var signatureObject = DeviceJS.getSignature();
        $.ajax({
            type: 'POST',
            url: hostName + '/comment/post',
            data: {
                loginUserId: DeviceJS.loginUser.userId,
				nonce: signatureObject.nonce,
				timestamp: signatureObject.timestamp,
				signature: signatureObject.signature,
                type: type,
                objectId: objectId,
                bucket: bucket,
                fileUrl: fileUrl,
                content: encodeURIComponent(content)
            },
            success: function(response) {
                if (response.success == '1') {
                    var nickName = "";
                    if (DeviceJS.loginUser.userType == '-1') {
                        nickName = "游客";
                    } else {
                        nickName = decodeURIComponent(DeviceJS.loginUser.nickName);
                    }

                    var headPhotoUrl = '';
                    if (!DeviceJS.loginUser.bucket || DeviceJS.loginUser.bucket.length == 0 || !DeviceJS.loginUser.headPhoto || DeviceJS.loginUser.headPhoto.length == 0) {
                        headPhotoUrl = getOssUrl('gamecircle-pic', 'default-head-photo.jpeg');
                    } else {
                        headPhotoUrl = getOssUrl(DeviceJS.loginUser.bucket, DeviceJS.loginUser.headPhoto);
                    }

                    var htmls = getCommentHtml(response.commentId, 0, DeviceJS.loginUser.userId, nickName, headPhotoUrl, getOssUrl(bucket, fileUrl), content, '刚刚');
                    $('#comment').prepend(htmls);
                    var commentCountSpan = $('#commentCount');
                    commentCountSpan.html(parseInt(commentCountSpan.html(), 10) + 1);

                    $("#submit").attr({"disabled":false,"value":"提交"});
                    $('#answer').val('');
                    $('#file').val('');
                    $('.img').html('<img src="" id="img0">');
                }
            }
        });
    }

    function base64ToArrayBuffer(base64, contentType) {
        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'  
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    $("#submit").click(function() {
        var content = $("#answer").val();
        if (content == '') {
       	 	window.wxc.xcConfirm("评论内容不能为空");
            return false;
        }
        if (content.length > 300) {
       	 	window.wxc.xcConfirm("不能超过300个字符");
            return false;
        }
		$("#submit").attr({"disabled":true,"value":"提交中..."});
        var files = $("#file")[0].files;
        if (files.length > 0) {
            lrz(files[0], {
                width: 800
            }).then(function(rst) { //压缩图片
                var binaryObject = base64ToArrayBuffer(rst.base64);
                var spark = new SparkMD5.ArrayBuffer();
                spark.append(binaryObject);
                var md5 = spark.end();
                var fileUrl = md5 + files[0].name.substring(files[0].name.lastIndexOf("."));
                var bucket = 'gamecircle-pic';
                var oss = new ALY.OSS({
                    accessKeyId: stsToken.Credentials.AccessKeyId,
                    secretAccessKey: stsToken.Credentials.AccessKeySecret,
                    securityToken: stsToken.Credentials.SecurityToken,
                    endpoint: 'http://oss-cn-beijing.aliyuncs.com',
                    apiVersion: '2013-10-15'
                });
                oss.putObject({
                    Bucket: bucket,
                    Key: fileUrl,
                    Body: binaryObject
                },
                function(err, data) {
                    if (err) {
                   	 	window.wxc.xcConfirm('图片上传失败');
                        return;
                    }
                    commentPost(bucket, fileUrl, content);
                });
            }).
            catch(function(err) {
                window.wxc.xcConfirm('图片上传失败');
            });
        } else { 
            commentPost('', '', content);
        }
    });
    
    $("#selectFile").click(function() {
        $("#file").trigger("click");
    });
});

Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        //月份   
        "d+": this.getDate(),
        //日   
        "h+": this.getHours(),
        //小时   
        "m+": this.getMinutes(),
        //分   
        "s+": this.getSeconds(),
        //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3),
        //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function getOssUrl(bucket, url) {
    if (url.toLowerCase().substring(0,4)=='http') {
        return url;
    } else if (bucket != null && bucket.length > 0 && url != null && url.length > 0) {
        return 'http://' + bucket + '.oss-cn-beijing.aliyuncs.com/' + url;
    }
    return "";
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

function requestActivity() {
    var signatureObject = DeviceJS.getSignature();
    $.ajax({
        type: 'GET',
        url: hostName + '/activity/get',
        data: {
            loginUserId: DeviceJS.loginUser.userId,
			nonce: signatureObject.nonce,
			timestamp: signatureObject.timestamp,
			signature: signatureObject.signature,
            activityId: objectId
        },
        success: function(response) {
            if (response.success == '1') {
                var activity = response.activity;
                $('#commentCount').html(activity.commentCount);
                pageCount = parseInt((activity.commentCount % pageSize == 0 ? activity.commentCount / pageSize: activity.commentCount / pageSize + 1), 10);
                requestComments();
            }
        }
    });
}

function commentLike(loginUserId, commentId) {
    var signatureObject = DeviceJS.getSignature();
    $.ajax({
        type: 'POST',
        url: hostName + '/comment/toggleLike',
        data: {
            loginUserId: DeviceJS.loginUser.userId,
			nonce: signatureObject.nonce,
			timestamp: signatureObject.timestamp,
			signature: signatureObject.signature,
            commentId: commentId
        },
        success: function(response) {
            if (response.success == '1') {
                if (response.toggle == "1") {
                    var likeSpan = $('#like_' + commentId);
                    likeSpan.html(parseInt(likeSpan.html(), 10) + 1);
                    likeSpan.prev('a').children('img').attr('src', '../images/zan_nor.png');
                } else {
                    var likeSpan = $('#like_' + commentId);
                    likeSpan.html(parseInt(likeSpan.html(), 10) - 1);
                    likeSpan.prev('a').children('img').attr('src', '../images/zan_hover.png');
                }
            } else {
          	  	window.wxc.xcConfirm(response.message);
            }
        }
    });
}

function requestComments() {
    if (isInit) {
        isInit = false;
        $('#comment').append('<center id="loading"><img src="../../images/loading.gif" width="20"></center>');
        var signatureObject = DeviceJS.getSignature();
        self.setTimeout(function() {
            $.ajax({
                type: 'GET',
                url: hostName + '/comment/getComments',
                data: {
                    loginUserId: DeviceJS.loginUser.userId,
					nonce: signatureObject.nonce,
					timestamp: signatureObject.timestamp,
					signature: signatureObject.signature,
                    type: type,
                    objectId: objectId,
                    pageNo: pageNo,
                    pageSize: pageSize
                },
                success: function(response) {
                    if (response.success == '1') {
                        var comments = response.comments;
                        var userExts = {};
                        if (response.userExts && response.userExts.length > 0) {
                            for (var i = 0; i < response.userExts.length; i++) {
                                var ue = response.userExts[i];
                                userExts[ue.userId] = ue;
                            }
                        }
                        if (comments && comments.length > 0) {
                            var htmls = "";
                            var longTime1 = new Date().getTime();
                            for (var i = 0; i < comments.length; i++) {
                                var cm = response.comments[i];
                                var ue = userExts[cm.userId];
                                var cmId = cm.commentId;
                                $(".likeCount").html(cmId.likeCount);

                                var content = "";
                                if (comments.content && comments.content.length > 0) {
                                    content += '<p class="lead text-indent2" style="margin-bottom:-5px;">';
                                    content += Emoji.trans(decodeURIComponent(comments.content));
                                    content += '</p>';
                                }
                                var nickName = "";
                                if (cm.userId == '' || cm.userId == '0') {
                                    nickName = "游客";
                                } else {
                                    nickName = decodeURIComponent(ue.nickName);
                                }
                                var headPhotoUrl = '';
                                if (!ue.bucket || ue.bucket.length == 0 || !ue.headPhoto || ue.headPhoto.length == 0) {
                                    headPhotoUrl = getOssUrl('gamecircle-pic', 'default-head-photo.jpeg');
                                } else {
                                    headPhotoUrl = getOssUrl(ue.bucket, ue.headPhoto);
                                }
                                var commentDateTime = stringToDate(cm.time);
                                var longTime2 = commentDateTime.getTime();
                                var diffTime = '';
                                if (longTime1 < longTime2) {
                                    diffTime = commentDateTime('yyyy-MM-dd hh:mm:ss');
                                } else {
                                    diffTime = getDateDiff(longTime1, longTime2);
                                }
                                htmls += getCommentHtml(cm.commentId, cm.likeCount, cm.userId, nickName, headPhotoUrl, getOssUrl(cm.bucket, cm.attachmentUrl), Emoji.trans(decodeURIComponent(cm.content)), diffTime);
                            }
                            $('#comment').append(htmls);
                        }
                        $('#loading').remove();
                        isInit = true;
                        pageNo++;
                    }
                }
            });
        });
    }
}

function getCommentHtml(commentId, likeCount, userId, nickName, headPhotoUrl, commentFileUrl, commentContent, stime) {
    if (commentFileUrl.length > 0) {
        commentFileUrl = '<img src="' + commentFileUrl + '" class="pic" toggleSize="false" onclick="imgClick(this)"/>';
    }
    var s = '<div class="media border-b" style="background:#fff;">';
    s += '<div class="media-left"><a><img class="media-object" width="50" src="' + headPhotoUrl + '" onclick="clickURL(\'' + userId + '\')"></a></div>';
    s += '<div class="media-body"><h5 class="media-heading"><span style="color:#888888;"  onclick="clickURL(\'' + userId + '\')">' + nickName + '</span><br/><span style="color:#CBCBCB;line-height:30px;font-size:12px;">' + stime + '</span></h5>' + commentFileUrl + '<p style="color:#474747;font-size:15px;">' + commentContent + '</p></div>';
    s += '<div class="media-right" style="padding-right:5px;" onclick="commentLike(\'' + DeviceJS.loginUser.userId + '\',\'' + commentId + '\')"><a href="javascript:;"><img src="../images/zan_hover.png" /></a><span id="like_' + commentId + '" class="likeCount" style="padding:4px 3px 0 3px;" class="pull-right">' + likeCount + '</span></div>';
    s += "</div>";
    return s;
}

function imgClick(_this) {
    var WT = $(_this).parent(".media-body").width();
    var toggleSize = $(_this).attr("toggleSize");
    if (toggleSize == "true") {
        $(_this).css({
            "width": "60px",
            "height": "60px"
        });
        $(_this).attr("toggleSize", "false");
    } else {
        $(_this).css({
            "width": WT,
            "height": "auto"
        });
        $(_this).attr("toggleSize", "true");
    }

}

function clickURL(userId) {
    if (userId != 0 && userId != "0") {
    	window.location.href = 'gamecircle://user/userDetail/?id=' + userId;
    }
}

function requestSts() {
	var signatureObject = DeviceJS.getSignature();
	$.ajax({
        type: 'GET',
        url: hostName + '/sts/get',
        data: {
            loginUserId: DeviceJS.loginUser.userId,
			nonce: signatureObject.nonce,
			timestamp: signatureObject.timestamp,
			signature: signatureObject.signature
        },
        success: function(response) {
            if (response.success == '1') {
                stsToken = {
                    'Credentials': {
                        'AccessKeyId': response.data.accessKeyId,
                        'SecurityToken': response.data.securityToken,
                        'AccessKeySecret': response.data.accessKeySecret
                    }
                }
            }
        }
    });
}

DeviceJS.onLoginUserInit = function(o) {
    if (this.loginUser != null && this.loginUser.userType == '0') {
        $("#footer").css('display', 'block');
        var fwidth = parseInt($("#footer").width()) - 116;
        $("#answer").width(fwidth + "px");
    }

    requestActivity();
    requestComments();
    requestSts();
    
    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();　　
        var scrollHeight = $(document).height();　　
        var windowHeight = $(this).height();　　
        if (scrollTop + windowHeight == scrollHeight) {　　
            if (pageNo <= pageCount) {
                requestComments();
            }　　
        }
    });
}