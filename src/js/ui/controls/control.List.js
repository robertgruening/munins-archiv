(function($)
{
	$.fn.List = function(options)
	{
		return this.each(function()
		{
			LoadList(options, this);
		});
	}

	function LoadList(options, htmlElement)
	{
		$(htmlElement).find("ul").remove();
		$(htmlElement).find("span").remove();
		
		$.ajax(
		{
			type:"GET",
			url:options.UrlGetElements,
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					LoadListItems(options, htmlElement, $.parseJSON(data));
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				alert("error");
			}
		});	
	}

	function LoadListItems(options, htmlElement, elements)
	{	
		var list = "<ul class='linkList'>";

		for (var i = 0; i < elements.length; i++)
		{
			list += "<li>";
			list += "<a href='"+options.ListItemLink+"?Id="+elements[i].Id+"'>"+options.SetListItemText(elements[i])+"</a>";

			if (options.IsDeletable != undefined &&
				options.IsDeletable == true)
			{
				list += "<input type=button elementId="+elements[i].Id+" value=Löschen class=notToPrint></input>"
			}

			list += "</li>";
		}

		list += "</ul>";
		
		if (elements.length > 0)
		{
			$(htmlElement).append(list);
			
			for (var i = 0; i < elements.length; i++)
			{				
				RegisterButtonUnlink(options, htmlElement, elements[i].Id);
			}
		}
		else
		{
			$(htmlElement).append("<span class='noLinkList'>keine vorhanden</span>");
		}
	}

	function RegisterButtonUnlink(options, htmlElement, elementId)
	{
		$(htmlElement).find("input[elementId="+elementId+"]").click(function() {
		
			$.ajax(
			{
				type:"GET",
				url:options.SetUrlUnlink($(htmlElement).find("input[elementId="+elementId+"]").attr("elementId")),
				success:function(data, textStatus, jqXHR)
				{
					if (data)
					{
						LoadList(options, htmlElement);
					}
				},
				error:function(jqXHR, textStatus, errorThrown)
				{
					alert("error");
				}
			});
		});
	}
	
})(jQuery);
