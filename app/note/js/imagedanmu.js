function ImageDanmu(noteId, noteAttachId) {
    this.tag = 0;
    this.noteId = noteId;
    this.noteAttachId = noteAttachId;
    this.pageNextId = 0;
    this.pageSize = 20;
    this.playing = false;
    this.loadComplete = false;
    this.danmuViewCount = 10;
    this.danmuList = [];
    this.danmuListCursor = 0;
    this.danmuHideCursor = 0;
    this.minDurationTime = 1500;
    this.maxDurationTime = 6000;
    this.growDurationTime = 100;
    this.fadeInTime = 2000;
    this.fadeOutTime = 2000;
    this.state = 1;

    this.requestDanmuComment = function () {
        var scope = this;
        ApiJS.signRequest('GET', '/v20160912/comment/getComments', {
                type: 3,
                objectId: scope.noteId,
                subObjectId: scope.noteAttachId,
                pageNextId: scope.pageNextId,
                pageSize: scope.pageSize
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
                        for (var i = 0; i < comments.length; i++) {
                            var cm = comments[i];
                            var ue = userExts[cm.userId];
                            if (ue.bucket.length == 0 || ue.headPhoto.length == 0) {
                                ue.bucket = 'gamecircle-pic';
                                ue.headPhoto = 'default-head-photo.jpeg';
                            }
                            if (cm.axisX != '' && cm.axisX != '-1.0' && cm.axisY != '' && cm.axisY != '-1.0') {
                                var x = parseFloat(cm.axisX);
                                var y = parseFloat(cm.axisY);
                                scope.danmuList.push({
                                    id: cm.commentId,
                                    icon: CommonJS.getOssUrl(ue.bucket, ue.headPhoto),
                                    text: Emoji.trans(decodeURIComponent(cm.content)),
                                    mood: cm.mood,
                                    top: parseInt((scope.danmuImgHeight * y), 10),
                                    left: parseInt((scope.danmuImgWidth * x), 10)
                                });
                            }
                            if (i == comments.length - 1) {
                                scope.pageNextId = comments[i].commentId;
                            }
                        }
                    } else {
                        scope.loadComplete = true;
                    }
                }
            });
    };

    this.start = function () {
        if (this.playing == false) {
            this.init();
            var scope = this;
            this.intervalInstance = setInterval(function () {
                scope.addDanmu();
            }, 1500);
            this.playing = true;
        }
    };

    this.init = function () {
        this.danmuContainer = $('.' + noteAttachId);
        this.danmuImgWidth = this.danmuContainer.width();
        this.danmuImgHeight = this.danmuContainer.height();
        this.resetHideCursor();
    };

    this.resetHideCursor = function () {
        this.danmuHideCursor = 0;
        this.danmuHideCursor = this.danmuHideCursor - this.danmuViewCount;
    };

    this.createDanmuElement = function (configure) {
        var background = '#112f23', fontColor = '#afffe0', borderColor = '#27C687';
        if (configure.mood == '0') {
            background = '#1b1b1b';
            fontColor = 'white';
            borderColor = 'white';
        }
        var c_left = parseInt(configure.left);
        var c_top = parseInt(configure.top);

        var elementString = '<div id="' + configure.id + '" style="display:none;position:absolute;opacity:0.8;top:' + c_top + 'px;left:' + c_left + 'px;">';
        elementString += '<div class="media">';
        if (c_left > this.danmuImgWidth / 2) {
            elementString += '<div class="media-body danmuLabel" style="white-space:nowrap;padding:5px 10px;color:' + fontColor + ';background:' + background + ';border:3px solid ' + borderColor + ';">' + configure.text + '</div>';
            elementString += '<div class="media-left" style="padding-left:0px;padding-right: 0px;"  ><a><img class="media-object" style="display:block;width:30px;height:30px;border-radius:100%;border:3px solid ' + borderColor + ';" src="' + configure.icon + '"></a></div>';
        } else {
            elementString += '<div class="media-left" style="padding-right:0px;"><a><img class="media-object" style="display:block;width:30px;height:30px;border-radius:100%;border:3px solid ' + borderColor + ';" src="' + configure.icon + '"></a></div>';
            elementString += '<div class="media-body danmuLabel" style="white-space:nowrap;padding:5px 10px;color:' + fontColor + ';background:' + background + ';border:3px solid ' + borderColor + ';">' + configure.text + '</div>';
        }
        elementString += '</div></div>';
        this.danmuContainer.append(elementString);

        var danmuWidth = $('#' + configure.id).width();
        var danmuHeight = $('#' + configure.id).height();
        if (danmuWidth + c_left - this.danmuImgWidth > 0) {
            $('#' + configure.id).css('left', (this.danmuImgWidth - danmuWidth) + 'px');
        }
        if (danmuHeight + c_top - this.danmuImgHeight > 0) {
            $('#' + configure.id).css('top', (this.danmuImgHeight - danmuHeight) + 'px');
        }
    };

    this.addDanmu = function () {
        if (this.danmuList.length > 0) {
            var configure = this.danmuList[this.danmuListCursor];
            if (configure != null) {
                if ($('#' + configure.id).length == 0) {
                    this.createDanmuElement(configure);
                }
                if (this.state == 1) {
                    $('#' + configure.id).fadeIn(this.fadeInTime);
                }
            }
            if (this.danmuListCursor < this.danmuList.length) {
                this.danmuListCursor++;
                this.danmuHideCursor++;
            }
        }
        if (this.danmuHideCursor >= 0) {
            var configure = this.danmuList[this.danmuHideCursor];
            if (configure != null) {
                $('#' + configure.id).fadeOut(this.fadeOutTime);
            }
        } else {
            if (this.danmuList.length < this.danmuViewCount && this.danmuListCursor == this.danmuList.length) {
                this.danmuContainer.children('div').fadeOut(this.fadeOutTime);
                this.resetHideCursor();
            }
        }
        if (this.danmuHideCursor == this.danmuList.length) {
            if (this.loadComplete) {
                this.danmuHideCursor = 0;
            }
        }
        if (this.danmuListCursor == this.danmuList.length) {
            if (this.loadComplete) {
                this.danmuListCursor = 0;
            } else {
                this.requestDanmuComment();
            }
        }
    };

    this.getDurationTime = function (len) {
        if (len < 12) {
            return this.minDurationTime;
        }
        var time = len * this.growDurationTime;
        if (time > this.maxDurationTime) {
            time = this.maxDurationTime;
        }
        return time;
    };

    this.toggleState = function () {
        if (this.state == 1) {
            this.state = 0;
            this.danmuContainer.children('div').css("display", "none");
        } else {
            this.state = 1;
        }
    }
}
