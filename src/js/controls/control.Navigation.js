(function($)
{
	$.fn.Navigation = function(options)
	{
		return this.each(function()
		{
			LoadNavigation(options, this);
		});
	}

	function LoadNavigation(options, htmlElement)
	{
		$(htmlElement).empty();
		
		$.ajax(
		{
			type:"GET",
			url: "../Dienste/Sitemap/",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					$(htmlElement).append(LoadNavigationItems(options, htmlElement, data));
					$(htmlElement).append(LoadPanels(options, htmlElement, data));
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../Dienste/Sitemap/\" konnte nicht geladen werden!");
			}
		});	
	}

	function LoadNavigationItems(options, htmlElement, items)
	{	
		var html = "<ul class='topNavigation'>";

		for (var i = 0; i < items.length; i++)
		{
			html += "<li>";

			if (items[i].Action != undefined)
			{
				html += "<a href=\"javascript:" + items[i].Action + "\">" + items[i].Title + "</a>";
			}
			else
			{
				html += "<a href=\"javascript:ShowSubMenu('" + items[i].Title + "');\">" + items[i].Title + "</a>";
			}

			html += "</li>";
		}

		html += "</ul>";

		return html;
	}

	function LoadPanels(options, htmlElement, panels)
	{
		var html = "";

		for (var i = 0; i < panels.length; i++)
		{
			html += LoadPanel(options, htmlElement, panels[i]);
		}

		return html;
	}

	function LoadPanel(options, htmlElement, panel)
	{
		if (panel == undefined ||
			panel == null)
		{
			return "";
		}

		var html = "<nav id=" + panel.Title + " class=topNavigationSubMenu>";
		html += "<a href=\"javascript:HideSubMenu('" + panel.Title + "');\" class=close>X</a>";
		html += LoadTopics(options, htmlElement, panel.Children);
		html += "</nav>";

		return html;
	}

	function LoadTopics(options, htmlElement, topics)
	{
		if (topics == undefined ||
			topics == null)
		{
			return "";
		}

		var html = "";

		for (var i = 0; i < topics.length; i++)
		{
			html += LoadTopic(options, htmlElement, topics[i]);
		}

		return html;
	}

	function LoadTopic(options, htmlElement, topic)
	{
		if (topic == undefined ||
			topic == null)
		{
			return "";
		}

		var html = "<div>";
		html += "<h3>" + topic.Title + "</h3>";

		for (var i = 0; i < topic.Children.length; i++)
		{
			html += "<a ";
	
			if (topic.Children[i].Enabled == undefined ||
				topic.Children[i].Enabled == true)
			{
				if (topic.Children[i].URL != undefined)
				{
					html += "href=\"" + topic.Children[i].URL + "\"";
				}
				else if (topic.Children[i].Action != undefined)
				{
					html += "href=\"javascript:" + topic.Children[i].Action + "\"";
				}
			}
			else
			{
				html += "class=\"disabled\"";
			}

			html += ">" + topic.Children[i].Title + "</a>";
		}

		html += "</div>";

		return html;
	}
	
})(jQuery);

function ShowSubMenu(id) 
{
	var isHidden = $("#"+id).css("display") == "none";
	$("nav").hide();
	
	if (isHidden)	
	{
		$("#"+id).show();
	}
}

function HideSubMenu(id) 
{
	$("#"+id).hide();
}
