
var judge = false;
var $rotaryArrow = $('#rotaryArrow');
var $zhen = $('.rotaryArrow');
var $result = $('.dialog-4');
var userSurplusCount;
var time1 = null;
var isLoad1 = false;
var isLoad2 = false;
var isLoad3 = false;
var time2 = null;
var activityId = '566817856852560896';
var lotteryDrawId = '567046766654229504';
//var aa = '159067113943044096';
//var bb = '28A10AD8BAB2C6B610B8F55198EBC11A';

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}
if(getQueryString('playerId')){
    time1=setInterval(function () {
        if (DeviceJS.loginUser.userId != '' && DeviceJS.loginUser.token != '' ){
            if(!isLoad1) {
                isLoad1 = true;
                window.clearInterval(time1);
                ApiJS.signRequest('GET', '/lotterydraw/getResults', {
                        loginUserId: DeviceJS.loginUser.userId,
                        token: DeviceJS.loginUser.token,
                        //loginUserId: aa,
                        //token: bb,
                        lotteryDrawId: lotteryDrawId
                    },
                    function(response){
                        if (response.success == '1') {
                            var results = response.data.results;
                            userSurplusCount = response.data.userSurplusCount;
                            $(".choujiang-down span").html(userSurplusCount);
                            if (results && results.length > 0) {
                                var htmls = "";
                                for (var i = 0; i < results.length; i++) {
                                    var configName = results[i].configName;
                                    var configLevel = results[i].configLevel;
                                    var winnerUserNickName = results[i].winnerUserNickName;
                                    var winnerExpressionResult = results[i].winnerExpressionResult;
                                    $('.list_lh_player .uesrPrize').append(
                                        getPrizeHtml(
                                            configLevel,
                                            decodeURIComponent(winnerUserNickName),
                                            decodeURIComponent(configName),
                                            winnerExpressionResult
                                        )
                                    );
                                }
                            }
                        }
                    }
                );
            }
        }
    },1);
}else{
    time2=setInterval(function () {
        if (DeviceJS.loginUser.userId != '' && DeviceJS.loginUser.token != '') {
            if(!isLoad2) {
                isLoad2 = true;
                window.clearInterval(time2);
                ApiJS.signRequest('GET', '/lotterydraw/getResults', {
                        loginUserId: DeviceJS.loginUser.userId,
                        token: DeviceJS.loginUser.token,
                        //loginUserId: aa,
                        //token: bb,
                        lotteryDrawId: lotteryDrawId
                    },
                    function(response){
                        if (response.success == '1') {
                            console.log(response)
                            if (response.success == '1') {
                                var results = response.data.results;
                                userSurplusCount = response.data.userSurplusCount;
                                $(".choujiang-down span").html(userSurplusCount);
                                if (results && results.length > 0) {
                                    var htmls = "";
                                    for (var i = 0; i < results.length; i++) {
                                        var configName = results[i].configName;
                                        var configLevel = results[i].configLevel;
                                        var winnerUserNickName = results[i].winnerUserNickName;
                                        var winnerExpressionResult = results[i].winnerExpressionResult;
                                        $('.list_lh_vote .uesrPrize').append(
                                            getPrizeHtml(
                                                configLevel,
                                                decodeURIComponent(winnerUserNickName),
                                                decodeURIComponent(configName),
                                                winnerExpressionResult
                                            )
                                        );
                                    }
                                }
                            }
                        }
                    }
                );
            }
        }
    },1);

}


function getPrizeHtml(configLevel,winnerUserNickName, configName, winnerExpressionResult) {
    var s = '';
    if (configLevel == 1 || configLevel == 2) {
        s += '<li><p class="winnerUserNickName">玩家:'+winnerUserNickName+'</p><p class="prize">获得了<em>'+configName+'</em>一部</p></li>';
    }else if(configLevel == 3){
        s += '<li><p class="winnerUserNickName">玩家:'+winnerUserNickName+'</p><p class="prize">获得了<em>'+configName+'</em>一台</p></li>';
    }else if(configLevel == 4){
        s += '<li><p class="winnerUserNickName">玩家:'+winnerUserNickName+'</p><p class="prize">获得了<em>'+configName+'</em>一个</p></li>';
    }else if(configLevel == 5 || configLevel == 6){
        s += '<li><p class="winnerUserNickName">玩家:'+winnerUserNickName+'</p><p class="prize">获得了<em>'+configName+'</em>卡一张</p></li>';
    }
    //else if(configLevel == 10|| configLevel == 11|| configLevel == 12) {
    //    s += '<li><p class="winnerUserNickName">玩家:'+winnerUserNickName+'</p><p class="prize">谢谢参与</p></li>';
    //}
    return s;
}
$rotaryArrow.click(function(){
  if(DeviceJS.loginUser.token == ''|| DeviceJS.loginUser.token == '(null)'){
      if(DeviceJS.loginUser.device.deviceType =='android'){
          window.location.href = 'app://activity/ActivityOperateAction?class=com.ymcx.gamecircle.activity.LoginRegistActivity';
      }else{
          window.location.href = 'gamecircle://login/loginDetail?id='+DeviceJS.loginUser.userId;
      }
  }else if(userSurplusCount == '0'){
      $('.dialog-4 .tcenter').html('<p class="text3">高玩大大，今天的</p><p class="text3" style="margin-top: 0.2rem">抽奖机会已经用光咯</p>');
      $result.show();
  }else {
      ApiJS.signRequest('POST', '/lotterydraw/draw', {
              loginUserId: DeviceJS.loginUser.userId,
              token: DeviceJS.loginUser.token,
              //loginUserId: aa,
              //token: bb,
              lotteryDrawId: lotteryDrawId
          },
          function(response){
              //alert(response.message);
              if (response.success == '1') {
                  var result = response.data.result;
                  var configLevel = JSON.parse(result.configLevel);
                  var winnerExpressionResult = result.winnerExpressionResult;
                  userSurplusCount--;
                  $(".choujiang-down span").html(userSurplusCount);
                  var a = 5;
                  var arry = [1,2,3,4,5,6]
                  if (arry.indexOf(configLevel) >= 0) {
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
                        'params': '{"activityId":"566817856852560896"}'
                      },function(response){
                        
                      });
                  }
                  var arr = [];
                  var index = '' ;
                  if(configLevel==7){
                      arr = [10,11,12];
                      index = Math.floor((Math.random()*arr.length));
                      configLevel = arr[index];
                  }else if(configLevel==6){
                      arr = [7,8,9];
                      index = Math.floor((Math.random()*arr.length));
                      configLevel = arr[index];
                  }else if(configLevel==5){
                      arr = [5,6];
                      index = Math.floor((Math.random()*arr.length));
                      configLevel = arr[index];
                  }
                  switch(configLevel){
                      case 1:
                          rotateFunc(315,'<p class="text1">恭喜你</p><p class="text2">获得iPHONE7一部</p>');
                          break;
                      case 2:
                          rotateFunc(45,'<p class="text1">恭喜你</p><p class="text2">获得小米5S一部</p>');
                          break;
                      case 3:
                          rotateFunc(135,'<p class="text1">恭喜你</p><p class="text2">获得小米平衡车一台</p>');
                          break;
                      case 4:
                          rotateFunc(225,'<p class="text1">恭喜你</p><p class="text2">获得雷蛇鼠标一个</p>');
                          break;
                      case 5:
                          rotateFunc(15,'<p class="text1">恭喜你</p><p class="text2">获得100QB卡一张</p>');
                          break;
                      case 6:
                          rotateFunc(295,'<p class="text1">恭喜你</p><p class="text2">获得100QB卡一张</p>');
                          break;
                      case 7:
                          rotateFunc(75,'<p class="text1">恭喜你</p><p class="text2">获得30QB卡一张</p>');
                          break;
                      case 8:
                          rotateFunc(195,'<p class="text1">恭喜你</p><p class="text2">获得30QB卡一张</p>');
                          break;
                      case 9:
                          rotateFunc(265,'<p class="text1">恭喜你</p><p class="text2">获得30QB卡一张</p>');
                          break;
                      case 10:
                          rotateFunc(105,'<p class="text3">高玩大大不要气馁</p><p class="text3" style="margin-top: 0.2rem">再接再厉哟</p>');
                          break;
                      case 11:
                          rotateFunc(165,'<p class="text3">高玩大大不要气馁</p><p class="text3" style="margin-top: 0.2rem">再接再厉哟</p>');
                          break;
                      case 12:
                          rotateFunc(345,'<p class="text3">高玩大大不要气馁</p><p class="text3" style="margin-top: 0.2rem">再接再厉哟</p>');
                          break;
                  }
              }
          }
      );
  }

});

var rotateFunc = function(angle,text){  //angle:奖项对应的角度
  $rotaryArrow.attr('disabled','disabled');
  $zhen.stopRotate();
  $zhen.rotate({
    angle: 0,
    duration: 7000,
    animateTo: angle + 1440,  //angle是图片上各奖项对应的角度，1440是让指针固定旋转4圈
    callback: function(){
        $('.dialog-4 .tcenter').html(text);
        $result.show();
        $rotaryArrow.removeAttr('disabled')
    }
  });
};

//分享
$(".sus .share-wei").on('touchstart',function(){
  var appVersion = DeviceJS.loginUser.device.appVersion != null && DeviceJS.loginUser.device.appVersion != '' ? DeviceJS.loginUser.device.appVersion : DeviceJS.loginUser.device.version;
  var shareType = $(this).attr("name");
  var json = {};
  var title = '玩家盛典投票活动火爆开启';
  var content = '玩家盛典晋级投票赢好礼';
  var imageUrl = 'http://www.youmengchuangxiang.com/app/activity/wjsd-tp/300-300.jpg';
  var url = 'http://e.games.sina.com.cn/wjsd/home';
  json['shareType'] = shareType;
  json['title'] = title;
  json['content'] = content;
  json['imageUrl'] = imageUrl;
  json['url'] = url;
  json['objectId'] = activityId;
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
      'params': '{"activityId":"'+activityId+'"}'
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
          lotteryDrawId: lotteryDrawId
        },
        function(response){
          if (response.success == '1') {
              var results = response.data.results;
              userSurplusCount = response.data.userSurplusCount;
              $(".choujiang-down span").html(userSurplusCount);
              if (results && results.length > 0) {
                  var htmls = "";
                  for (var i = 0; i < results.length; i++) {
                      var configName = results[i].configName;
                      var configLevel = results[i].configLevel;
                      var winnerUserNickName = results[i].winnerUserNickName;
                      var winnerExpressionResult = results[i].winnerExpressionResult;
                      $('.list_lh .uesrPrize').append(
                          getPrizeHtml(
                              configLevel,
                              decodeURIComponent(winnerUserNickName),
                              decodeURIComponent(configName),
                              winnerExpressionResult
                          )
                      );
                  }
              }
          }
        }
    );
  }else if(code==0){
    $('.dialog-4 .tcenter').html('<p class="text3">哎呀，小达人偷懒了</p><p class="text3" style="margin-top: 0.2rem">请高玩大大过一会再分享一次</p>');
    $result.show();
  }
}

var time3 = null;
time3=setInterval(function () {
    if($('.uesrPrize').height()>0){
        if(!isLoad3) {
            window.clearInterval(time3);
            var prizeHeight = $('.uesrPrize').height();
            prizeHeight = prizeHeight - 10;
            $(".list_lh").myScroll({
                speed:100,
                rowHeight:prizeHeight
            });
        }
    }
},1);