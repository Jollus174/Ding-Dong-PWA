// Sort out character boxes
var characters = (function() {

    function charactersViewModel(){
        var self = this;
        self.name = "";
        self.url = "";
        self.bgColour = "";
        self.weight = "";
        self.difficulty = "";
        self.minPercent = "";
        self.maxPercent = "";
        self.percRange = "";
        self.fallspeed = "";
        self.airdodgeStart = "";
        self.airdodgeEnd = "";
        self.imagePosition = "";
        self.textContrast = "";
    }

    function CharacterApiService() {
        var self = this;

        // retrieves all arrivals from the API
        self.getAll = function() {
            return new Promise(function(resolve, reject) {
                var request = new XMLHttpRequest();
                request.open('GET', './api/data.json');

                request.onload = function() {
                    // success
                    if (request.status === 200) {
                        // resolve the promise with the parsed response text (assumes JSON)
                        var charDataJSON = "";
                        charDataJSON = JSON.parse(request.response);
                        resolve(charDataJSON);
                    } else {
                        // error retrieving file
                        reject(Error(request.statusText));
                    }
                };

                request.onerror = function() {
                    // network errors
                    reject(Error("Network Error"));
                };

                request.send();
            });
        };
    }


    function CharacterAdapter() {
        var self = this;

        self.toCharacterViewModel = function(data){
            if(data){
                var vm = new charactersViewModel();

                vm.name = data.name;
                vm.bgColour = data.bgColour;
                vm.weight = data.weight;
                vm.fallspeed = data.fallspeed;

                vm.url = data.url;

                vm.minPercent = parseInt(data.minPercent);
                vm.maxPercent = parseInt(data.maxPercent);

                vm.percRange = ko.computed(function(){
                    return vm.maxPercent - vm.minPercent;
                }, this);

                vm.difficulty = ko.computed(function(){
                    var percent = vm.maxPercent - vm.minPercent;
                    var diff = "";
                    //var diffText = diff + ' - ' + percent;
                    if(0 <= percent && percent <= 6){diff = 'very-hard'};
                    if(7 <= percent && percent <= 11){diff = 'hard'};
                    if(12 <= percent && percent <= 22){diff = 'average'};
                    if(23 <= percent && percent <= 30){diff = 'easy'};
                    if(31 <= percent){diff = 'very-easy'};
                    return diff;
                }, this);

                vm.airdodgeStart = data.airdodgeStart;
                vm.airdodgeEnd = data.airdodgeEnd;
                vm.imagePosition = data.imagePosition;
                /*vm.textContrast = ko.computed(function(){
                    var textColour = "";
                    if(data.textContrast == 'dark'){
                        textColour = 'text-dark';
                    }
                    return textColour;
                }, this);*/
                vm.textContrast = data.textContrast;

                // Generating image properties
                vm.imageProperties = ko.observable(vm.url + ' ' + vm.imagePosition + ' ' + vm.textContrast);

                vm.fd = vm.minPercent;

                vm.bfNormal = ko.computed(function(){return vm.minPercent + 7}, this);
                vm.bfLowPlat = ko.computed(function(){return vm.minPercent - 7}, this);
                vm.bfTopPlat = ko.computed(function(){return vm.minPercent - 20}, this);

                vm.dlNormal = vm.fd;
                vm.dlLowPlat = ko.computed(function(){return vm.minPercent - 15}, this);
                vm.dlTopPlat = ko.computed(function(){return vm.minPercent - 26}, this);

                vm.svNormalMin = ko.computed(function(){return vm.minPercent + 1}, this);
                vm.svNormalMax = ko.computed(function(){return vm.maxPercent + 1}, this);
                vm.svPlat = ko.computed(function(){return vm.minPercent - 14}, this);

                vm.tcNormal = ko.computed(function(){return vm.minPercent - 4}, this);
                vm.tcSidePlat = ko.computed(function(){return vm.minPercent - 25}, this);
                vm.tcTopPlat = ko.computed(function(){return vm.minPercent - 41}, this);
                vm.tcLowPlat = ko.computed(function(){return vm.minPercent - 20}, this);

                // Aaaand now to get the filter going
                // https://stackoverflow.com/questions/20857594/knockout-filtering-on-observable-array
                vm.currentFilter = ko.observable(); // property to store the filter

                vm.filterNames = ko.computed(function(){
                    if(!vm.currentFilter()){
                        return vm;
                    } else {
                        return ko.utils.arrayFilter(vm, function(self){
                            return self.name == vm.currentFilter();
                        })
                    }
                })




                return vm;
            };
            return null;
        };

        // This block maps them out? Will repeat the functions for each element being called.
        self.toCharacterViewModels = function(data) {
            if (data && data.length > 0) {
                return data.map(function(character) {
                    return self.toCharacterViewModel(character);
                });
            }
            return [];
        };
    }

    function CharacterController(characterApiService, CharacterAdapter) {
        var self = this;

        self.getAll = function() {
            // retrieve all the arrivals from the API
            return characterApiService.getAll().then(function(response) {
                /*var obj = JSON.parse(characterApiService.getAll());
                console.log(obj);*/
                return CharacterAdapter.toCharacterViewModels(response);
            });
        };
    }


    // initialize the services and adapters
    var characterApiService = new CharacterApiService();
    var CharacterAdapter = new CharacterAdapter();

    // initialize the controller
    var characterController = new CharacterController(characterApiService, CharacterAdapter);    

    return {
        loadData: function() {
            // retrieve all routes
            //document.querySelector("#main").classList.add('loading')
            characterController.getAll().then(function(response) {
                // bind the characters to the UI
                Page.vm.character(response);
                document.getElementById("body").classList.remove('loading')
                // displays the grid now that shiz is loaded
                //document.getElementById('main').style.display = "block";
            });
        }
    }

})();