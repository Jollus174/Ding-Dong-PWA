var Custom = (function() {
	var myjson;
	function defer(method) {
	    if (window.jQuery) {
	    	// Service Worker seems to want to try and call this script before jQuery is ready
	    	// https://stackoverflow.com/questions/7486309/how-to-make-script-execution-wait-until-jquery-is-loaded

	    	// Need this also to only trigger when the JSON has loaded
			// Could save this JSON to a var for easy referral
			// No more loading times between characters
			// https://stackoverflow.com/questions/15764844/jquery-getjson-save-result-into-variable
			
			$.getJSON("./api/data.json", function(jsonCallback){
			    myjson = jsonCallback;
			    method();
			})
			.fail(function(){
				console.log('error retrieving data');
			});
	    } else {
	        setTimeout(function() { defer(method()) }, 50);
	    }
	}

	defer(function(){
		// The URL constructers/deconstructers are back to haunt me
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

			// Putting in a condition to see if app is run from homescreen
			// URL will look like baseUrl + '/?utm_source=homescreen'
			//
			// If 'homescreen' does NOT exist in URL...
			if(baseUrl != currentUrl && baseUrl + '#' != currentUrl && baseUrl + '#/' != currentUrl && !(currentUrl.indexOf('homescreen') > -1)){

				// Current URL is not the base URL
				console.log('urls do not match!');

				// Time to deconstruct that sucker
				var parts = currentUrl.split('/');

				// Need to check if they're dialling one of the menu links, or a character
				var urlDirectory = parts[parts.length - 1];
				if(urlDirectory == 'about'){
					// activate About box
					activateMenuBox('page-about');
				} else if (urlDirectory == 'credits'){
					// activate Credits box
					activateMenuBox('page-credits');
				} else {
					var character = String(parts[parts.length - 1]);

					// This is working...
					//console.log(character);

					// Target the character with the class defined in the URl
					var urlCharacter = $('.character-box[data-url=' + character + ']');

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


		// Filter box functions
		// Earlier this was in page.js after much work, but Knockout wipes out the generated
		// index numbers when removing/adding character boxes. No solution could be found to permanently
		// store observable knockout values for the index numbers. Rip.
		// https://forum.jquery.com/topic/dynamically-filter-a-list-based-on-an-entry-in-a-text-box
		function searchList(value){
			$('.character-box').each(function(){
				var theName = $(this).find('.characterTitleBar span').text().toLowerCase();
				(theName.indexOf(value) >= 0) ? $(this).show() : $(this).hide();
			})
		}
		$('#search').keyup(function(){
			var valThis = $(this).val().toLowerCase();
			$searchbox = $(this).closest('.search-box');
			if($(this).val() == ""){
				console.log('does not have value');
				$searchbox.removeClass('active');
			} else {
				console.log('has value');
				$(this).closest('.search-box').addClass('active');
			}
			searchList(valThis);
		});

		$('.search-box .clear-input').click(function(){
			$('.search-box #search').val('').closest('.search-box').removeClass('active');
			searchList('');
		});



		// RAGE MODIFIER STICKY
		// The was originally within activateCharacter(), but after serveral transitions it begins to lag the app
		// The requestAnimatonFrame references may have been stacking and causing scroll jank, so it's been moved
		// here and is declared only once.
		
		var $charContainer = $('#characterModal .characterContainer');
		function fixedRagebar(self){
			
			var windowTop = self.scrollTop();
			
            containerWidth = $charContainer.innerWidth();
            marginOffset = $charContainer.css('margin-top');
            if(120 < windowTop){
                $('#characterModal .sticky').addClass('stuck');
                $('.stuck').css({ top: marginOffset, width: containerWidth });
                $('.stickyName').slideDown('fast');

			} else {
				$('.stuck').css({ top: 0, width: '100%' }); // restore the original top value of the sticky element
				$('.sticky').removeClass('stuck');
				$('.stickyName').hide();
			}
		}

		// Limiting min execution interval on scroll to help prevent scroll jank
		// http://joji.me/en-us/blog/how-to-develop-high-performance-onscroll-event
		var scroll = function(){
			fixedRagebar($charContainer);
		}
		var raf = window.requestAnimationFrame ||
		    window.webkitRequestAnimationFrame ||
		    window.mozRequestAnimationFrame ||
		    window.msRequestAnimationFrame ||
		    window.oRequestAnimationFrame;
		var $window = $charContainer;
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
		fixedRagebar($charContainer);




		function activateCharacter(self){

			// Add class of 'selected' to the clicked character box. This is used for transitioning between characters while the modal box is open
			self.addClass('selected');

			//$charModal.find('.backButton').addClass('active');
			$('body').addClass('no-scroll character-active');

			// Grab the data-index attr added by Knockout for each box. This is used to link the box to the JSON data that's generated in the modal
			var $index = self.closest('.character-box.selected').data('index');

			// Character Modal initialisers
			// I want these outside the 'getJSON' request so they're loaded before the JSON is, otherwise there is NO IMAGE for a brief moment.
			var $charModal = $('#characterModal');

			// Need to strip all classes from 'characterImageContainer' to remove the applied character class
			// https://stackoverflow.com/questions/5363289/remove-all-classes-except-one
			$charModal.find('.characterImageContainer').attr('class', 'characterImageContainer');

			$charModal.removeClass('animate');


			// Firstly, generate a request for the JSON file
			// This is referring to the JSON var created earlier

			// Begin the mapping
			var name = myjson[$index].name;
			var urlName = myjson[$index].url;
			var bgColour = myjson[$index].bgColour;
			var weight = myjson[$index].weight;
			var minPercent = parseInt(myjson[$index].minPercent);
			var maxPercent = parseInt(myjson[$index].maxPercent);
			var fallspeed = myjson[$index].fallspeed;
			var gravity = myjson[$index].gravity;
			var airdodgeStart = myjson[$index].airdodgeStart;
			var airdodgeEnd = myjson[$index].airdodgeEnd;
			var textContrast = myjson[$index].textContrast;

			var airdodge = airdodgeStart + ' - ' + airdodgeEnd;
			var percRange = (maxPercent - minPercent) + 1;

			// Time to activate the Character Modal
			$charModal.addClass('active');

			if(textContrast){
				$charModal.addClass(textContrast);
			}
			$charModal.addClass(urlName);

			$('#character-underlay').css('backgroundColor', bgColour);
			$charModal.find('.characterImageContainer, .stickyName').css('backgroundColor', bgColour);


			// Trick to restart the CSS animation for the characterImage slideIn. What a headache.
			// https://css-tricks.com/restart-css-animation/
			// https://stackoverflow.com/questions/31028479/restarting-css-animation-via-javascript
			var returnID = function(id){
				return document.getElementById(id);
			}
			var $charImage = $('#characterModalImage');
			returnID('characterModal').offsetWidth = returnID('characterModal').offsetWidth;
			returnID('characterModal').classList.add('animate');

			$charModal.find('.grid-percRange .minPerc').text(minPercent);
			$charModal.find('.grid-percRange .maxPerc').text(maxPercent);
			$charModal.find('span[data-ref="name"], .stickyName').text(name);

			// Generating the difficulty text via the global function in characters.js
			var difficultyAmount = computeDifficulty(minPercent, maxPercent);
			$charModal.find('.grid-difficulty').html('<span class="' + difficultyAmount + '">' + difficultyAmount + ' - ' + percRange + '%</span>');
			$charModal.find('.characterName').text(name);

			var $charOverviewItem = $charModal.find('.characterOverview');
			$charOverviewItem.find('li[data-ref="weight"]').html('Weight' + '<span class="value">' + weight + '</span>');
			$charOverviewItem.find('li[data-ref="fallspeed"]').html('Gravity' + '<span class="value">' + fallspeed + '</span>');
			$charOverviewItem.find('li[data-ref="airdodge"]').html('Airdodge' + '<span class="value">' + airdodge + '</span>');
			$charOverviewItem.find('li[data-ref="gravity"]').html('Gravity' + '<span class="value">' + gravity + '</span>');

			// Map those mf-ing values
			// Ideally these should all be pushed to an array and mapped all at once, but eh
			var $fd = $charModal.find('.stage-fd');
			$fd.find('span[data-ref="minPerc"]').text(minPercent).attr('data-defaultmin', minPercent);
			$fd.find('span[data-ref="maxPerc"]').text(maxPercent).attr('data-defaultmax', maxPercent);

			var $bf = $charModal.find('.stage-bf');
			$bf.find('span[data-ref="bfNormalMin"]').text(minPercent+7).attr('data-defaultmin', minPercent+7);
			$bf.find('span[data-ref="bfNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
			$bf.find('span[data-ref="bfLowPlatMin"]').text(minPercent-7).attr('data-defaultmin', minPercent-7);
			$bf.find('span[data-ref="bfLowPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
			$bf.find('span[data-ref="bfTopPlatMin"]').text(minPercent-20).attr('data-defaultmin', minPercent-20);
			$bf.find('span[data-ref="bfTopPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

			var $dl = $charModal.find('.stage-dl');
			$dl.find('span[data-ref="dlNormalMin"]').text(minPercent).attr('data-defaultmin', minPercent);
			$dl.find('span[data-ref="dlNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
			$dl.find('span[data-ref="dlLowPlatMin"]').text(minPercent-15).attr('data-defaultmin', minPercent-15);
			$dl.find('span[data-ref="dlLowPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
			$dl.find('span[data-ref="dlTopPlatMin"]').text(minPercent-26).attr('data-defaultmin', minPercent-26);
			$dl.find('span[data-ref="dlTopPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

			var $sv = $charModal.find('.stage-sv');
			$sv.find('span[data-ref="svNormalMin"]').text(minPercent+1).attr('data-defaultmin', minPercent+1);
			$sv.find('span[data-ref="svNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
			$sv.find('span[data-ref="svPlatMin"]').text(minPercent-14).attr('data-defaultmin', minPercent-14);
			$sv.find('span[data-ref="svPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

			var $tc = $charModal.find('.stage-tc');
			$tc.find('span[data-ref="tcNormalMin"]').text(minPercent-4).attr('data-defaultmin', minPercent-4);
			$tc.find('span[data-ref="tcNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
			$tc.find('span[data-ref="tcLowPlatMin"]').text(minPercent-20).attr('data-defaultmin', minPercent-20);
			$tc.find('span[data-ref="tcLowPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
			$tc.find('span[data-ref="tcSidePlatMin"]').text(minPercent-25).attr('data-defaultmin', minPercent-25);
			$tc.find('span[data-ref="tcSidePlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
			$tc.find('span[data-ref="tcTopPlatMin"]').text(minPercent-41).attr('data-defaultmin', minPercent-41);
			$tc.find('span[data-ref="tcTopPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

			// Now to render % differences... Better to take care of them all in one loop
			// I want to see if rage button is not at default first though, two avoid double-handling the percent range calculations
			// This causes the code to loop through twice - once for rendering the numbers and another for animating them. Is inefficent, really
			// This could probably be optimised later
			rageAdjustment($charModal.find('.rageBtn.active'));
			/*if($charModal.find('.btn[data-rage="0"]').hasClass('active')){
				//console.log('default rage');
			} else {
				//console.log('NOT default rage');
			}*/

			// Need to resize based on window.innerHeight due to mobile address bar sizings.
			// https://developers.google.com/web/updates/2016/12/url-bar-resizing
			$(window).resize(function(e){
				fixedRagebar($charContainer);
			})

			constructUrl(self);

		}

		function deactivateCharacter(){
			var $body = $('body');
			$body.removeClass('no-scroll');
			$('#character-underlay').css('backgroundColor', 'transparent');
			// determine if body has clas 'character-active', to see if we're deactivating a character or a menu page
			if($body.hasClass('character-active')){
				var $charModal = $('#characterModal');
				$charModal.removeClass();
				$charModal.find('.rageModifier').removeClass('stuck');
				$charModal.find('.characterBorder').css('height', 'auto');
				$('#character-list li.selected').removeClass('selected');
				$body.removeClass('character-active');
			} else {
				$('.menu-page > div').hide();
				$('#sidedrawer-underlay').css('backgroundColor', 'transparent');
				$('#menuBackButton').removeClass('active');
			}
			
			// Page does not force reload if '#' is in the URL
			// https://stackoverflow.com/questions/2405117/difference-between-window-location-href-window-location-href-and-window-location
			var baseUrl = window.location.protocol + "//" + window.location.host + '/#/';
			//var baseUrl = window.location.protocol + "//" + window.location.host + '/';
			//console.log(baseUrl);
			window.location.replace(baseUrl);
			// This seems to cause problems with the PWA side of things, and forces some kind of reload anyway.
		};
		function transitionCharacter(){
			var $charModal = $('#characterModal');
			$charModal.attr('class', 'active');
			$('#character-list li.selected').removeClass('selected');
		}


		function rageAdjustment(self){
			var rageAmount = self.attr("data-rage");
			
			self.siblings('.rageBtn').removeClass('active');
			self.addClass('active');
			var rageAdjMin = "";
			var rageAdjMax = "";

			// According to the data, characters with ... dunno, I got nothing
			// There seems to be no distinct pattern of how rage causes the min and max% windows to decay
			// Earlier, a rough spreadsheet was put together to try and measure the variance of decay relative to DK's rage between characters --> https://docs.google.com/spreadsheets/d/10YmEZihWk6oPPXnynnfIpyEApfl0ANPRlCq4WnHv3Ls/edit#gid=0
			// The stuff in red measures accumulated decay. Doesn't seem to be a pattern, so an average value is taken

			// Calculate amount to adjust min-percent based on rage
			if(rageAmount == "50"){rageAdjMin = -2; rageAdjMax = -5 }
			if(rageAmount == "60"){rageAdjMin = -5; rageAdjMax = -9 }
			if(rageAmount == "80"){rageAdjMin = -9; rageAdjMax = -16 }
			if(rageAmount == "100"){rageAdjMin = -12; rageAdjMax = -22 }
			if(rageAmount == "125"){rageAdjMin = -14; rageAdjMax = -27 }
			if(rageAmount == "150"){rageAdjMin = -18; rageAdjMax = -33 }

			$('#characterModal .stagePercents').each(function(){
				var $this = $(this);

				var $minPerc = $this.find('.minPerc');
				var $maxPerc = $this.find('.maxPerc');
				var $percRange = $this.find('.percRange');
				var defaultMinPercent = $minPerc.attr('data-defaultmin');
				var defaultMaxPercent = $maxPerc.attr('data-defaultmax');

				var adjustedMinPercent = parseInt(defaultMinPercent) + rageAdjMin;
				var adjustedMaxPercent = parseInt(defaultMaxPercent) + rageAdjMax;

				// Some min %'s go below zero at max rage (wtf). Need to round to 0
				// Adjusting min percent last in case it goes below zero and fucks the percRange var
				adjustedMinPercent = Math.max(0, adjustedMinPercent);
				var percRange = (adjustedMaxPercent - adjustedMinPercent) + 1;

				if(adjustedMaxPercent < adjustedMinPercent ){
					// On some stages, DingDong is impossible to kill with on some characters (like Satan on Battlefield)
					// Will need to render 'N/A' in those cases
					console.log('dingdong is impossible!');
					$minPerc.text('N/A').addClass('nosymbol');
					$maxPerc.text('N/A').addClass('nosymbol');
					$percRange.text('-').addClass('nosymbol');
				} else {
					$minPerc.removeClass('nosymbol');
					$maxPerc.removeClass('nosymbol');
					$percRange.removeClass('nosymbol');

					$minPerc
						.prop('number', $minPerc.text())
						.animateNumber({ number : adjustedMinPercent }, 200);
					$maxPerc
						.prop('number', $maxPerc.text())
						.animateNumber({ number : adjustedMaxPercent }, 200);
					$percRange
						.prop('number', $percRange.text())
						.animateNumber({ number : percRange }, 200);

				}

				//$minPerc.text(adjustedMinPercent);

				// Hmm, if min percent goes below zero, this will affect the max percent range, right???? NO, IT PROBABLY SHOULDN'T (I think...)

			});

		};

		function activateMenuBox(target){
			// check to see if a character is currently active
			if($('body').hasClass('active-character')){
				deactivateCharacter();	
			}
			$('body').addClass('no-scroll').removeClass('text-dark');
			//$('.modalUnderlay').css('backgroundColor', 'rgb(136,136,136)');
			$('#sidedrawer-underlay').css('backgroundColor', 'rgb(136,136,136)');
			$('#menuBackButton').addClass('active');
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
		function transitionCharacterForward(activeContainer){
			var $activeContainer = $(activeContainer);
			// Loop back to first character if press right key on last character
			// WAIT, first check to see if it HAS visible siblings. The search box may remove them and mess up this code
			// Welp, next() will only return the VERY NEXT element. Need to return the next :visible element, regardless
			// of whether the element is a direct sibling or not.
			// Using nextAll and prevAll in the cases where a next() and prev() relative to :visible is required.
			// https://stackoverflow.com/questions/6823842/select-the-next-element-with-a-specific-attribute-jquery
			if($activeContainer.siblings('.character-box').is(':visible')){
				if($activeContainer.nextAll('.character-box').is(':visible')){
					transitionCharacter();
					//activateCharacter($activeContainer.siblings('.character-box:visible'));
					//activateCharacter($activeContainer.nextAll('.character-box:visible'));
					var $nextVisibleChar = $activeContainer.nextAll('.character-box:visible').first();
					activateCharacter($nextVisibleChar);
				} else {
					// Loop backward to first VISIBLE character if press right key on last character
					transitionCharacter();
					activateCharacter($activeContainer.siblings('.character-box:visible').first());
				}
			}
		}
		function transitionCharacterBackward(activeContainer){
			var $activeContainer = $(activeContainer);
			if($activeContainer.siblings('.character-box').is(':visible')){
				//console.log('siblings are visible');
				if($activeContainer.prevAll('.character-box').is(':visible')){
					//console.log('previous visible box exists')
					transitionCharacter();
					// PrevAll is working, but is not determining is the element is fucking VISIBLE or not!
					// :visible:last will return Bayo
					// :visible:first will work until elements are separated
					var $prevVisibleChar = $activeContainer.prevAll('.character-box:visible').first();
					activateCharacter($prevVisibleChar);
				} else {
					// Loop backward to first VISIBLE character if press right key on last character
					transitionCharacter();
					activateCharacter($activeContainer.siblings('.character-box:visible').last());
				}
			}
		}


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
			if($('#characterModal.active').length){
				var $this = $(this);
				//console.log('modal is active!');
				// Need to check if SHIFT is held.
				if(isShiftActive){
					if(e.which == keyright){
						//console.log('shift held and right');
						transitionRageForward($this.find('.rageBtn.active'));
					}
					if(e.which == keyleft){
						//console.log('shift held and left');
						transitionRageBackward($this.find('.rageBtn.active'));
					}

				} else {
					if(e.which == keyright){transitionCharacterForward($('.character-box.selected'))};
					if(e.which == keyleft){transitionCharacterBackward($('.character-box.selected'))};

					if(e.which == key1){rageAdjustment($this.find('.rageBtn:nth-child(1)'))};
					if(e.which == key2){rageAdjustment($this.find('.rageBtn:nth-child(2)'))};
					if(e.which == key3){rageAdjustment($this.find('.rageBtn:nth-child(3)'))};
					if(e.which == key4){rageAdjustment($this.find('.rageBtn:nth-child(4)'))};
					if(e.which == key5){rageAdjustment($this.find('.rageBtn:nth-child(5)'))};
					if(e.which == key6){rageAdjustment($this.find('.rageBtn:nth-child(6)'))};
					if(e.which == key7){rageAdjustment($this.find('.rageBtn:nth-child(7)'))};
				}
			}

		});

		$('.filter-toggle').click(function(){
			var $this = $(this);
			$this.toggleClass('active');
			$this.next('.btn-group.mobile').toggleClass('active');
			$('#main').toggleClass('filtersActive');

			// If on mobile and at top of screen, the filter row covers the content! Not good.
			// This detects if the user is partly down the page, and if not will offset the grid by the height of header + height of filter row

			if($('#main').hasClass('filtersActive')){
				// First check to see if the filters are active. If they aren't, then proceed
				var scrollTop = $(window).scrollTop();
				var headerHeight = $('header').height() + $('.btn-group.mobile.active').innerHeight();
				if(scrollTop < 140){
					$('#main').css('margin-top', headerHeight);
				} else {
					$('#main').css('margin-top', '');
				}
				// If they aren't active and the button is clicked, remove the jQuery offset if present
			} else {
				$('#main').css('margin-top', '');
			}
		});

		$('.sidedrawer-toggle, #sidedrawer-overlay').click(function(){
			$('body').toggleClass('toggle-sidedrawer');
		});

		// Using traditional 'click()' bindings will not work on dynamically generated character boxes!
		// https://stackoverflow.com/questions/6658752/click-event-doesnt-work-on-dynamically-generated-elements
		$('#main').on('click', '#character-list .character-box', function(){
			activateCharacter($(this));
		})
		$('#characterModal').on('click', '.rageBtn', function(){
			rageAdjustment($(this));
		});


		/* --- */


		$('#icon-next').click(function(){
			transitionCharacterForward($('.character-box.selected'));
		});
		$('#icon-prev').click(function(){
			transitionCharacterBackward($('.character-box.selected'));
		});
		$('.backButton').click(function(){
			deactivateCharacter();
		});

		$('#about').click(function(){
			activateMenuBox('page-about');
		})
		$('#credits').click(function(){
			activateMenuBox('page-credits');
		})

		$('#filter-dropdown-btn').click(function(){
			$this = $(this);
			$this.toggleClass('active');
			$this.closest('.btn-group').toggleClass('open');
		});


		$('.add-extra-info').click(function(){
			$this = $(this);

			// Need to see if these are the MOBILE toggles, or the DESKTOP toggles. They'll function slightly differently
			if($this.closest('.btn-group').hasClass('mobile')){
				// Need to make it that only one 'toggle extra info' button on mobile can be active at a time
				// Otherwise the design starts to break down and look poopoo

				if(!$this.hasClass('checked')){
					$('.mobile .add-extra-info').removeClass('checked');
					$this.addClass('checked');
					if($this.hasClass('add-info-grid')){
						$('body').addClass('show-extra-info').removeClass('show-ledgeFsmash');
					}
					if($this.hasClass('add-ledgeFsmash-grid')){
						$('body').addClass('show-ledgeFsmash').removeClass('show-extra-info');
					}
				} else {
					$this.removeClass('checked');
					$('body').removeClass('show-ledgeFsmash show-extra-info');
				}

			} else {
				if($this.hasClass('add-info-grid')){
					$this.toggleClass('checked');
					$('body').toggleClass('show-extra-info');
				}
				if($this.hasClass('add-ledgeFsmash-grid')){
					$this.toggleClass('checked');
					$('body').toggleClass('show-ledgeFsmash');
				}
			}
		})

	});
});