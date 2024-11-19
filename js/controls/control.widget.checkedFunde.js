(function($)
{
	$.fn.CheckedFunde = function(options)
	{
		return this.each(function()
		{
			LoadCountCheckedFunde(options, this);
		});
	}

	function LoadCountCheckedFunde(options, htmlElement)
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
			url: "../../api/Services/Fund/?isChecked=true&pageSize=0",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					LoadNotCountCheckedFunde(options, htmlElement, data.count);
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../../api/Services/Fund/?sortingOrder=DESC&pageSize=5\" konnte nicht geladen werden!");
			}
		});
	}

	function LoadNotCountCheckedFunde(options, htmlElement, countOfCheckedFunde)
	{
		$.ajax(
		{
			type:"GET",
			url: "../../api/Services/Fund/?isChecked=false&pageSize=0",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					$(htmlElement).append(LoadCheckedFundeOverview(options, htmlElement, countOfCheckedFunde, data.count));

					new Chart("chart-checked-funde", {
						type: "doughnut",
						data: {
							labels: ["geprüft", "nicht geprüft"],
							datasets: [{
								backgroundColor: ["blue", "grey"],
								data: [countOfCheckedFunde, data.count]
							}]
						}
					});
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../../api/Services/Fund/?sortingOrder=DESC&pageSize=5\" konnte nicht geladen werden!");
			}
		});
	}

	function LoadCheckedFundeOverview(options, htmlElement, countOfCheckedFunde, countOfNotCheckedFunde)
	{
		let countOfFunde = countOfCheckedFunde + countOfNotCheckedFunde;

		var div = $("<div>");

		var p = $("<p>");
		p.text("Es gibt " + countOfFunde + " Funde. Davon sind "  + countOfCheckedFunde + " (" + ((countOfCheckedFunde / countOfFunde) * 100).toFixed(1) + "%)" + " geprüft und " + countOfNotCheckedFunde + " (" +((countOfNotCheckedFunde / countOfFunde) * 100).toFixed(1) + "%) nicht geprüft.");

		div.append(p);

		var canvas = $("<canvas>");
		canvas.attr("id", "chart-checked-funde");

		div.append(canvas);

		return div;
	}

})(jQuery);
