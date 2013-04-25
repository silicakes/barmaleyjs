
(function($) {
	$(".progressbar").barmaley({
		range: {
			initValue: 0,
			finiteValue: 255
		},
		dataSets: [{
				barWidth: 40,
				startFrom: 0,
				barColor: "#852",
				title: "My awesome Data"
			}, {
				barWidth: 15,
				startFrom: 20,
				barColor: "#369"
			}, {
				barWidth: 30,
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