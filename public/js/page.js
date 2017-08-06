
var Page = (function(){

	// declare the view model used within the page

	function ViewModel(){

		var self = this;
		self.character = ko.observableArray([]);

		// Filter is finally bloody working. Ty based 'super cool'
		// https://stackoverflow.com/questions/36283070/search-filter-with-knockoutjs
		// Can't use this after all, as Knockout doesn't store the index numbers
		// Refactored code is in custom.js
		/*self.query = ko.observable('');

		self.filterCharacters = ko.computed(function(){
			var search = self.query().toLowerCase();
			if(!search){
				return self.character();
			} else {
				return ko.utils.arrayFilter(self.character(), function(item){
					return item.name.toLowerCase().indexOf(search) !== -1;
				});
			}
		})*/

		function reassignIndexes(){
			console.log('reindexing!');
			$('.character-box').each(function(){
				var $this = $(this);
				var theIndex = parseInt($this.index());
				$this.find('.grid-index span').text(theIndex + 1);
			})
		}

		// Initialise the reindexing
		reassignIndexes();

		// Sorting arrays within Knockout --> http://www.c-sharpcorner.com/UploadFile/cd7c2e/apply-sort-function-on-observable-array-using-knockoutjs/
		self.sortName = function(item, event){;
			var $filterButtons = $('.filter-btn').not('#filter-dropdown-btn.filter-btn');
			var $element = $(event.target);

			if($element.hasClass('active')){
				$element.toggleClass('asc');
			} else {
				$filterButtons.removeClass('active asc');
				$element.addClass('active');
			};

			// Create conditional to sort the characters A-Z or Z-A
			if($element.hasClass('asc')){
				// Ascending order
				self.character.sort(function(left, right){
					return right.name == left.name ? 0 : (right.name < left.name ? -1 : 1)
				});
			} else {
				// Descending order (default)
				self.character.sort(function(left, right){
					return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1)
				});
				reassignIndexes();
			}
		}

		// Sorting tables
		// http://develothink.com/sorting-tables-using-knockoutjs/
		self.sortWeight = function(item, event){
			var $filterButtons = $('.filter-btn').not('#filter-dropdown-btn.filter-btn');
			var $element = $(event.target);

			if($element.hasClass('active')){
				$element.toggleClass('asc');
			} else {
				$filterButtons.removeClass('active asc');
				$element.addClass('active');
			};

			// Create conditional to sort the characters A-Z or Z-A
			if($element.hasClass('asc')){
				// Ascending order (default)
				self.character.sort(function(lower, higher){
					return higher.weight - lower.weight;
				});
			} else {
				// Descending order (default)
				self.character.sort(function(lower, higher){
					return lower.weight - higher.weight;
				});
				reassignIndexes();
			}
		}

		self.sortDifficulty = function(item, event){
			var $filterButtons = $('.filter-btn').not('#filter-dropdown-btn.filter-btn');
			var $element = $(event.target);

			if($element.hasClass('active')){
				$element.toggleClass('asc');
			} else {
				$filterButtons.removeClass('active asc');
				$element.addClass('active');
			};

			// Create conditional to sort the characters Easy-Hard or Hard-Easy
			if($element.hasClass('asc')){
				// Ascending order
				self.character.sort(function(lower, higher){
					return (lower.maxPercent - lower.minPercent) - (higher.maxPercent - higher.minPercent);
				});
			} else {
				// Descending order (default)
				self.character.sort(function(lower, higher){
					return (higher.maxPercent - higher.minPercent) - (lower.maxPercent - lower.minPercent);
				});
				reassignIndexes();
			}
		}

		self.sortFallspeed = function(item, event){
			var $filterButtons = $('.filter-btn').not('#filter-dropdown-btn.filter-btn');
			var $element = $(event.target);

			if($element.hasClass('active')){
				$element.toggleClass('asc');
			} else {
				$filterButtons.removeClass('active asc');
				$element.addClass('active');
			};

			// Create conditional to sort the characters low-fallspeed to high-fallspeed or high-fallspeed to low-fallspeed
			if($element.hasClass('asc')){
				// Ascending order (default)
				self.character.sort(function(lower, higher){
					return higher.fallspeed - lower.fallspeed;
				});
			} else {
				// Descending order (default)
				self.character.sort(function(lower, higher){
					return lower.fallspeed - higher.fallspeed;
				});
				reassignIndexes();
			}
		}

		self.sortGravity = function(item, event){
			var $filterButtons = $('.filter-btn').not('#filter-dropdown-btn.filter-btn');
			var $element = $(event.target);

			if($element.hasClass('active')){
				$element.toggleClass('asc');
			} else {
				$filterButtons.removeClass('active asc');
				$element.addClass('active');
			};

			// Create conditional to sort the characters low-grav to high-grav or high-grab to low-grav
			if($element.hasClass('asc')){
				// Ascending order (default)
				self.character.sort(function(lower, higher){
					return higher.gravity - lower.gravity;
				});
			} else {
				// Descending order (default)
				self.character.sort(function(lower, higher){
					return lower.gravity - higher.gravity;
				});
				reassignIndexes();
			}
		}

		// Using traditional jQuery 'click()' bindings will not work on dynamically generated character boxes!
		// https://stackoverflow.com/questions/6658752/click-event-doesnt-work-on-dynamically-generated-elements

	}


	return {
		vm: new ViewModel(),

		hideOfflineWarning: function(){
			// enable the live data
			document.querySelector('body').classList.remove('loading')
			// remove the offline message
			document.getElementById('notification').style.display = 'none';
			// load the live data
		},
		showOfflineWarning: function(){
			// disable the live data
			// document.querySelector('body').classList.add('loading')
			// load html template informing the user they are offline
			var request = new XMLHttpRequest();
			request.open('GET', './offline.html', true);

			request.onload = function(){
				if(request.status === 200){
					// success
					// create offline element with HTML loaded from offline.html template

					document.getElementById('notification').innerHTML = request.responseText;
					document.getElementById('notification').style.display = 'block';
					setTimeout(function(){
						document.getElementById('notification').style.display = 'none';
					}, 3000);

                } else {
                    // error retrieving file
                    console.warn('Error retrieving offline.html');
                }
            };

            request.onerror = function() {
                // network errors
                console.error('Connection error');
            };

            request.send();
        }
   }

})();