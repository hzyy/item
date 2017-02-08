/**
 * ReportJS core components.
 */
var ReportJS = ReportJS || (function (Math, undefined) {
    var R = {
        report: function(data, callback) {
            $.ajax({
                type: 'POST',
                url: 'https://report.youmengchuangxiang.com/point/report',
                data: data,
                success: function(response) {
                    if (callback) {
                        callback(response);
                    }
                }
            });
        }
    };
    return R;
}(Math));
