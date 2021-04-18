
jQuery(document).ready(function() {
/* /!*   alert($("#topWarnOne").html());*!/
    $("#topWarnOne").toggle();*/

    /*
        Fullscreen background
    */
   /* $.backstretch(rootUrl + "images/bj.jpg");*/
	/*$.backstretch([ rootUrl + "images/bg1.jpg"
	              , rootUrl + "images/bg2.jpg"
	              , rootUrl + "images/bg3.jpg"
	             ], {duration: 3000, fade: 750});*/
	
	/*var _bodyOH = $("body").height(); // body原始高度
    $(window).resize(function() {
    	var _bodyH = $("body").height(); // body高度
    	var _divH = $(".top-content").height(); // body内div高度
    	var _clientH = document.documentElement.clientHeight; // 浏览器高度
    	if(_bodyH < _clientH || _bodyOH < _clientH) {
    		$("body").height(_clientH);
    	}
    	if($("body").height() < _divH) {
    		$("body").height(_divH);
    	}
    });
    $(window).resize();*/
	
    /*
        Form validation
    */
    /*$('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function() {*/
    $('.form-horizontal .required:visible').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    $('.form-horizontal').on('submit', function(e) {
    	/*$(this).find('input[type="text"], input[type="password"], textarea').each(function(){*/
        if ($('#username').val().length == 0){
            $('#username').focus();
        }
        if ($('#password').val().length == 0){
            $('#password').focus();
            if ($('#username').val().length == 0){
                $('#username').focus();
            }
        }

    	$(this).find('.required:visible').each(function(){
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	
    });
    
});

