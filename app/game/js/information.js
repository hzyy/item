function onImage(_this) {
    var width = $(_this).width();
    var height = $(_this).height();
    var screenWidth = $(window).width();
    if (width < height) {
        $(_this).parent().width(screenWidth * 0.6);
    } else {
        $(_this).parent().width(screenWidth - 20);
    }
}

function loadImage(screenshots) {
    if (screenshots && screenshots.length > 0) {
        var imgHtmls = "";
        for (var i=0; i<screenshots.length; i++) {
            imgHtmls += "<div class=\"swiper-slide\"><img src=\"" + screenshots[i] + "\"/></div>";
        }
        document.getElementById("swiper-wrapper").innerHTML = imgHtmls;
    }
    $(document).ready(function() {
        swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 'auto',
            paginationClickable: true,
            spaceBetween: 10
        });
    });
}

var introductionText = '';
function loadText(introduction, information) {
    var informationText = '<table width="100%" border="0"><tbody>';
    informationText += '<tr><td nowrap="nowrap" valign="top" class="pt5 pr50">开发商</td><td class="pt5">${maker}</td></tr>';
    informationText += '<tr><td nowrap="nowrap" valign="top" class="pt5 pr50">类别</td><td class="pt5">${category}</td></tr>';
    informationText += '<tr><td nowrap="nowrap" valign="top" class="pt5 pr50">日期</td><td class="pt5">${updateDate}</td></tr>';
    informationText += '<tr><td nowrap="nowrap" valign="top" class="pt5 pr50">版本</td><td class="pt5">${version}</td></tr>';
    informationText += '<tr><td nowrap="nowrap" valign="top" class="pt5 pr50">大小</td><td class="pt5">${size}</td></tr>';
    informationText += '<tr><td nowrap="nowrap" valign="top" class="pt5 pr50">评级</td><td class="pt5">${grade}</td></tr>';
    informationText += '<tr><td nowrap="nowrap" valign="top" class="pt5 pr50">家人共享</td><td class="pt5">${familyShare}</td></tr>';
    informationText += '<tr><td nowrap="nowrap" valign="top" class="pt5 pb5 pr50">语言</td><td class="pt5 pb5">${language}</td></tr>';
    informationText += '</tbody></table><br>';
    var moreButton = '<p align="center"><button class="btn btn-default btn-xs" style="border: 1px #e4e4e4 solid; color: #aaaaaa; line-height: 1.8;" onclick="moreIntroduction()">&nbsp;&nbsp;查看更多&nbsp;<img src="images/mroe_btn@2x.png" width="10">&nbsp;&nbsp;</button></p>';

    //设置游戏简介的内容
    introductionText = base64Decode(introduction);
    if (introductionText.length > 100) {
        $('#introduction').html(replaceEnter(introductionText.substring(0, 100)) + moreButton);
    } else {
        $('#introduction').html(replaceEnter(introductionText) + moreButton);
    }

    //设置游戏信息的内容
    information = base64Decode(information);
    var gameInfo = eval('(' + information + ')');
    informationText = informationText.replace('${maker}', gameInfo.maker);
    informationText = informationText.replace('${category}', gameInfo.category);
    var updateDate = '';
    if (gameInfo.updateDate.length >= 8) {
        updateDate = gameInfo.updateDate.substring(0, 4) + '年' + gameInfo.updateDate.substring(4, 6) + '月' + gameInfo.updateDate.substring(6, 8) + '日';
    }
    informationText = informationText.replace('${updateDate}', updateDate);
    informationText = informationText.replace('${version}', gameInfo.version);
    informationText = informationText.replace('${size}', gameInfo.size);
    var grade = gameInfo.grade;
    grade = grade.replace(/\ +/g, "");
    grade = grade.replace(/[ ]/g, "");
    grade = grade.replace(/[\r\n]/g, "<br/>");
    informationText = informationText.replace('${grade}', grade);
    informationText = informationText.replace('${familyShare}', gameInfo.familyShare);
    informationText = informationText.replace('${language}', gameInfo.language);
    $('#information').html(informationText);
}

var table = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '+', '/'
];

function base64Decode(str) {
    if (!str) {
        return '';
    }
    var len = str.length;
    var i   = 0;
    var res = [];
    while (i < len) {
        code1 = table.indexOf(str.charAt(i++));
        code2 = table.indexOf(str.charAt(i++));
        code3 = table.indexOf(str.charAt(i++));
        code4 = table.indexOf(str.charAt(i++));

        c1 = (code1 << 2) | (code2 >> 4);
        c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
        c3 = ((code3 & 0x3) << 6) | code4;

        res.push(String.fromCharCode(c1));

        if (code3 != 64) {
            res.push(String.fromCharCode(c2));
        }
        if (code4 != 64) {
            res.push(String.fromCharCode(c3));
        }
    }
    return UTF8ToUTF16(res.join(''));
}

function UTF8ToUTF16(str) {
    var res = [], len = str.length;
    var i = 0;
    for (var i = 0; i < len; i++) {
        var code = str.charCodeAt(i);
        // 对第一个字节进行判断
        if (((code >> 7) & 0xFF) == 0x0) {
            // 单字节
            // 0xxxxxxx
            res.push(str.charAt(i));
        } else if (((code >> 5) & 0xFF) == 0x6) {
            // 双字节
            // 110xxxxx 10xxxxxx
            var code2 = str.charCodeAt(++i);
            var byte1 = (code & 0x1F) << 6;
            var byte2 = code2 & 0x3F;
            var utf16 = byte1 | byte2;
            res.push(Sting.fromCharCode(utf16));
        } else if (((code >> 4) & 0xFF) == 0xE) {
            // 三字节
            // 1110xxxx 10xxxxxx 10xxxxxx
            var code2 = str.charCodeAt(++i);
            var code3 = str.charCodeAt(++i);
            var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
            var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
            utf16 = ((byte1 & 0x00FF) << 8) | byte2
            res.push(String.fromCharCode(utf16));
        }
    }
    return res.join('');
}

function replaceEnter(introduction) {
    if (introduction.substring(introduction.length - 1) == '\n') {
        introduction = introduction.substring(0, introduction.length - 1);
    }
    introduction = '<p>' + introduction.replace(/[\r\n]/g, '</p><p>') + '</p>';
    return introduction;
}

function moreIntroduction() {
    $('#introduction').html(replaceEnter(introductionText));
}