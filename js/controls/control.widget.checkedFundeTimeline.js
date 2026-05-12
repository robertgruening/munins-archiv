(function($)
{
	$.fn.CheckedFundeTimeline = function(options)
	{
		return this.each(function()
		{
			LoadCountCheckedFundeTimeline(options, this);
		});
	}

	function LoadCountCheckedFundeTimeline(options, htmlElement)
	{
		$(htmlElement).empty();
		var h = $("<h3></h3>");

		let icon = $("<i></i>");
		icon.attr("class", "fas fa-puzzle-piece");
		$(h).append(icon);

		let span = $("<span></span>");
		span.text("Geprüfte Funde");
		$(h).append(span);

		$(htmlElement).append(h);

		$.ajax(
		{
			type:"GET",
			url: "../../api/Services/Fund/?isChecked=true",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					let chartData = {};

					data.data.forEach(element => {
						let date = new Date(element.LastCheckedDate).toLocaleDateString();

						if (typeof chartData[date] === 'undefined') {
							chartData[date] = 1;
						}
						else {
							chartData[date]++;
						}
					});

					let labels = Object.keys(chartData);
					let values = [];

					labels.forEach(label => {
						values.push(chartData[label]);
					});

					$(htmlElement).append(LoadCheckedFundeTimeline(options, htmlElement, data.count, labels.length));

					new Chart($("#chart-checked-funde-timeline"), {
						type: "bar",
						data: {
							labels: labels,
							datasets: [{
								label: 'geprüft',
								backgroundColor: ["blue"],
								data: values
							}]
						}
					});
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../../api/Services/Fund/?isChecked=true\" konnte nicht geladen werden!");
			}
		});
	}

	function LoadCheckedFundeTimeline(options, htmlElement, countOfCheckedFunde, countOfDates)
	{
		let countOfFunde = countOfCheckedFunde;

		var div = $("<div>");

		var p = $("<p>");
		p.text("Es gibt " + countOfFunde + " Fundprüfungen verteilt über " + countOfDates + " Tage.");

		div.append(p);

		var canvas = $("<canvas>");
		canvas.attr("id", "chart-checked-funde-timeline");

		div.append(canvas);

		return div;
	}

})(jQuery);
