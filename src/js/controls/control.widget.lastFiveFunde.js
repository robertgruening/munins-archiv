(function($)
{
	$.fn.LastFiveFunde = function(options)
	{
		return this.each(function()
		{
			LoadLastFiveFunde(options, this);
		});
	}

	function LoadLastFiveFunde(options, htmlElement)
	{
		$(htmlElement).empty();
		var h = $("<h3></h3>");
		h.text("Letzten 5 Funde");

		$(htmlElement).append(h);

		var description = $("<p></p>");
		description.text("Die fünf zuletzt angelegten Funde werden nachfolgend angezeigt.");

		$(htmlElement).append(description);

		$.ajax(
		{
			type:"GET",
			url: "../../api/Services/Fund/?sortingOrder=DESC&pageSize=5",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					$(htmlElement).append(LoadLastFiveFundeOverview(options, htmlElement, data.data));
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../../api/Services/Fund/?sortingOrder=DESC&pageSize=5\" konnte nicht geladen werden!");
			}
		});
	}

	function LoadLastFiveFundeOverview(options, htmlElement, items)
	{		
		var ul = $("<ul></ul>");

		for (var i = 0; i < items.length; i++)
		{
			var li = $("<li></li>");

			var a = $("<a></a>");
			a.attr("href", "../../pages/Fund/Form.html?Id=" + items[i].Id);

			var span= $("<span></span>");
			span.text(items[i].Anzahl + "x \"" + items[i].Bezeichnung + "\"");
			a.append(span);
			a.attr("title", items[i].Anzahl + "x \"" + items[i].Bezeichnung + "\"");
			li.append(a);
			ul.append(li);
		}

		return ul;
	}

})(jQuery);
