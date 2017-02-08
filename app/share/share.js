var ShareJS = ShareJS || (function (Math, undefined){
    var S = {
        getQueryString:function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]);
            return null;
        },
        incr: function(callback) {
            var userId = this.getQueryString('userId'),
                type = this.getQueryString('type'),
                objectId = this.getQueryString('objectId'),
                shareTo = this.getQueryString('shareTo'),
                time = this.getQueryString('time'),
                signature = this.getQueryString('signature');
            if (userId != null && type != null && objectId != null && shareTo != null && time != null && signature != null) {
                $.ajax({
                    type: 'POST',
                    url: 'https://report.youmengchuangxiang.com/share/incr',
                    data: {
                        userId: userId,
                        type: type,
                        objectId: objectId,
                        shareTo: shareTo,
                        time: time,
                        signature: signature
                    },
                    success: function (response) {
                        if (callback) {
                            callback(response);
                        }
                    }
                });
            }
        }
    };
    return S;
}(Math));
ShareJS.incr();


