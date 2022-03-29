(function($)
{
	$.fn.KontextFileList = function(options)
	{
		return this.each(function()
		{
			loadKontextFileList(options, this);
		});
	}

	function loadKontextFileList(options, htmlElement)
	{
		$(htmlElement).empty();

		let muninsArchivWebdavClient = new MuninsArchivWebdavClient();
		muninsArchivWebdavClient.getContentList(
			options.path,
			function(contentListJson) {

			},
			function(jqXHR, textStatus, errorThrown) {
				
			}
		);
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
