var Page = (function(){

	// declare the view model used within the page

	function ViewModel(){

		var self = this;
		self.character = ko.observableArray([]);

		// Retrieve Knockout item index --> https://www.codeproject.com/Tips/797418/Using-index-in-Knockout-js
		/*self.showItemIndex = function(item, event){
			var context = ko.contextFor(event.target);
			var index = context.$index();
		}*/



        self.filter = function(name){
            self.currentFilter(name);
        }

		// Sorting arrays within Knockout --> http://www.c-sharpcorner.com/UploadFile/cd7c2e/apply-sort-function-on-observable-array-using-knockoutjs/
		self.sortName = function(item, event){;
			var $filterButtons = $('.filter-btn');
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
			}
		}

		// Sorting tables
		// http://develothink.com/sorting-tables-using-knockoutjs/
		self.sortWeight = function(item, event){
			var $filterButtons = $('.filter-btn');
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
			}
		}

		self.sortDifficulty = function(item, event){
			var $filterButtons = $('.filter-btn');
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
			}
		}


		// Using traditional jQuery 'click()' bindings will not work on dynamically generated character boxes!
		// https://stackoverflow.com/questions/6658752/click-event-doesnt-work-on-dynamically-generated-elements

	}

	//export the view model through the Page module
	return {
		vm: new ViewModel()
		/* Offline Warning stuff. Will replace */
   }

})();