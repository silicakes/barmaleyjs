//a much more modular progressBar
(function ($, window) {

	// Global since it will be referred by post init methods
	var self;

	//private functions 
	
	//public methods
	var methods = {
		init: function(options) {
			self = this;

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
				var datasetContainer = $(document.createElement("div"));
				datasetContainer.addClass("dataset-container");
				self.append(datasetContainer);
				$.each(opts.dataSets, function ($i, $v) {
					
					//creating a model
					var el = $(document.createElement("div"))
						.addClass("data-bar")
						.attr("title", $v.title || "");
					var mandatoryCSS = {
						"width": $v.barLength + "%",
						"left": $v.startFrom + "%",
						"background-color": $v.barColor
					};

					//if a css property was passed , merge it with what we must have, otherwise , use what we got
					!!$v.css ? el.css($.extend(mandatoryCSS,$v.css)) : el.css(mandatoryCSS);
					
					//if it's close to the beginning - round the left side
					if($v.startFrom <= 1) {
						el.addClass("left-corner-radius");
					}

					//if it's close to the end - round the right side
					if($v.startFrom + $v.barLength >= 99) {
						el.addClass("right-corner-radius");
					}
					
					//if it's close to either edge - round both sides
					if($v.startFrom <= 1 && $v.startFrom + $v.barLength >= 99) {
						el.hasClass("left-corner-radius right-corner-radius") ? el.removeClass("left-corner-radius right-corner-radius").addClass("round-bar") : el.addClass("round-bar");
					}

					datasetContainer.append(el);
					//updating the model
					var dataContainer = self.data("barData")
					dataContainer.dataBars.push(
						$.extend({id: $i,element: el.get(0)}, $v));
					dataContainer.element = self.get(0);
				});
			});
		},

		/*update: function(id, values) {
			var self = this;
			return self.each(function() {
				var dataBar = self.data("barData",dataBars)[id];
				var dataBarEl = $(self.data("barData")[id].element);
				dataBar.css({
					"width": values.barLength || dataBarEl.barLength,
					"left": values.startFrom || dataBarEl.startFrom
				});
				dataBar.attr("title", values.title || dataBarEl.attr("title"));
				dataBar.range.initValue = values.range.initValue || dataBar.range.initValue;
				dataBar.range.finiteValue = values.range.finiteValue || dataBar.range.finiteValue
			});
		}*/

		remove: function(id) {
			var dataBars = self.data("barData").dataBars;
			if(dataBars.length <= 0) {
				$.error("No data-bars present: please create some first");
			} else {
				$.each(dataBars, function($i, $v) {
					if($v.id == id) {
						$($v.element).remove();
						dataBars.splice($i,1);
					}
				});
			}
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

