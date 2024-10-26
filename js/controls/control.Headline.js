(function($)
{
	$.fn.Headline = function(options)
	{
		return this.each(function()
		{
			LoadHeadline(options, this);
		});
	}

	function LoadHeadline(options, htmlElement)
	{
		$(htmlElement).empty();

		$.ajax(
		{
			type:"GET",
			url: "../../api/Services/Sitemap/",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					SetHeadline(options, htmlElement, data);
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../../api/Services/Sitemap/\" konnte nicht geladen werden!");
			}
		});
	}

	function getActiveNavigationNode(navigationNode)
	{
		if (getPageName() == navigationNode.PageName)
		{
			return navigationNode;
		}

		if (navigationNode.Children != undefined &&
			navigationNode.Children != null)
		{
			for (var i = 0; i < navigationNode.Children.length; i++)
			{
				var activeNavigationNode = getActiveNavigationNode(navigationNode.Children[i]);

				if (activeNavigationNode != null)
				{
					return activeNavigationNode;
				}
			}
		}

		return null;
	}

	function SetHeadline(options, htmlElement, items)
	{
		var activeNavigationNode = null;

		for (var i = 0; i < items.length; i++)
		{
			var activeNavigationNode = getActiveNavigationNode(items[i]);

			if (activeNavigationNode != null)
			{
				break;
			}
		}

		if (activeNavigationNode == null)
		{
			return;
		}

		$(htmlElement).text(activeNavigationNode.Title);
	}

})(jQuery);

function InitHeadline()
{
    $("h2").Headline();
}

$(document).ready(function() {
	InitHeadline();
});
