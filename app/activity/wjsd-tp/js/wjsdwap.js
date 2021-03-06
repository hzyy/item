    //首屏高

var activityId = '556509100239405056';
var lotteryDrawId = '556511294370660352';
var isLoad = false;
var time = null;
var voteCount ;
var userSurplusCount ;
var rankplayer;
var className1,contentText1;

    //var aa = '159067113943044096';
    //var bb = '28A10AD8BAB2C6B610B8F55198EBC11A';
time=setInterval(function () {
    if (DeviceJS.loginUser.userId != '' && DeviceJS.loginUser.token != ''&& DeviceJS.loginUser.token != '(null)' && DeviceJS.loginUser.userId != '(null)') {
        if(!isLoad) {
            isLoad = true;
            //alert(DeviceJS.loginUser.userId+'=='+DeviceJS.loginUser.token)
            window.clearInterval(time);
            ApiJS.signRequest('GET', '/vote/getGames', {
                    activityId:activityId,
                    loginUserId: DeviceJS.loginUser.userId,
                    token: DeviceJS.loginUser.token,
                    //loginUserId: aa,
                    //token: bb,
                    lotteryDrawId: lotteryDrawId
                },
                function(response){
                    if (response.success == '1') {
                        var voteGames = response.voteGames;
                        if (voteGames && voteGames.length > 0) {
                            var htmls = "";
                            for (var i = 0; i < voteGames.length; i++) {
                                var s = '<li class='+response.voteGames[i].symbol+' onclick="getGameSymbol(1,this,\'' + response.voteGames[i].symbol + '\')" ><a href="javascript:void(0)"><img src="'+response.voteGames[i].gameLogo+'"></a></li>';
                                $(".cs-logos").append(s)
                            }
                            $(".cs-logos li").css({width:Math.floor((document.documentElement.clientWidth - 10*2 - 5*4)/5),height:Math.floor((76/134)*Math.floor((document.documentElement.clientWidth - 10*2 - 5*4)/5))});
                        }
                    }
                }
            );

            ApiJS.signRequest('GET', '/vote/getTop1Players', {
                    activityId:activityId,
                    loginUserId: DeviceJS.loginUser.userId,
                    token: DeviceJS.loginUser.token
                    //loginUserId: aa,
                    //token: bb
                },
                function(response){
                    if (response.success == '1') {
                        var voteGames = {};
                        if (response.voteGames && response.voteGames.length > 0) {
                            for (var i = 0; i < response.voteGames.length; i++) {
                                var games = response.voteGames[i];
                                voteGames[games.symbol] = games;
                            }
                        }
                        var votePlayers = response.votePlayers;
                        var votePlayerIds = response.votePlayerIds;
                        if (votePlayers && votePlayers.length > 0) {
                            var htmls = "";
                            for (var i = 0; i < votePlayers.length; i++) {
                                var userExts = response.votePlayers[i];
                                var games = voteGames[userExts.gameSymbol];
                                if (votePlayerIds && votePlayerIds.indexOf(userExts.playerId) >= 0) {
                                    rankplayer = 1
                                } else {
                                    rankplayer = undefined;
                                }
                                $(".voteTargets-content").append(
                                    getTop1Players(
                                        '2',
                                        userExts.gameRoleName,
                                        userExts.userName,
                                        userExts.desc,
                                        voteCount = userExts.voteCount,
                                        userExts.playerId,
                                        userExts.photo,
                                        games.gameLogo,
                                        games.symbol,
                                        rankplayer
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

function getGameSymbol(type,obj,symbol) {
    if(symbol=='jw3'){
        $(".voteTargets-jw3").html('<p style="font-size: 20px;color:#F1C61E; ">友情提示：</p><p>参与投票的用户</p><p>我们会在活动结束后随机抽取<span style="color: #F1C61E">30</span>名幸运者</p><p>每人送出<span style="color: #F1C61E">江湖画扇（180天）</span>1把！</p>');
    }else{
        $(".voteTargets-jw3").html('');
    }
    $(".cs-logos li").addClass('mengban');
    if(type=='1'){
        $(obj).removeClass("mengban").siblings().addClass("mengban");
    }else if(type=='3'){
        $('.cs-logos .'+symbol+'').removeClass("mengban").siblings().addClass("mengban");
    }
    ApiJS.signRequest('GET', '/vote/getPlayersByGameSymbol', {
                activityId:activityId,
                loginUserId: DeviceJS.loginUser.userId,
                token: DeviceJS.loginUser.token,
            //loginUserId: aa,
            //token: bb,
                gameSymbol: symbol
            },
            function(response){
                if (response.success == '1') {
                    console.log(response)
                    var voteGame = response.voteGame;
                    var votePlayers = response.votePlayers;
                    var votePlayerIds = response.votePlayerIds;
                    
                    if (votePlayers && votePlayers.length > 0) {
                        var htmls = "";
                        for (var i = 0; i < votePlayers.length; i++) {
                            var userExts = response.votePlayers[i];
                            if (votePlayerIds && votePlayerIds.indexOf(userExts.playerId) >= 0) {
                                rankplayer = 1
                            } else {
                                rankplayer = undefined;
                            }
                            htmls += getTop1Players(
                                type,
                                userExts.gameRoleName,
                                userExts.userName,
                                userExts.desc,
                                voteCount = userExts.voteCount,
                                userExts.playerId,
                                userExts.photo,
                                voteGame.gameLogo,
                                voteGame.symbol,
                                rankplayer
                            )
                        }
                        $(".voteTargets-content").html(htmls);

                    }else{
                        $(".voteTargets-content").html('<p style="color: #aeaba6;line-height: 0.5rem;font-size: 14px;text-align: center;margin:0.5rem 0">暂无玩家信息</p>');
                    }
                }
            }
        );
}

function getTop1Players(type,gameRoleName,userName,desc,voteCount1,playerId,photo,gameLogo,symbol,rankplayer) {
    if (rankplayer == 1) {
        className1 = 'voted';
        contentText1 = '明日再来';
    }else{
        className1 = '';
        contentText1 = '给TA投票';
    }
    var s = '<li id="'+playerId+'" class="'+className1+'">';
    if(type == '1'||type == '3'){
        s += '<div class="voteTarget-logo"><img src="'+gameLogo+'"></div>';
    }else if(type == '2'){
        s += '<div class="voteTarget-logo" onclick="getGameSymbol(3,this,\'' + symbol + '\')"><img src="'+gameLogo+'"></div>';
    }
    s += '<div class="voteTarget-head">';
    s += '<a href="player.html?playerId=' + playerId + '"><img src="'+photo+'"></a>';
    s += '<div class="voteTarget-head-d">';
    s += '<p class="h-p-1">'+gameRoleName+'</p>';
    s += '<p class="h-p-2">'+desc+'</p>';
    s += '<p class="h-p-3"><i></i>'+voteCount1+'</p>';
    s += '</div>';
    s += '</div>';
    s += '<a onclick="voteCast(\'' + activityId + '\',\'' + playerId + '\','+voteCount1+')" class="vote-btn">'+contentText1+'</a>';
    s += '</li>';
    return s;
}


function voteCast(activityId,playerId,voteCount1) {
    ApiJS.signRequest('POST', '/vote/cast', {
            loginUserId: DeviceJS.loginUser.userId,
            token: DeviceJS.loginUser.token,
            //loginUserId: aa,
            //token: bb,
            deviceType: DeviceJS.loginUser.device.deviceType,
            appVersion: DeviceJS.loginUser.device.appVersion != null && DeviceJS.loginUser.device.appVersion != '' ? DeviceJS.loginUser.device.appVersion : DeviceJS.loginUser.device.version,
            activityId: activityId,
            votePlayerId: playerId
        },
        function (response) {
            if (response.success == '1') {
                voteCount1++;
                $('#'+playerId+'').addClass('voted');
                $('#'+playerId+' .h-p-3').html('<i></i>'+voteCount1+'');
                $('#'+playerId+' .vote-btn').html('明日再来');
                $('.dialog-5 .tcenter').html('投票成功');
                $('.dialog-5').show();
                getHtmlRefresh()
            }else{
                $('.dialog-5 .tcenter').html(response.message);
                $('.dialog-5').show();
            }
        });
}


function getHtmlRefresh (){
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
    );
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
    return s;
}


    var f_height = 0;
    if(ismobile() == 0){
        if(!isWeiXin()){
            $(".first").addClass("safari");
        }
    }
    var images_before=getPreloadImages("preload-L");
    var images_after = getPreloadImages("preload-M");
    // preloadimages(images_before,showPage1);
    showPage1();
    function showPage1(){
        $(".page1").show();
        /**/
        f_height = document.documentElement.clientHeight;
        /**/
        preloadimages(images_after,showPageIndex,count);
    }
    function showPageIndex(){
        setTimeout(function(){
            $(".page1").hide();
            $(".page2").show();

            $(".first").css("height",f_height);
            $(".page2").css("webkitTransform","translate3d(0,0,0)");

            var mySwiper =  new Swiper ('.swiper-container', {
                //autoplay: 3000,//可选选项，自动滑动
                slidesPerView:4.5,
                // loop:"loop",
                loopedSlides:$(".swiper-container .swiper-slide").length
            });

        },500);
    }
    function count(){
        var m = arguments[0],
            n = arguments[1];
        $(".loading-f p span").html(Math.ceil((m * 100)/n));
    }

    /*************内容页滑动相关**************/
    var p = {x:0,y:0},//初始坐标
        q = {x:0,y:0},//滑动坐标
        direction = "vertical",//滑动方向
        direction_flag = 0,//direction判定标识，一次触摸只判定一次
        t1,t2;//滑动开始和结束的时间
    var ele = document.querySelector(".page2");
    var start = 0;
    var page_index = 1;
    if(page_index == 1){
        $("body").addClass("bofh");
    }
    var touchflag = 0;
    var sc = 0;
    ele.addEventListener("touchstart",function(e){
        p.x = e.touches[0].pageX;
        p.y = e.touches[0].pageY;
        t1 = new Date().getTime();
        start = getOffsetY(ele.style.webkitTransform);
        sc = document.body.scrollTop;
    },false);
    ele.addEventListener("touchmove",function(e){
        q.x = e.touches[0].pageX;
        q.y = e.touches[0].pageY;
        if(direction_flag == 0){
            direction = judgeDirection();
            direction_flag = 1;
        }
        if(page_index == 1){
            if(direction == "vertical" && p.y-q.y > 0){
                e.preventDefault();
                var k = start + q.y - p.y;
                ele.style.webkitTransitionDuration = "0s";
                ele.style.webkitTransform = "translate3d(0,"+k+"px,0)";
            }
        }
        if(page_index != 1){
            if(direction == "vertical" && p.y-q.y < 0 && sc == 0){
                e.preventDefault();
                var k = start + q.y - p.y;
                ele.style.webkitTransitionDuration = "0s";
                ele.style.webkitTransform = "translate3d(0,"+k+"px,0)";
            }
        }
    },false);
    var mflag;
    ele.addEventListener("touchend",function(e){
        q.x = e.changedTouches[0].pageX;
        q.y = e.changedTouches[0].pageY;
        direction_flag = 0;
        t2 = new Date().getTime();
        if(page_index == 1){
            if(direction == "vertical" && p.y-q.y > 0){
                if(t2-t1 > 200){
                    if(getOffsetY(ele.style.webkitTransform) < -f_height/5){
                        ele.style.webkitTransitionDuration = "0.5s";
                        ele.style.webkitTransform = "translate3d(0,"+(-f_height)+"px,0)";
                        $("body").removeClass("bofh");
//                            page_index = 2;
                        mflag = 2;//第一页到第二页，transform < 0,marginTop = 0;
                    }else{
                        ele.style.webkitTransitionDuration = "0.5s";
                        ele.style.webkitTransform = "translate3d(0,0,0)";
                        $("body").addClass("bofh");
//                            page_index = 1;
                        mflag = 1;//第一页到第一页
                    }
                }else{
                    ele.style.webkitTransitionDuration = "0.5s";
                    ele.style.webkitTransform = "translate3d(0,"+(-f_height)+"px,0)";
                    $("body").removeClass("bofh");
//                        page_index = 2;
                    mflag = 2;//第一页到第二页，transform < 0,marginTop = 0;
                }
            }
        }
        if(page_index != 1){
            if(direction == "vertical" && p.y-q.y < 0 && sc == 0){
                if(t2-t1 > 200){
                    if(getOffsetY(ele.style.webkitTransform) > f_height/5){
                        ele.style.webkitTransitionDuration = "0.5s";
                        ele.style.webkitTransform = "translate3d(0,"+f_height+"px,0)";
                        $("body").addClass("bofh");
//                            page_index = 1;
                        mflag = 3;//第二页到第一页，transform>0,marginTop < 0;
                    }else{
                        ele.style.webkitTransitionDuration = "0.5s";
                        ele.style.webkitTransform = "translate3d(0,0,0)";
                        $("body").removeClass("bofh");
//                            page_index = 2;
                        mflag = 4;//第二页没动，marginTop < 0;
                    }
                }else{
                    ele.style.webkitTransitionDuration = "0.5s";
                    ele.style.webkitTransform = "translate3d(0,"+f_height+"px,0)";
                    $("body").addClass("bofh");
//                        page_index = 1;
                    mflag = 3;//第二页到第一页，transform>0,marginTop < 0;
                }
            }
        }
    },false);
    ele.addEventListener("webkitTransitionEnd",function(){
        if(mflag == 2){
            //
            $(".liu-cheng-ddl").css("visibility","visible");
            $(".liu-cheng-ddl").addClass("lyy-4");
            $(".sus").show();
            page_index = 2 ;
            //
            ele.style.marginTop = -f_height+"px";
            ele.style.webkitTransitionDuration = "0s";
            ele.style.webkitTransform = "translate3d(0,0,0)";

        }
        if(mflag == 3){
            //
            f_height = $(".cry").height();
            $(".first").css("height",f_height);
            $(".sus").hide();
            page_index = 1 ;
            //
            ele.style.marginTop = 0;
            ele.style.webkitTransitionDuration = "0s";
            ele.style.webkitTransform = "translate3d(0,0,0)";
        }
        if(mflag == 1){
            page_index = 1 ;
        }
        if(mflag == 4){
            page_index = 2 ;
        }
    },false);
    //判断方向 水平： horizontal，垂直：vertical;
    function judgeDirection(){
        var res = "";
        if(Math.abs(q.y-p.y) < Math.abs(q.x-p.x) ){
            res = "horizontal";
        }else{
            res = "vertical";
        }
        return res;
    }
    //获取纵向位移偏移量
    function getOffsetY(tranform){
        if(tranform == ""){
            return 0;
        }else{
            return parseFloat(tranform.split(",")[1]);
        }
    }
    /*************内容页滑动相关**************/


//图片预加载
function preloadimages(arr,func,count){
    var newimages=[], loadedimages=0;
    var arr=(typeof arr!="object")? [arr] : arr;
    for (var i=0; i<arr.length; i++){
        newimages[i]=new Image();
        newimages[i].src=arr[i];
        newimages[i].onload=function(){
            imageloadpost();
        }
        newimages[i].onerror=function(){
            imageloadpost();
        }
    }
    function imageloadpost(){
        loadedimages++;
        if(count){
            count(loadedimages,arr.length);
        }
        if (loadedimages==arr.length){
            //预加载完成
            if(func){
                func();
            }
        }
    }
}
//判断是安卓还是ios   0:ios   1:android
function ismobile(){
    var u = navigator.userAgent, app = navigator.appVersion;
    if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
        if(window.location.href.indexOf("?mobile")<0){
            try{
                if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)){
                    return '0';
                }else{
                    return '1';
                }
            }catch(e){}
        }
    }else if( u.indexOf('iPad') > -1){
        return '0';
    }else{
        return '1';
    }
};
//判断是否是微信浏览器
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

//获取需要预加载的图片
function getPreloadImages(className){
    var images = [];
    $("."+className).each(function(){
        var str = getImg(this);
        if(checkImage(str)){
            images.push(str)
        }
    });
    return images;
    function checkImage(obj){
        var res = true;
        for(var i = 0;i<images.length;i++){
            if(images[i] == obj){
                res = false;
                break;
            }
        }
        return res;
    }
    function getImg(obj){
        if(obj.tagName.toLowerCase() == "img"){
            return obj.src;
        }else{
            return $(obj).css("background-image").split('"')[1];
        }
    }

}