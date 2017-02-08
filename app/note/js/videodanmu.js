function VideoDanmu(noteId, noteAttachId) {
    this.tag = 1;
    this.noteId = noteId;
    this.noteAttachId = noteAttachId;
    this.pageNextId = 0;
    this.pageSize = 20;
    this.playing = false;
    this.loading = false;
    this.danmuList = {};
    this.danmuCurrentTime = 0;
    this.state = 1;

    var scope = this;
    $('#' + noteAttachId).on({
        click: function () {
            scope.videoPlay();
        },
        play: function () {
            scope.start();
        },
        pause: function () {
            scope.paused();
        },
        seeked: function () {
            scope.seeked();
        },
        timeupdate: function () {
            scope.show();
        }
    });

    this.requestDanmuComment = function () {
        var scope = this;
        if (scope.loading == false) {
            scope.loading = true;
            ApiJS.signRequest('GET', '/v20160912/comment/getComments', {
                    type: 3,
                    objectId: scope.noteId,
                    subObjectId: scope.noteAttachId,
                    pageNextId: 0,
                    pageSize: 0
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
                        if (response.data.comments && response.data.comments.length > 0) {
                            var comments = response['data']['comments'];
                            if (comments && comments.length > 0) {
                                for (var i = 0; i < comments.length; i++) {
                                    var cm = comments[i];
                                    var ue = userExts[cm.userId];
                                    if (ue.bucket.length == 0 || ue.headPhoto.length == 0) {
                                        ue.bucket = 'gamecircle-pic';
                                        ue.headPhoto = 'default-head-photo.jpeg';
                                    }
                                    if (scope.danmuList[cm.axisTime]) {
                                        scope.danmuList[cm.axisTime].push({
                                            id: cm.commentId,
                                            icon: getOssUrl(ue.bucket, ue.headPhoto),
                                            text: Emoji.trans(decodeURIComponent(cm.content)),
                                            mood: cm.mood,
                                            axisTime: cm.axisTime,
                                            top: parseInt((scope.danmuImgHeight * parseFloat(cm.axisY)), 10)
                                        });
                                    } else {
                                        scope.danmuList[cm.axisTime] = [];
                                        scope.danmuList[cm.axisTime].push({
                                            id: cm.commentId,
                                            icon: getOssUrl(ue.bucket, ue.headPhoto),
                                            text: Emoji.trans(decodeURIComponent(cm.content)),
                                            mood: cm.mood,
                                            axisTime: cm.axisTime,
                                            top: parseInt((scope.danmuImgHeight * parseFloat(cm.axisY)), 10)
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
        }
    };

    this.start = function () {
        if (this.playing == false) {
            this.init();
            this.requestDanmuComment();
            this.playing = true;
        }
        $('.' + this.noteAttachId + ' div').css("animation-play-state", "running");
        $('.' + this.noteAttachId + ' div').css("-webkit-animation-play-state", "running");
        $('.' + this.noteAttachId + ' div').css("-moz-animation-play-state", "running");
        $('.' + this.noteAttachId + ' div').css("-o-animation-play-state", "running");
        $('.' + this.noteAttachId + ' div').css("-ms-animation-play-state", "running");
        this.danmuCurrentTime = this.danmuVideo.currentTime.toFixed(0);
    };

    this.init = function () {
        var video = $("#" + this.noteAttachId);
        this.danmuImgWidth = video.width();
        this.danmuImgHeight = video.height();
        this.danmuVideo = video[0];
        this.danmuContainer = $('.' + this.noteAttachId);
    };

    this.show = function () {
        var currentTime = this.danmuVideo.currentTime.toFixed(0);
        for (var i = this.danmuCurrentTime; i < currentTime; i++) {
            var danmus = this.danmuList[i];
            if (danmus && danmus.length > 0) {
                for (var j = 0; j < danmus.length; j++) {
                    var configure = danmus[j];
                    if (configure != null) {
                        if (!document.getElementById('d_' + configure.id)) {
                            this.createDanmuElement(configure);
                        }
                        if (this.state == 1) {
                            var labelWidth = $('#d_' + configure.id).width();
                            var start = -(labelWidth);
                            var end = this.danmuImgWidth + labelWidth;
                            this.move(configure.id, start, -end);
                        }
                    }
                }
            }
        }
        this.danmuCurrentTime = currentTime;
    };

    this.createDanmuElement = function (configure) {
        var background = '#112f23', borderColor = '#27C687';
        if (configure.mood == '0') {
            background = '#1b1b1b';
            borderColor = 'white';
        }
        var c_top = parseInt(configure.top);
        if (configure.top > 250) {
            configure.top = 250;
        }
        var elementString = '<div id="d_' + configure.id + '" style="display:none;opacity:0;position:absolute;top:' + configure.top + 'px;">';
        elementString += '<div class="media">';
        elementString += '<div class="media-left" style="padding-right:0px;"><a><img class="media-object" style="display:block;width:30px;height:30px;border-radius:100%;border:3px solid ' + borderColor + ';" src="' + configure.icon + '"></a></div>';
        elementString += '<div id="tex" class="media-body danmuLabel" style="white-space:nowrap;padding:5px 10px;background:' + background + ';border:3px solid ' + borderColor + ';">' + configure.text + '</div>';
        elementString += '</div>';
        this.danmuContainer.append(elementString);
    };

    this.videoPlay = function () {
        if (this.danmuVideo.paused) {
            this.danmuVideo.play();
        } else {
            this.danmuVideo.pause();
        }
    };

    this.move = function (id, start, end) {
        $('#d_' + id).css('display', 'inline');
        $('#danmustyle').append('#d_' + id + ' { right: ' + start + 'px;animation: d_' + id + ' 4s linear; animation: d_' + id + ' 4s linear;  -moz-animation: d_' + id + ' 4s linear;-o-animation: d_' + id + ' 4s linear;-ms-animation: d_' + id + ' 4s linear;} @keyframes d_' + id + ' { 0% {opacity: 0.8;} to { opacity: 0.8; transform: translate3d(' + end + 'px, 0, 0); } }@-moz-keyframes d_' + id + ' { 0% {-moz-opacity: 1;} to { -moz-opacity: 1; -moz-transform: translate3d(' + end + 'px, 0, 0); } } @-o-keyframes d_' + id + ' { 0% {-o-opacity: 1;} to { -o-opacity: 1; -o-transform: translate3d(' + end + 'px, 0, 0); } } @-ms-keyframes d_' + id + ' { 0% {-ms-opacity: 1;} to { -ms-opacity: 1; -ms-transform: translate3d(' + end + 'px, 0, 0); } } @-webkit-keyframes d_' + id + ' { 0% {-webkit-opacity: 1;} to { -webkit-opacity: 1; -webkit-transform: translate3d(' + end + 'px, 0, 0); } }');
    };

    this.paused = function () {
        if (!this.danmuVideo.ended) {
            $('.' + this.noteAttachId + ' div').css('animation-play-state', 'paused');
            $('.' + this.noteAttachId + ' div').css('-webkit-animation-play-state', 'paused');
            $('.' + this.noteAttachId + ' div').css('-moz-animation-play-state', 'paused');
            $('.' + this.noteAttachId + ' div').css('-o-animation-play-state', 'paused');
            $('.' + this.noteAttachId + ' div').css('-ms-animation-play-state', 'paused');
        }
    };

    this.seeked = function () {
        $('#danmustyle').html('');
    };

    this.toggleState = function () {
        if (this.state == 1) {
            this.state = 0;
            this.danmuContainer.children('div').css('display', 'none');
            this.danmuContainer.children('div').stop(true, true);
        } else {
            this.state = 1;
        }
    };
}

