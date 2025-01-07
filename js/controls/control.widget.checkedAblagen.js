(function($)
{
	$.fn.CheckedAblagen = function(options)
	{
		return this.each(function()
		{
			LoadCountCheckedAblagen(options, this);
		});
	}

	function LoadCountCheckedAblagen(options, htmlElement)
	{
		$(htmlElement).empty();
		var h = $("<h3></h3>");

		let icon = $("<i></i>");
		icon.attr("class", "fas fa-box");
		$(h).append(icon);

		let span = $("<span></span>");
		span.text("Geprüfte Ablagen");
		$(h).append(span);

		$(htmlElement).append(h);

		$.ajax(
		{
			type:"GET",
			url: "../../api/Services/Ablage/?isChecked=true",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					LoadCountNotCheckedAblagen(options, htmlElement, data.length);
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../../api/Services/Ablage/?isChecked=true\" konnte nicht geladen werden!");
			}
		});
	}

	function LoadCountNotCheckedAblagen(options, htmlElement, countOfCheckedAblagen)
	{
		$.ajax(
		{
			type:"GET",
			url: "../../api/Services/Ablage/?isChecked=false",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					$(htmlElement).append(LoadCheckedAblagenOverview(options, htmlElement, countOfCheckedAblagen, data.length));

					new Chart("chart-checked-ablagen", {
						type: "doughnut",
						data: {
							labels: ["geprüft", "nicht geprüft"],
							datasets: [{
								backgroundColor: ["blue", "grey"],
								data: [countOfCheckedAblagen, data.length]
							}]
						}
					});
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../../api/Services/Ablage/?isChecked=false\" konnte nicht geladen werden!");
			}
		});
	}

	function LoadCheckedAblagenOverview(options, htmlElement, countOfCheckedAblagen, countOfNotCheckedAblagen)
	{
		let countOfAblagen = countOfCheckedAblagen + countOfNotCheckedAblagen;

		var div = $("<div>");

		var p = $("<p>");
		p.text("Es gibt " + countOfAblagen + " Ablagen. Davon sind "  + countOfCheckedAblagen + " (" + ((countOfCheckedAblagen / countOfAblagen) * 100).toFixed(1) + "%)" + " geprüft und " + countOfNotCheckedAblagen + " (" +((countOfNotCheckedAblagen / countOfAblagen) * 100).toFixed(1) + "%) nicht geprüft.");

		div.append(p);

		var canvas = $("<canvas>");
		canvas.attr("id", "chart-checked-ablagen");

		div.append(canvas);

		return div;
	}

})(jQuery);
