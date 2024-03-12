docReady(function() {
	//element handles
	var $window = $(window);
	var $document = $(document);
	var $body = $("body");
	var passcodeElement = $(".passcode");
	var keyboard = $(".keyboard");
	var move = $('.move');
	var text = $('.text');
	var lockElement = $('.lock');
	var successMsg = $(".passcode-success-msg");
	var incorrectMsg = $(".passcode-incorrect-msg");
	var loader = $(".beach-ball");

	//common variables
	var count = 0 ,//count of tries
			isDragging = false,
			currentDraggedXPos ,
			first_x ,
			drag_x,
			drag_x_goal = lockElement.width() - move.width(),
			currentPass = "";	

	//store initial sizes of window to know if we resized it
    var width = $window.width();
    var height = $window.height();

	//light effect
	function getLightEffectStyles() {
		var lightSpeed = 44; //22pixels per second for the speed of the effect -- adjust animation per width
		var lightEffectElementWidth = parseInt(lockElement.width())-parseInt(move.width());
		var newAnimSpeed = Math.round(lightEffectElementWidth / lightSpeed);

		return `<style name="light-styles">
			.passcode-container .light {
				-webkit-animation: light ` + newAnimSpeed + `s linear infinite both;
				-moz-animation: light ` + newAnimSpeed + `s linear infinite both;
				animation: light ` + newAnimSpeed + `s linear infinite both;
			}

			.passcode-container .light:before {
				width: ` + lightEffectElementWidth + `px;
				-webkit-animation: show ` + newAnimSpeed + `s linear infinite both;
				-moz-animation: show ` + newAnimSpeed + `s linear infinite both;
				animation: show ` + newAnimSpeed + `s linear infinite both;
			}
		
			@-webkit-keyframes light {
				to{
					left: ` + lockElement.width() +`px;
		
				} 
			}
		
			@-webkit-keyframes show {
				to{
					left: -` + (parseInt(lockElement.width())-10) + `px;
				} 
			}
		
			@-moz-keyframes light {
				to{
					left: ` + lockElement.width() + `px;
				} 
			}
			
			@-moz-keyframes show {
				to{
					left: -` + (parseInt(lockElement.width())-10) + `px;
				} 
			}
		</style>`;
	}

	text.prepend(getLightEffectStyles() );

	//window resize check
    setInterval(function () {
        if ((width != $window.width()) || (height != $window.height())) {
            width = $window.width();
            height = $window.height();

            //light effect
			var oldStyle = text.find('style[name="light-styles"]');
			oldStyle.remove();
			text.prepend(getLightEffectStyles() );
        }
    }, 300);

	// Drag
	move.on('pointerdown', function(e) {
		e.preventDefault();
		isDragging = true;
		first_x = e.pageX;
	});

	$document.on('pointerup', function(e) {
		e.preventDefault();
		isDragging = false;
		move.css('left', 2+"px");
	});

	$document.on('pointermove', function(e) {
		if (isDragging) {
			drag_x_goal = lockElement.width() - move.width();

			drag_x = e.pageX ;
			if(drag_x > first_x) {
				currentDraggedXPos = drag_x - first_x;

				if(currentDraggedXPos >= drag_x_goal) {
					$('.passcode').addClass('show');
					$('.slider').addClass('hide');
					$document.off('pointermove');

					if(!MyGlobal.IsEmpty(MyGlobal.GetKey())) {
						$('.keyboard .enter').trigger('click');
					}
				}
				else{
					move.css('left', currentDraggedXPos+"px");	
				}
			}
		}
	});

	//keypad
	$('.keyboard *:not(.clear , .enter)').on('click', function() {
		var $this = $(this);
		if(keyboard.hasClass("passcode-success")) return;

		var keyVal = $this.data("value");

		if(count < 4) {
			count++;
			$('.pass div:nth-child('+count+')').addClass('show');
			
			currentPass += keyVal;
		}
	});

	$('.keyboard .clear').on('click', function() {
		if(keyboard.hasClass("passcode-success")) return;

		if(count > 0) {
			$('.pass div:nth-child('+count+')').removeClass('show');
			count--;
			currentPass = currentPass.slice(0, -1);
		}
		
	});

	$('.keyboard .enter').on('click', function() {
		if(keyboard.hasClass("passcode-success")) return;

		var passToCheck = currentPass;

		count = 0;
		currentPass = "";

		for (var i = 1; i <= 4; i++) {
			$('.pass div:nth-child('+i+')').removeClass('show');
		}

		if(!MyGlobal.IsEmpty(MyGlobal.GetKey())) {
			passToCheck = MyGlobal.GetPasscode();
		}

		//check pass
		var jsPath = window.location.origin + "/pass/" + passToCheck+".js";

		MyGlobal.ResourceExists(jsPath, function(exists) {
			if(exists) {
				console.log("password is valid");
				successMsg.addClass("show");
				keyboard.addClass("passcode-success");

				var script = document.createElement("script");
				script.src = jsPath;
				document.body.appendChild(script);
				loader.addClass("show");
			} else {
				console.log("password is incorrect");
				passcodeElement.addClass('errorshake');
				incorrectMsg.addClass("show");

				setTimeout(function(){incorrectMsg.removeClass("show");}, 1000);
			}
		});
	});

	//error animation handler
	passcodeElement.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e){
		passcodeElement.delay(200).removeClass('errorshake');
	});
});