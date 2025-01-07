(function($)
{
	$.fn.CheckedKontexte = function(options)
	{
		return this.each(function()
		{
			LoadCountCheckedKontexte(options, this);
		});
	}

	function LoadCountCheckedKontexte(options, htmlElement)
	{
		$(htmlElement).empty();
		var h = $("<h3></h3>");

		let icon = $("<i></i>");
		icon.attr("class", "fas fa-flag");
		$(h).append(icon);

		let span = $("<span></span>");
		span.text("Geprüfte Kontexte");
		$(h).append(span);

		$(htmlElement).append(h);

		$.ajax(
		{
			type:"GET",
			url: "../../api/Services/Kontext/?isChecked=true",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					LoadCountNotCheckedKontexte(options, htmlElement, data.length);
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../../api/Services/Kontext/?isChecked=true\" konnte nicht geladen werden!");
			}
		});
	}

	function LoadCountNotCheckedKontexte(options, htmlElement, countOfCheckedKontexte)
	{
		$.ajax(
		{
			type:"GET",
			url: "../../api/Services/Kontext/?isChecked=false",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					$(htmlElement).append(LoadCheckedKontexteOverview(options, htmlElement, countOfCheckedKontexte, data.length));

					new Chart("chart-checked-kontexte", {
						type: "doughnut",
						data: {
							labels: ["geprüft", "nicht geprüft"],
							datasets: [{
								backgroundColor: ["blue", "grey"],
								data: [countOfCheckedKontexte, data.length]
							}]
						}
					});
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../../api/Services/Kontext/?isChecked=false\" konnte nicht geladen werden!");
			}
		});
	}

	function LoadCheckedKontexteOverview(options, htmlElement, countOfCheckedKontexte, countOfNotCheckedKontexte)
	{
		let countOfKontexte = countOfCheckedKontexte + countOfNotCheckedKontexte;

		var div = $("<div>");

		var p = $("<p>");
		p.text("Es gibt " + countOfKontexte + " Kontexte. Davon sind "  + countOfCheckedKontexte + " (" + ((countOfCheckedKontexte / countOfKontexte) * 100).toFixed(1) + "%)" + " geprüft und " + countOfNotCheckedKontexte + " (" +((countOfNotCheckedKontexte / countOfKontexte) * 100).toFixed(1) + "%) nicht geprüft.");

		div.append(p);

		var canvas = $("<canvas>");
		canvas.attr("id", "chart-checked-kontexte");

		div.append(canvas);

		return div;
	}

})(jQuery);
