/*
 * Licensed to Apereo under one or more contributor license
 * agreements. See the NOTICE file distributed with this work
 * for additional information regarding copyright ownership.
 * Apereo licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License.  You may obtain a
 * copy of the License at the following location:
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*获得绝对路径*/
var _script = document.getElementsByTagName("script");
var _src = _script[_script.length-1].src;
rootUrl = _src.substring(0, _src.indexOf("js"));

var scripts = [ rootUrl + "plugins/jquery-1.11.2/jquery.min.js",
                rootUrl + "plugins/jquery-ui-1.11.4/jquery-ui.min.js",
                rootUrl + "js/bootstrap.min.js",
                rootUrl + "plugins/jquery-cookie-1.4.1/jquery.cookie.min.js"/*,
                rootUrl + "plugins/javascript-debug/ba-debug.min.js"*/];

head.ready(document, function() {
    head.load(scripts, resourceLoadedSuccessfully);
});


function areCookiesEnabled() {
    $.cookie('cookiesEnabled', 'true');
    var value = $.cookie('cookiesEnabled');
    if (value != undefined) {
        $.removeCookie('cookiesEnabled');
        return true;
    }
    return false;
}

function animateAct(selector, rgbStart, rgbEnd) {
	$(selector).animate({ backgroundColor: rgbStart }, 30).animate({ backgroundColor: rgbEnd }, 500);
}

function resourceLoadedSuccessfully() {
    $(document).ready(function() {





    	//input focus---------------------------------
     /*   if ($(":input").length === 0){
            $("input:visible:enabled:first").focus();
        }*/

        //cookies enable------------------------------
        if (!areCookiesEnabled()) {
           $('#cookiesDisabled').removeClass('hidden').show();
           $('#cookiesDisabled').siblings('strong').each(function(i, o) {
        	   if(!$(o).hasClass('hidden'))
        		   $(o).addClass('hidden');
           });
           animateAct('#cookiesDisabled', 'rgb(187,0,0)', 'rgb(242,222,222)');
        }
            
        //flash error box-----------------------------
        animateAct('#msg.errors', 'rgb(187,0,0)', 'rgb(242,222,222)');

        //flash success box
        animateAct('#msg.success', 'rgb(51,204,0)', 'rgb(221,255,170)');

        //flash confirm box
        animateAct('#msg.question', 'rgb(51,204,0)', 'rgb(221,255,170)');

        if ($('.alert .errors:not(.hidden)').length > 0) {
        	$('.alert').removeClass('hidden');
        }
        
        //---------------------------------------------
        $('#capslock-on').hide();
        $('#password').keypress(function(e) {
            var s = String.fromCharCode( e.which );
            if ( s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey ) {
                $('#capslock-on').show();
            } else {
                $('#capslock-on').hide();
            }
        });
        
        //错误提示方案一：
        //errors tip popover(配合<form:errors path="*" cssClass="hidden" htmlEscape="false" />使用)---------------------------
        /*var $popover = $("input[name=username]");
    	$popover.popover({
    	    html: true,
    	    trigger: 'manual',
    	    content: $(document.getElementById('credential.errors')).html(),
    	    container: 'body',
    	    placement: 'top',
    	    animation: false
    	});
        var errors = $(document.getElementById("credential.errors"));
		if(errors.text()) {
			$popover.popover("show");			
		}
		$(".form-bottom input").on("keydown", function() {
			$popover.popover("hide");
		});*/
        //错误提示方案二：
        var errors = $(document.getElementById("credential.errors"));
		if(errors.text()) {
			$('.form-horizontal .msg-warn').addClass('hidden').hide();
			$('.form-horizontal .msg-error').removeClass('hidden').show();
		}else {
			$('.form-horizontal .msg-warn').removeClass('hidden').show();
			$('.form-horizontal .msg-error').addClass('hidden').hide();
		}
		
		//---------------------------------------------
        if (typeof(jqueryReady) == "function") {
            jqueryReady();
        }
        
        //---------------------------------------------
        $('#changecode').click(function() {
        	$(this).parent().prev().attr('src', 'captcha.jpg?'+Math.random());
        }); 
    });

};
