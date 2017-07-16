(function($)
{
	$.fn.Breadcrumb = function(options)
	{
		return this.each(function()
		{
			LoadBreadcrumb(options, this);
		});
	}

	function LoadBreadcrumb(options, htmlElement)
	{
		$(htmlElement).empty();
		
		$.ajax(
		{
			type:"GET",
			url: "../Dienste/Sitemap/" + options.PageName + "/WithPath",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					LoadBreadcrumbItem(options, htmlElement, data);
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../Dienste/Sitemap/" + options.PageName + "/WithPath\" konnte nicht geladen werden!");
			}
		});	
	}

	function LoadBreadcrumbItem(options, htmlElement, item)
	{
		if (item.URL == undefined)
		{
			$(htmlElement).append($("<span/>", 
			{
				text : item.Title
			}));
		}
		else
		{
			$(htmlElement).append($("<a/>", 
			{
				href : item.URL,
				text : item.Title
			}));
		}

		if (item.Children != undefined &&
			item.Children != null)
		{
			$(htmlElement).append($("<span> > </span>"));
			$(htmlElement).append(LoadBreadcrumbItem(options, htmlElement, item.Children));
		}
	}
	
})(jQuery);
