/**
 * Created by hzyy on 2016/11/21.
 */
$(document).ready(function(){
    //		rem布局设置
    var win = document.getElementById('html');
    var w = document.documentElement.clientWidth;
    win.style.fontSize = w*0.015625 + 'px';
    window.onresize = function(){
        var w = document.documentElement.clientWidth;
        win.style.fontSize = w*0.015625 + 'px';
    }
    $('.list_lh li:even').addClass('lieven');
    $(".fx").click(function(){
        $(".fx-tq").slideToggle("fast");
    });
})

var judge = false;
var $rotaryArrow = $('#rotaryArrow');
var $result = $('#result');
var $resultTxt = $('#resultTxt');
var $resultBtn = $('#result');
var userSurplusCount;
var time = null;
time=setInterval(function () {
    if (DeviceJS.loginUser.userId != null && DeviceJS.loginUser.token != null) {
        ApiJS.signRequest('GET', '/lotterydraw/getResults', {
                loginUserId: DeviceJS.loginUser.userId,
                token: DeviceJS.loginUser.token,
                //loginUserId: '159067113943044096',
                //token: 'B5F30B419BFD6DEF121BB841DDC9A1C5',
                lotteryDrawId: '530529609456078848'
            },
            function(response){
                if (response.success == '1') {
                    var results = response.data.results;
                    userSurplusCount = response.data.userSurplusCount;
                    $(".userSurplusCount span").html(userSurplusCount);
                    if (results && results.length > 0) {
                        var htmls = "";
                        for (var i = 0; i < results.length; i++) {
                            var configName = results[i].configName;
                            var configLevel = results[i].configLevel;
                            var winnerUserNickName = results[i].winnerUserNickName;
                            var winnerExpressionResult = results[i].winnerExpressionResult;
                            $('.uesrPrize').append(
                                getPrizeHtml(
                                    configLevel,
                                    decodeURIComponent(winnerUserNickName),
                                    decodeURIComponent(configName),
                                    winnerExpressionResult
                                )
                            );
                        }
                        var prizeHeight = $('.uesrPrize').height();
                        prizeHeight = prizeHeight - 100;
                        $(".list_lh").myScroll({
                            speed:40,
                            rowHeight:prizeHeight
                        });
                    }

                };
            }
        );



        function getPrizeHtml(configLevel,winnerUserNickName, configName, winnerExpressionResult) {
            var s = '';
            if (configLevel == 1) {
                s += '<li><p class="winnerUserNickName">玩家:'+winnerUserNickName+'</p><p class="prize">获得了<em>'+configName+'</em>一部</p></li>';
            }
            else if(configLevel == 2 || configLevel == 3) {
                s += '<li><p class="winnerUserNickName">玩家:'+winnerUserNickName+'</p><p class="prize">获得了<em>'+configName+'</em>元红包一个</p></li>';
            }
            else if(configLevel == 4) {
                s += '<li><p class="winnerUserNickName">玩家:'+winnerUserNickName+'</p><p class="prize">获得了<em>' + winnerExpressionResult + '</em>元红包一个</p></li>';
            }
            else if(configLevel == 5 || configLevel == 4) {
                s += '<li><p class="winnerUserNickName">玩家:'+winnerUserNickName+'</p><p class="prize">获得了<em>'+configName+'</em>一个</p></li>';
            }
            return s;
        }
        $resultBtn.click(function(){
            $result.hide();
        });
        clearInterval(time);
    }
},100);


$rotaryArrow.click(function(){
    window.wxc.xcConfirm("活动已经结束了<br/>请多多关注其他热门活动");
    //if(DeviceJS.loginUser.token == ''|| DeviceJS.loginUser.token == '(null)'){
    //    if(DeviceJS.loginUser.device.deviceType =='android'){
    //        window.location.href = 'app://activity/ActivityOperateAction?class=com.ymcx.gamecircle.activity.LoginRegistActivity';
    //    }else{
    //        window.location.href = 'gamecircle://login/loginDetail?id='+DeviceJS.loginUser.userId;
    //    }
    //}else if(userSurplusCount == '0'){
    //    $result.html('<p class="text3">高玩大大，今天的</p><p class="text3" style="margin-top: 0.2rem">抽奖机会已经用光咯</p><a href="javascript:" id="resultBtn" title="关闭">关闭</a>');
    //    $result.show();
    //}else {
    //    ApiJS.signRequest('POST', '/lotterydraw/draw', {
    //            loginUserId: DeviceJS.loginUser.userId,
    //            token: DeviceJS.loginUser.token,
    //            //loginUserId: '159067113943044096',
    //            //token: 'B5F30B419BFD6DEF121BB841DDC9A1C5',
    //            lotteryDrawId: '530529609456078848'
    //        },
    //        function(response){
    //            if (response.success == '1') {
    //                var result = response.data.result;
    //                var configLevel = JSON.parse(result.configLevel);
    //                var winnerExpressionResult = result.winnerExpressionResult;
    //                userSurplusCount--;
    //                $(".userSurplusCount span").html(userSurplusCount);
    //                if(configLevel==8){
    //                    var arr = [7,8];
    //                    var index = Math.floor((Math.random()*arr.length));
    //                    configLevel = arr[index];
    //                }
    //                switch(configLevel){
    //                    case 1:
    //                        rotateFunc(1,23,'<p class="text1">恭喜你</p><p class="text2">获得<em>iphone7 plus</em>一部</p><a href="javascript:" id="resultBtn" title="关闭">关闭</a>');
    //                        break;
    //                    case 2:
    //                        rotateFunc(2,68,'<p class="text1">恭喜你</p><p class="text2">获得<em>30</em>元红包一个</p><a href="javascript:" id="resultBtn" title="关闭">关闭</a>');
    //                        break;
    //                    case 3:
    //                        rotateFunc(4,158,'<p class="text1">恭喜你</p><p class="text2">获得<em>10</em>元红包一个</p><a href="javascript:" id="resultBtn" title="关闭">关闭</a>');
    //                        break;
    //                    case 5:
    //                        rotateFunc(6,203,'<p class="text1">恭喜你</p><p class="text2">获得<em>全民战群英鼠标垫</em>一个</p><a href="javascript:" id="resultBtn" title="关闭">关闭</a>');
    //                        break;
    //                    case 6:
    //                        rotateFunc(8,338,'<p class="text1">恭喜你</p><p class="text2">获得<em>赛尔号超级英雄手办</em>一个</p><a href="javascript:" id="resultBtn" title="关闭">关闭</a>');
    //                        break;
    //                    case 4:
    //                        rotateFunc(5,248,'<p class="text1">恭喜你</p><p class="text2">获得<em>' + winnerExpressionResult + '</em>元红包一个</p><a href="javascript:" id="resultBtn" title="关闭">关闭</a>');
    //                        break;
    //                    case 7:
    //                        rotateFunc(3,113,'<p class="text3">高玩大大不要气馁</p><p class="text3" style="margin-top: 0.2rem">再接再厉哟</p><a href="javascript:" id="resultBtn" title="关闭">关闭</a>');
    //                        break;
    //                    case 8:
    //                        rotateFunc(7,293,'<p class="text3">高玩大大不要气馁</p><p class="text3" style="margin-top: 0.2rem">再接再厉哟</p><a href="javascript:" id="resultBtn" title="关闭">关闭</a>');
    //                        break;
    //                }
    //            };
    //        }
    //    );
    //}

});

var rotateFunc = function(awards,angle,text){  //awards:奖项，angle:奖项对应的角度
    $rotaryArrow.attr('disabled','disabled');
    $rotaryArrow.stopRotate();
    $rotaryArrow.rotate({
        angle: 0,
        duration: 5000,
        animateTo: angle + 1440,  //angle是图片上各奖项对应的角度，1440是让指针固定旋转4圈
        callback: function(){
            $result.html(text);
            $result.show();
            $rotaryArrow.removeAttr('disabled')
        }
    });
};

//分享
$(".fx-tq button").on('touchstart',function(){
    var appVersion = DeviceJS.loginUser.device.appVersion != null && DeviceJS.loginUser.device.appVersion != '' ? DeviceJS.loginUser.device.appVersion : DeviceJS.loginUser.device.version;
    var shareType = $(this).attr("name");
    var json = {};
    var title = 'iPhone7 Plus抢到手软';
    var content = '圣诞狂欢大转盘';
    var imageUrl = 'http://www.youmengchuangxiang.com/app/activity/zp/img/banner.jpg';
    var url = 'http://www.youmengchuangxiang.com/app/activity/zp/pc/index.html';
    json['shareType'] = shareType;
    json['title'] = title;
    json['content'] = content;
    json['imageUrl'] = imageUrl;
    json['url'] = url;
    json['objectId'] = '530528583472041984';
    if (appVersion.substr(0, 4) < '3.12') {
        ReportJS.report({
            'eventId': 'activity_participate',
            'userId': DeviceJS.loginUser.userId,
            'userType': DeviceJS.loginUser.userType,
            'channelId': DeviceJS.loginUser.device.channelId,
            'deviceType': DeviceJS.loginUser.device.deviceType,
            'deviceId': DeviceJS.loginUser.device.deviceId,
            'manufacturer': DeviceJS.loginUser.device.manufacturer,
            'model': DeviceJS.loginUser.device.model,
            'osVersion': DeviceJS.loginUser.device.osVersion,
            'appVersion': DeviceJS.loginUser.device.appVersion != null && DeviceJS.loginUser.device.appVersion != '' ? DeviceJS.loginUser.device.appVersion : DeviceJS.loginUser.device.version,
            'params': '{"activityId":"530528583472041984"}'
        });
        if (DeviceJS.loginUser.device.deviceType == "android") {
            android.share(shareType, title, content, imageUrl, url)
        } else {
            share(shareType, title, content, imageUrl, url)
        }
    } else {
        if (DeviceJS.loginUser.device.deviceType == "android") {
            android.share(JSON.stringify(json))
        } else {
            share(JSON.stringify(json))
        }
    }
})


function shareCallback(code){
    if(code==1){
        ApiJS.signRequest('GET', '/lotterydraw/getResults', {
                loginUserId: DeviceJS.loginUser.userId,
                token: DeviceJS.loginUser.token,
                lotteryDrawId: '530529609456078848'
            },
            function(response){
                if (response.success == '1') {
                    userSurplusCount = response.data.userSurplusCount;
                    $(".userSurplusCount span").html(userSurplusCount);
                }
            }
        );
    }else if(code==0){
        $result.html('<p class="text3">哎呀，小达人偷懒了</p><p class="text3" style="margin-top: 0.2rem">请高玩大大过一会再分享一次</p><a href="javascript:" id="resultBtn" title="关闭">关闭</a>');
        $result.show();
    }
}

