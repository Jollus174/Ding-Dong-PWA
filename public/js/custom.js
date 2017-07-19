$(document).ready(function(){

	// This would all normally be under 'activateCharacter()', with an event listener to check for custom URLs from incoming visitors
	// Execept NOT. About and Credits will be under separate URLs too, and would not use the activateCharacter() function.
	function constructUrl(self){
		var locationHost = window.location.host;
		var baseUrl = window.location.protocol + "//" + locationHost;
		var dataUrl = self.attr('data-url');
		//var rageAmount = self.find('.rageBtn.active').attr('data-rage');
		//console.log('current rage is ' + rageAmount);
		/*if(rageAmount != '0' && rageAmount != 'undefined' && locationHost != 'dev.glideagency.com/'){
			rageAmount = '?rage=' + rageAmount;
		} else {
			rageAmount = "";
		}*/
		var constructedUrl = baseUrl + '/#/' + dataUrl;
		
		//console.log(constructedUrl);
		window.location.replace(constructedUrl);
	}

	function deconstructUrl(){
		var baseUrl = window.location.protocol + "//" + window.location.host + '/';
		var currentUrl = $(location).attr('href');
		console.log('base url is ' + baseUrl + ' and current url is ' + currentUrl);

		if(baseUrl != currentUrl && baseUrl + '#' != currentUrl && baseUrl + '#/' != currentUrl){

			// Current URL is not the base URL
			console.log('urls do not match!');

			// Time to deconstruct that sucker
			var parts = currentUrl.split('/');

			// Need to check if they're dialling one of the menu links, or a character
			var urlDirectory = parts[parts.length - 1];
			if(urlDirectory == 'about'){
				// activate About box
				console.log('about activated!');
				activateMenuBox('page-about');
			} else if (urlDirectory == 'credits'){
				// activate Credits box
				console.log('credits activated!');
				activateMenuBox('page-credits');
			} else {
				var character = parts[parts.length - 1];

				// This is working...
				// console.log(character);

				// Target the character with the class defined in the URl
				var urlCharacter = $('.' + String(character)).closest('.character-box');
				// and activate it
				if(urlCharacter.length){
					activateCharacter(urlCharacter);
				} else {
					// It needs to fallback though in case the character is undefined.
					console.log('This character does not exist, yo');
					$('#notification').html('Looks like this character does not exist.<br>Please check the URL.').show();
					$('#notification').delay(3000).fadeOut();
				}

				// Need to activate the correct rage button depending on the URL...
				//var rageAmount = current
				//rageAdjustment($(urlCharacter).find('.rageBtn[data-rage='));

			}



		}
	}
	deconstructUrl();


	function activateCharacter(self){
		var $this = self;

		if(!$this.hasClass('active')){

			$this.addClass('active');

			/*$('.rageBtn').click(function(){
				constructUrl($this);
			});*/


			$('body').addClass('no-scroll character-active');
			if(($this).find('.characterImageContainer').hasClass('text-dark')){
				$('body').addClass('text-dark');
			};
			$('#characterBackButton').addClass('active');

			// Apply colour of character BG to .characterUnderlay
			var bgColour = $('.character-box.active .characterImageContainer').css('backgroundColor');
			$('.characterUnderlay').css('backgroundColor', bgColour);

			// Set max/min percentage differences for each stage section
			rageAdjustment($this.find('.rageBtn.active'));

			// RAGE MODIFIER STICKY
			function fixedRagebar(self){
				var windowTop = self.scrollTop();
	            containerWidth = $('#character-list li.active .characterBorder').innerWidth();
	            marginOffset = $('#character-list li.active .characterBorder').css('margin-top');
	            if(120 < windowTop){
	                $('#character-list li.active .sticky').addClass('stuck');
	                $('.stuck').css({ top: marginOffset, width: containerWidth });

				} else {
					$('.stuck').css({ top: 0, width: '100%' }); // restore the original top value of the sticky element
					$('.sticky').removeClass('stuck');
				}
			}
			fixedRagebar($('.character-box.active .characterBorder'));

			// Limiting min execution interval on scroll to help prevent scroll jank
			// http://joji.me/en-us/blog/how-to-develop-high-performance-onscroll-event
			var scroll = function(){
				fixedRagebar($('.character-box.active .characterBorder'));
			}
			var raf = window.requestAnimationFrame ||
			    window.webkitRequestAnimationFrame ||
			    window.mozRequestAnimationFrame ||
			    window.msRequestAnimationFrame ||
			    window.oRequestAnimationFrame;
			var $window = $('.character-box.active .characterBorder');
			var lastScrollTop = $window.scrollTop();

			if (raf) {
	    		loop();
			}
			function loop() {
			    var scrollTop = $window.scrollTop();
			    if (lastScrollTop === scrollTop) {
			        raf(loop);
			        return;
			    } else {
			        lastScrollTop = scrollTop;
			        // fire scroll function if scrolls vertically
			        scroll();
			        raf(loop);
			    }
			}

			// Need to resize based on window.innerHeight due to mobile address bar sizings.
			// https://developers.google.com/web/updates/2016/12/url-bar-resizing
			$(window).resize(function(e){
				fixedRagebar($('.character-box.active .characterBorder'));
			})

			constructUrl(self);
		}
	}
	

	function rageAdjustment(self){
		var rageAmount = self.attr("data-rage");
		
		self.siblings('.rageBtn').removeClass('active');
		self.addClass('active');
		var rageAdjustment = "";

		// Calculate amount to adjust min-percent based on rage
		if(rageAmount == "50"){rageAdjustment = parseInt("-2");}
		if(rageAmount == "60"){rageAdjustment = parseInt("-5");}
		if(rageAmount == "80"){rageAdjustment = parseInt("-9");}
		if(rageAmount == "100"){rageAdjustment = parseInt("-12");}
		if(rageAmount == "125"){rageAdjustment = parseInt("-14");}
		if(rageAmount == "150"){rageAdjustment = parseInt("-18");}

		//var minPercentValues = $('.minPerc').text();

		// I should rewrite this to include the percent diffs to avoid running through everything twice.
		// EXCELLENT WORK!!
		$('.character-box.active .stagePercents').each(function(){
			var $this = $(this);

			var $minPerc = $this.find('.minPerc');
			var $maxPerc = $this.find('.maxPerc');
			var $percRange = $this.find('.percRange');
			var defaultMinPercent = $minPerc.attr('data-defaultmin');
			var defaultMaxPercent = $maxPerc.attr('data-defaultmax');

			var adjustedMinPercent = parseInt(defaultMinPercent) + rageAdjustment;
			var adjustedMaxPercent = parseInt(defaultMaxPercent) + rageAdjustment;

			// Some min %'s go below zero at max rage (wtf). Need to round to 0
			// Adjusting min percent last in case it goes below zero and fucks the percRange var
			adjustedMinPercent = Math.max(0, adjustedMinPercent);

			$minPerc.text(adjustedMinPercent).removeClass('nosymbol');
			$maxPerc.text(adjustedMaxPercent).removeClass('nosymbol');
			var percRange = adjustedMaxPercent - adjustedMinPercent;
			$percRange.text(percRange).removeClass('nosymbol');

			if( parseInt($maxPerc.text()) < parseInt($minPerc.text()) ){

				// On some stages, DingDong is impossible to kill with on some characters (like Satan on Battlefield)
				// Will need to render 'N/A' in those cases
				console.log('dingdong is impossible!');
				$minPerc.text('N/A').addClass('nosymbol');
				$maxPerc.text('N/A').addClass('nosymbol');
				$percRange.text('-').addClass('nosymbol');

			}

			//$minPerc.text(adjustedMinPercent);

			// hmm, if min percent goes below zero, this will affect the max percent range, right???? NO

		});

	};

	function activateMenuBox(target){
		// check to see if a character is currently active
		if($('body').hasClass('active-character')){
			deactivateCharacter();	
		}
		$('body').addClass('no-scroll').removeClass('text-dark');
		$('.characterUnderlay').css('backgroundColor', 'rgb(136,136,136)');
		$('#characterBackButton').addClass('active');
		$('#' + target).show();
	}

	function transitionRageForward($activeRageButton){
		if(!$activeRageButton.is(':last-child')){
			rageAdjustment($activeRageButton.next());
		} else {
			rageAdjustment($activeRageButton.siblings('.rageBtn:first-child'));
		}
	}
	function transitionRageBackward($activeRageButton){
		if(!$activeRageButton.is(':first-child')){
			rageAdjustment($activeRageButton.prev());
		} else {
			rageAdjustment($activeRageButton.siblings('.rageBtn:last-child'));
		}
	}
	function transitionCharacterForward($activeContainer){
		//var $activateContainer = $('#character-list .character-box.active');
		deactivateCharacter();
		if(!$activeContainer.is(':last-child')){
			activateCharacter($activeContainer.next());
		} else {
			// Loop back to first character if press right key on last character
			activateCharacter($activeContainer.siblings('.character-box:first-child'));
		}	
	}
	function transitionCharacterBackward($activeContainer){
		deactivateCharacter();
		if(!$activeContainer.is(':first-child')){
			activateCharacter($($activeContainer.prev()));
		} else {
			// Loop forward to last character if press left key on first character
			activateCharacter($activeContainer.siblings('.character-box:last-child'));
		}
	}

	function deactivateCharacter(){
		var $body = $('body');
		$('#characterBackButton').removeClass('active');
		$body.removeClass('no-scroll');

		// determine if body has clas 'character-active', to see if we're deactivating a character or a menu page
		if($body.hasClass('character-active')){
			$('#character-list li.active .rageModifier').removeClass('stuck');
			$('#character-list li.active .characterBorder').css('height', 'auto');
			$('#character-list li.active').removeClass('active');
			$body.removeClass('character-active');
		} else {
			$('.menu-page > div').hide();
		}
		
		// Page does not force reload if '#' is in the URL
		// https://stackoverflow.com/questions/2405117/difference-between-window-location-href-window-location-href-and-window-location
		var baseUrl = window.location.protocol + "//" + window.location.host + '/#/';
		console.log(baseUrl);
		window.location.replace(baseUrl);
	};



	// Character key events

	// Include handlers for if SHIFT is held for rage button shifting
	var shiftKey = 16; // SHIFT
	var isShiftActive = false;
	var keyleft = 37;
	var keyright = 39;
	var key1 = 49;
	var key2 = 50;
	var key3 = 51;
	var key4 = 52;
	var key5 = 53;
	var key6 = 54;
	var key7 = 55;


	$(document).keyup(function(e){

		if(e.which == shiftKey) isShiftActive = false;

	}).keydown(function(e){
		e = e || window.event;

		// Need modal to close on ESC
		// https://stackoverflow.com/questions/3369593/how-to-detect-escape-key-press-with-javascript-or-jquery
		var isEscape = false;
		if ("key" in e){
			isEscape = (e.key == "Escape" || e.key == "Esc");
		} else {
			isEscape = (e.keyCode == 27);
		}
		if (isEscape){
			// if character is active, deactivate it
			if($('body').hasClass('no-scroll')){
				deactivateCharacter();
			} else {
				// else toggle the sidemenu instead
				$('body').toggleClass('toggle-sidedrawer');
			}
			
		}
		if(e.which == shiftKey) isShiftActive = true;

		// Need to check if character is currently active.
		if($('.character-box.active').length){
			// Need to check if SHIFT is held.
			if(isShiftActive){
				if(e.which == keyright){
					//console.log('shift held and right');
					transitionRageForward($('.character-box.active .rageBtn.active'));
				}
				if(e.which == keyleft){
					//console.log('shift held and left');
					transitionRageBackward($('.character-box.active .rageBtn.active'));
				}

			} else {
				if(e.which == keyright){
					transitionCharacterForward($('.character-box.active'));
				}
				if(e.which == keyleft){
					transitionCharacterBackward($('.character-box.active'));
				}
				if(e.which == key1){rageAdjustment($('.character-box.active .rageBtn:nth-child(1)'))}
				if(e.which == key2){rageAdjustment($('.character-box.active .rageBtn:nth-child(2)'))}
				if(e.which == key3){rageAdjustment($('.character-box.active .rageBtn:nth-child(3)'))}
				if(e.which == key4){rageAdjustment($('.character-box.active .rageBtn:nth-child(4)'))}
				if(e.which == key5){rageAdjustment($('.character-box.active .rageBtn:nth-child(5)'))}
				if(e.which == key6){rageAdjustment($('.character-box.active .rageBtn:nth-child(6)'))}
				if(e.which == key7){rageAdjustment($('.character-box.active .rageBtn:nth-child(7)'))}

			}
		}

	});

	$('.filter-toggle').click(function(){
		var $this = $(this);
		$this.toggleClass('active');
		$this.next('.btn-group.mobile').toggleClass('active');
		$('#main').toggleClass('filtersActive');
	});

	$('.sidedrawer-toggle, #sidedrawer-overlay').click(function(){
		$('body').toggleClass('toggle-sidedrawer');
	});

	$('.rageBtn').click(function(){
		var $this = $(this);
		if(!$this.hasClass('active')){
			rageAdjustment($this);
		}
	})


	/*$('.characterUnderlay').click(function(){
		console.log('underlay clicked!');
		deactivateCharacter();
	})*/



	// Using traditional 'click()' bindings will not work on dynamically generated character boxes!
	// https://stackoverflow.com/questions/6658752/click-event-doesnt-work-on-dynamically-generated-elements
	$('#main').on('click', '.character-box', function(){
		activateCharacter($(this));
	})
	$('#main').on('click', '.rageBtn', function(){
		rageAdjustment($(this));
	});


	/* --- */


	$('#icon-next').click(function(){
		transitionCharacterForward($('.character-box.active'));
	});
	$('#icon-prev').click(function(){
		transitionCharacterBackward($('.character-box.active'));
	});
	$('#characterBackButton').click(function(){
		deactivateCharacter();
	});

	$('#about').click(function(){
		activateMenuBox('page-about');
	})
	$('#credits').click(function(){
		activateMenuBox('page-credits');
	})
});