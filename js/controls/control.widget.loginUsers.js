(function($)
{
	$.fn.LoginUsers = function(options)
	{
		return this.each(function()
		{
			LoadUsers(options, this);
		});
	}

	function LoadUsers(options, htmlElement)
	{
		$(htmlElement).empty();
		var h = $("<h3></h3>");

		let icon = $("<i></i>");
		icon.attr("class", "fas fa-user");
		$(h).append(icon);

		let span = $("<span></span>");
		span.text("Benutzer anmelden");
		$(h).append(span);

		$(htmlElement).append(h);

		var description = $("<p></p>");
		description.text("Als angemelder Benutzer kann man u.a. seinen Arbeitsstand speichern.");

		$(htmlElement).append(description);

		$.ajax(
		{
			type:"GET",
			url: "../../api/Services/User",
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					$(htmlElement).append(LoadScripts());
					$(htmlElement).append(LoadUsersOverview(options, htmlElement, data));
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				console.log("FEHLER: \"../../api/Services/User\" konnte nicht geladen werden!");
			}
		});
	}

	function LoadScripts()
	{
		var scripts = $("<script></script>");
		scripts.append("function loginUser(userName) {\
			var data = {\
				'login': null,\
				'userName': userName\
			};\
			$.post('../../api/Services/Session', data, function(data, status)\
			{\
				\
			});\
		}");

		return scripts;
	}

	function LoadUsersOverview(options, htmlElement, items)
	{
		var functionAsString = "\
			console.log('Login');";
		var ul = $("<ul></ul>");

		for (var i = 0; i < items.length; i++)
		{
			var li = $("<li></li>");

			var a = $("<a></a>");
			a.attr("id", "buttonLoginUser" + items[i].UserName);
			a.attr("href", "javascript:void(0)");
			a.attr("onclick", "signIn('" + items[i].UserName + "');");

			var span = $("<span></span>");
			span.text(items[i].UserName);
			a.append(span);
			a.attr("title", items[i].UserName);
			li.append(a);
			ul.append(li);
		}

		return ul;
	}

})(jQuery);