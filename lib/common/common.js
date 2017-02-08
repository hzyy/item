var CommonJS = CommonJS || (function (Math, undefined) {
	var Common = {
		getContextPath: function() {
			var strFullPath = window.document.location.href;
			var strPath = window.document.location.pathname;
			var pos = strFullPath.indexOf(strPath);
			var prePath = strFullPath.substring(0, pos);
			//var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
			return (prePath);
		},
		getOssUrl: function(bucket, url) {
			if (/http:\/\/.*$/.test(url) || /https:\/\/.*$/.test(url)) {
				return url;
			} else {
				if (bucket && bucket.length > 0 && url && url.length > 0) {
					return 'http://' + bucket.replace(new RegExp(/(gamecircle-)/g),'') + '.youka.youmengchuangxiang.com/' + url;
				}
				return '';
			}
		},
		base64ToArrayBuffer: function(base64, contentType) {
			contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || '';
			base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
			var binary = atob(base64);
			var len = binary.length;
			var buffer = new ArrayBuffer(len);
			var view = new Uint8Array(buffer);
			for (var i = 0; i < len; i++) {
				view[i] = binary.charCodeAt(i);
			}
			return buffer;
		},
		dataURLtoBlob: function(dataurl) {
			var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
			while(n--){
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], {type:mime});
		}
	};
	return Common;
}(Math));