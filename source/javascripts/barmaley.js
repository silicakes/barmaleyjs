//a much more modular progressBar
(function ($, window) {

	// Global since it will be referred by post init methods
	var self;
	var datasetContainer;
	var dataBars;
	var dupes = [];
	var debug = true;

	// a recursive way to pull an available id, even if the array got scrambled
	var setID = function() {
		var selectedID;
		$.each(dataBars, function($i, $v) {
			var id = $v.id
			if($.inArray(id, dupes) == -1) {
				dupes.push(id);
			}
		});
		
		debug && console.log(dupes);
		
		function setRecursiveID(predictedID) {
			debug && console.log("predictedID:",predictedID, "isDupe?", $.inArray(predictedID, dupes) != -1)
			selectedID = predictedID;
			//if not in Dupes
			if($.inArray(selectedID, dupes) == -1) {
				dupes.push(predictedID);
			} else {
				setRecursiveID(++predictedID);
			}
			return selectedID;
		}
		
		return setRecursiveID(0);
	}

	//private functions

	function getDataBarByID(id) {
		var element;
		$.each(dataBars, function($i, $v) {
			if(id == $v.id) {
				element = $v.element;
			}
		});

		return element;
	}

	function renderBar(id, options, isNew) {
		var el = {};  
		var mandatoryCSS = {
			"width": options.barWidth + "%",
			"left": options.startFrom + "%",
			"background-color": options.barColor
		};

		if(isNew) {
			el = $(document.createElement("div"))
				.addClass("data-bar")
				.attr("title", options.title || "");
			datasetContainer.append(el);
		 } else {
			el = $(getDataBarByID(id));
			debugger;
		 }

		//if a css property was passed , merge it with what we must have, otherwise , use what we got
		!!options.css ? el.css($.extend(mandatoryCSS,options.css)) : el.css(mandatoryCSS);

		//if it's close to the beginning - round the left side
		if(options.startFrom <= 1) {
			el.addClass("left-corner-radius");
		}

		//if it's close to the end - round the right side
		if(options.startFrom + options.barWidth >= 99) {
			el.addClass("right-corner-radius");
		}
			
		//if it's close to either edge - round both sides
		if(options.startFrom <= 1 && options.startFrom + options.barWidth >= 99) {
			el.hasClass("left-corner-radius right-corner-radius") ? el.removeClass("left-corner-radius right-corner-radius").addClass("round-bar") : el.addClass("round-bar");
		}

		//updating the model
		var dataContainer = self.data("barData");
		dataBars = dataContainer.dataBars;
		dataBars.push(
			$.extend(isNew && {id: setID()},{element: el.get(0)}, options));
		dataContainer.element = self.get(0);
	}

	//public methods
	var methods = {
		init: function(options) {
			self = this;

			//creating a container for the data-bars
			datasetContainer = $(document.createElement("div"));
			datasetContainer.addClass("dataset-container");
			self.append(datasetContainer);

			return self.each(function () {
				//model container
				self.data("barData", {
					dataBars: [],
					element: ""
				}); 

				//custom options
				var opts = $.extend({
					range: false,
					dataSets: [],
					ticks: false
				}, options);

				//handle ticks
				if (!!opts.ticks) {

					//creating a wrapper for the ticks
					var tickContainer = $(document.createElement("div"))
						.addClass("tick-container");
					self.append(tickContainer);			
					var areaWidth;
					var tickMargin;

					//handling responsiveness 
					if (!!opts.ticks.responsive) {
						//self.css("width", opts.responsive);
						areaWidth = tickContainer[0].offsetWidth;

						//(element width / no. of ticks) / progressbar width * 100 (to get it in %) - (20 percent of the width/number of ticks in order to make the ticks look centered)
						tickMargin = Math.floor(areaWidth / opts.ticks.amount) / self.width() * 100 - (20 / opts.ticks.amount) + "%";
					} else {
						// Multiplying by 2 since each tick is 2 pixles wide
						areaWidth = self[0].offsetWidth - opts.ticks.amount * 2;
						tickMargin = Math.floor(areaWidth / opts.ticks.amount);
					}


					tickContainer.css({
						"height": opts.ticks.height,
						"margin-top": -Math.floor(((opts.ticks.height - self.outerHeight()) / 2)) + "px" //casting to px just to be safe
					});

					//populating ticks across the progressbar
					for (i = 0; i < opts.ticks.amount; i++) {
						tickContainer.append("<div class='tick'></div>");
					}

					//adding margins to the ticks (except for the last one)
					var tickList = tickContainer.find(".tick:not(:last-child)");
					tickList.css({
						"margin-right": tickMargin
					});
				}

				//Creating initial and finate values
				if(!!opts.range) {
					//don't forget to update the model
				}

				//Appending the data sets
				$.each(opts.dataSets, function ($i, $v) {
					renderBar("", $v, true);
				});
			});
		},

		add: function(options) {
			return this.each(function() {
				renderBar("", options, true);
			});
		},

		remove: function(id) {
			return this.each(function() {
				if(dataBars.length <= 0) {
					$.error("No data-bars present: please create some first");
				} else {
					$.each(dataBars, function($i, $v) {
						if($v.id == id) {
							$($v.element).remove();
							dupes.splice([$.inArray(id, dupes)], 1);
							dataBars.splice($i, 1);
							return false;
						}
					});
				}
			});
		},

		update: function(id, options) {
			return this.each(function() {
				renderBar(id, options, false);
			});
		}
	}

	$.fn.barmaley = function (method) {
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply( this, arguments);
		} else {
			$.error( 'Method ' +  method + ' does not exist on barmaleyJS' );
		}
	}
})(jQuery, window);

