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
			url: "../../api/Services/Sitemap/",
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
				console.log("FEHLER: \"../../api/Services/Sitemap/\" konnte nicht geladen werden!");
			}
		});
	}

	function containsActiveNavigationNode(navigationNode)
	{
		if (getPageName() == navigationNode.PageName)
		{
			return true;
		}

		if (navigationNode.Children != undefined &&
			navigationNode.Children != null)
		{

			for (var i = 0; i < navigationNode.Children.length; i++)
			{
	    		if (containsActiveNavigationNode(navigationNode.Children[i]))
				{
					return true;
				}
			}
		}

		return false;
	}

	function LoadNavigationItems(options, htmlElement, items)
	{
		var ul = $("<ul></ul>");
		ul.addClass("topNavigation");

		for (var i = 0; i < items.length; i++)
		{
    		if (items[i].Visible != undefined &&
    		    !items[i].Visible)
		    {
		        continue;
		    }

			var li = $("<li></li>");
			var a = $("<a></a>");

			if (containsActiveNavigationNode(items[i]))
			{
				a.addClass("navigation-node--active");
			}

			if (items[i].Action != undefined)
			{
				a.attr("href", "javascript:" + items[i].Action);
			}
			else if (items[i].URL != undefined)
			{
				a.attr("href", items[i].URL);
			}
			else
			{
				a.attr("href", "javascript:ShowSubMenu('" + items[i].Title + "');");
			}

			if (items[i].Icon != undefined)
			{
				var icon = $("<i></i>");
				icon.addClass("fas");
				icon.addClass(items[i].Icon);

				a.append(icon);
			}

			var span= $("<span></span>");
			span.text(items[i].Title);
			a.append(span);
			a.attr("title", items[i].Title);
			li.append(a);
			ul.append(li);
		}

		return ul;
	}

	function LoadPanels(options, htmlElement, panels)
	{
		var html = "";

		for (var i = 0; i < panels.length; i++)
		{
			if (panels[i].URL == undefined)
			{
				html += LoadPanel(options, htmlElement, panels[i]);
			}
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
		html += "<a href=\"javascript:HideSubMenu('" + panel.Title + "');\" class=close><i class=\"fas fa-window-close\"></i></a>";
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
    		if (topics[i].Visible != undefined &&
    		    !topics[i].Visible)
		    {
		        continue;
		    }

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

		html += "<h3>";

		if (topic.Icon != undefined)
		{
			html += "<i class=\"fas " + topic.Icon + "\"></i>";
		}

		html += "<span>" + topic.Title + "</span></h3>";

		for (var i = 0; i < topic.Children.length; i++)
		{
    		if (topic.Children[i].Visible != undefined &&
    		    !topic.Children[i].Visible)
		    {
		        continue;
		    }

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

function InitNavigation()
{
    $("#navigation").Navigation();
}

$(document).ready(function() {
	InitNavigation();
});
