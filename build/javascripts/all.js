
(function($) {
	$(".progressbar").barmaley({
		range: {
			initValue: 0,
			finiteValue: 255
		},
		dataSets: [{
				barLength: 40,
				startFrom: 0,
				barColor: "#852",
				title: "My awesome Data"
			}, {
				barLength: 15,
				startFrom: 20,
				barColor: "#369"
			}, {
				barLength: 30,
				startFrom: 25,
				barColor: "#a59",
				css: {"border": "1px solid #fff"}
			}
		],
		ticks: {
			height: "24px",
			amount: 9,
			responsive: true
		}
});

})(jQuery);
