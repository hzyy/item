
function orient() {
	if (window.orientation == 0 || window.orientation == 180) {
		$("body").attr("class", "portrait");
		//orientation = 'portrait';
		var img = new Image();
		img.src = $("#img0").attr("src");
		
		if($(document.body).width()<img.width){
		$("#img0").attr("width", $(document.body).width());
		}else{
		$("#img0").attr("width", img.width);
		}
		//return false;
	}else if (window.orientation == 90 || window.orientation == -90) {
		$("body").attr("class", "landscape");
		//orientation = 'landscape';
		var img = new Image();
		img.src = $("#img0").attr("src");
		
		if($(document.body).width()<img.width){
		$("#img0").attr("width", $(document.body).width());
		}else{
		$("#img0").attr("width", img.width);
		}
		//return false;
		}
}
 
 
$(window).bind('orientationchange', function(e){
	orient();
});

$("#file").change(function(){
	var objUrl = getObjectURL(this.files[0]) ;
	var obj_file = document.getElementById("file");
	filesize = obj_file.files[0].size;
	
	console.log("objUrl = "+objUrl) ;
	if (objUrl) {
	$("#img0").attr("src", objUrl).after(" <i class='glyphicon glyphicon-remove-circle icon' style='position:absolute;left:45px;text-align:right;cursor:pointer;opacity:0.5;'></i>");
	
	$(".glyphicon-remove-circle").click(function(){
		$('#file').val("");
		$("#img0").attr("src", "");
		//$("#img0").removeAttr("width").removeAttr("height");
		$("#img0").attr({"height":"0"},{"width":"0"});
		$("#img0").next("i").remove();
	});
	var img = new Image();
	img.src = objUrl;
	img.onload = function(){ 
	
		if(img.width/img.height>4/3){
			if(img.width>80){
			$("#img0").attr("width", "60");
			}else{
			$("#img0").attr("width", img.width);
			}
		}else{
			if(img.height>60){
			$("#img0").attr("height", "60");
			}else{
			$("#img0").attr("height", img.height);
			}
		}
	
	}
	}
}) ;
//建立一個可存取到該file的url
function getObjectURL(file) {
	var url = null ; 
	if (window.createObjectURL!=undefined) { // basic
		url = window.createObjectURL(file) ;
	} else if (window.URL!=undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file) ;
	} else if (window.webkitURL!=undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file) ;
	}
	return url ;
}