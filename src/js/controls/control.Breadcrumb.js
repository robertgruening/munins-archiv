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
			url: "../../api/Services/Sitemap/" + options.PageName + "/WithPath",
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
				console.log("FEHLER: \"../../api/Services/Sitemap/" + options.PageName + "/WithPath\" konnte nicht geladen werden!");
			}
		});	
	}

	function LoadBreadcrumbItem(options, htmlElement, item)
	{
		$(htmlElement).append($("<span/>", 
		{
			text : item.Title
		}));

		if (item.Children != undefined &&
			item.Children != null)
		{
			$(htmlElement).append($("<span> > </span>"));
			$(htmlElement).append(LoadBreadcrumbItem(options, htmlElement, item.Children));
		}
	}
	
})(jQuery);
