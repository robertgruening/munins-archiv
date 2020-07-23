(function($)
{
	$.fn.DefectiveKontexte = function(options)
	{
		return this.each(function()
		{
			LoadDefectiveKontexte(options, this);
		});
	}

	function LoadDefectiveKontexte(options, htmlElement)
	{
		$(htmlElement).empty();
		var h = $("<h3></h3>");
		h.text("Fehlerhafter Kontext");

		$(htmlElement).append(h);

		var description = $("<p></p>");
		description.text("Kontexte gelten als fehlerhaft, wenn sie leer sind - also keine Kontexte und keine Funde enthalten.");

		$(htmlElement).append(description);

		$.ajax(
		{
			type:"GET",
			url: "../../api/Services/Kontext/?hasChildren=false&hasFunde=false",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					$(htmlElement).append(LoadDefectiveKontexteOverview(options, htmlElement, data));
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../../api/Services/Kontext/?hasChildren=false&hasFunde=false\" konnte nicht geladen werden!");
			}
		});
	}

	function LoadDefectiveKontexteOverview(options, htmlElement, items)
	{		
		var ul = $("<ul></ul>");

		for (var i = 0; i < items.length; i++)
		{
			var li = $("<li></li>");

			var a = $("<a></a>");
			a.attr("href", "../../pages/" + items[i].Type.Bezeichnung + "/Form.html?Id=" + items[i].Id);

			var span= $("<span></span>");
			span.text("/" + items[i].Path);
			a.append(span);
			a.attr("title", "/" + items[i].Path);
			li.append(a);
			ul.append(li);
		}

		return ul;
	}

})(jQuery);
