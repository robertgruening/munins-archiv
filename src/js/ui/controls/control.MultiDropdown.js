(function($)
{
	$.fn.MultiDropdown = function(options)
	{
		return this.each(function()
		{
			LoadMultiDropdown(options, "#"+this.id, options.SelectedElementId);
		});
	}
	
	function LoadMultiDropdown(options, containerSelector, elementId)
	{	
		if (elementId == undefined ||
			elementId == null ||
			elementId == GetValueForNoSelection())
		{
			// Load all root elements and don't select
			LoadDropdown(options, containerSelector, 0, null);
			RemoveSelections(containerSelector, 1);
			
			options.SetSelectedElementId(null);
			return;
		}
		
		$.ajax(
		{
			type:"POST",
			url:options.UrlGetParents,
			data:{
				Id : elementId
			},
			success:function(data, textStatus, jqXHR)
			{
				var level = 0;
				
				if (data)
				{
					var ablage = $.parseJSON(data)[0];
					var parent = null;
					
					// Load all root elements and select given element
					LoadDropdown(options, containerSelector, level, null, ablage.Id);
					level++;
					
					while (ablage.Children != undefined &&
						ablage.Children.length > 0)
					{
						parent = ablage;
						ablage = ablage.Children[0];
						
						// Load all child elements and select given element
						LoadDropdown(options, containerSelector, level, parent.Id, ablage.Id);
						level++;				
					}
					
					// Load all child elements and don't select
					LoadDropdown(options, containerSelector, level, ablage.Id);
					options.SetSelectedElementId(ablage.Id);
					
					level++;			
					RemoveSelections(containerSelector, level);
				}
				
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				alert("error");
			}
		});
	}	

	function LoadDropdown(options, containerSelector, level, parentId, selectedChildId)
	{
		$.ajax(
		{
			type:"POST",
			url:options.UrlGetChildren,
			data:{
				Id : parentId
			},
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					var children = $.parseJSON(data);
					if (children.length > 0)
					{
						var selectSelector = containerSelector+" select[level="+level+"]";
						
						if ($(selectSelector).length == 0)
						{
							var dropdowns = $(containerSelector+" select");
							var previousLevel = null;
							var nextLevel = null;
							for (var i = 0; i < dropdowns.length; i++)
							{
								if ($(dropdowns[i]).attr("level") < level)
								{
									if (previousLevel == null ||
										$(dropdowns[i]).attr("level") > previousLevel)
									{
										previousLevel = $(dropdowns[i]).attr("level");
									}
								}
								else if ($(dropdowns[i]).attr("level") > level)
								{
									if (nextLevel == null ||
										$(dropdowns[i]).attr("level") < nextLevel)
									{
										nextLevel = $(dropdowns[i]).attr("level");
									}
								}
							}
							
							if (previousLevel == null)
							{
								if (nextLevel == null)
									$(containerSelector).append("<select level="+level+"></div>");
								else
									$(containerSelector+" select[level="+(nextLevel)+"]").before("<select level="+level+"></div>");
							}
							else
							{
								$(containerSelector+" select[level="+(previousLevel)+"]").after("<select level="+level+"></div>");
							}
						}
						
						LoadOptionsAblage(options, containerSelector, children, level);
						RegisterSelectionChangeEvent(options, containerSelector, level);
						
						if (selectedChildId)
							$(selectSelector).val(selectedChildId);
					}
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				alert("error");
			}
		});	
	}	

	function RemoveSelections(containerSelector, level)
	{	
		var selectSelector = containerSelector+" select[level="+level+"]";
		while ($(selectSelector).length > 0)
		{
			$(selectSelector).remove();
			level++;
			selectSelector = containerSelector+" select[level="+level+"]";
		}
	}

	function LoadOptionsAblage(options, containerSelector, ablagen, level)
	{
		var selectSelector = containerSelector+" select[level="+level+"]";
		var optionList = CreateOptionNoSelection();
		for (var i = 0; i < ablagen.length; i++)
		{
			optionList += CreateOptionAblage(options, ablagen[i]);
		}
		$(selectSelector).html(optionList);
	}

	function RegisterSelectionChangeEvent(options, containerSelector, level)
	{
		var selectSelector = containerSelector+" select[level="+level+"]";
		$(selectSelector).change(function() {
			
			var value = $(selectSelector).val();
			
			if (level > 0 && $(selectSelector).val() == GetValueForNoSelection())
			{
				var previousSelectSelector = containerSelector+" select[level="+(level - 1)+"]";
				value = $(previousSelectSelector).val();
			}		
			
			/*if (containerSelector.indexOf("Ablage") > -1)
			{
				LoadAblageById(value);
			}*/

			LoadMultiDropdown(options, containerSelector, value);
		});
	}

	function GetValueForNoSelection()
	{
		return -1;
	}

	function CreateOptionNoSelection()
	{
		return "<option value="+GetValueForNoSelection()+" selected=selected>keine Auswahl</option>";
	}

	function CreateOptionAblage(options, element)
	{
		if (options.Blacklist != undefined &&
			options.Blacklist != null)
		{
			for (var i = 0; i < options.Blacklist.length; i++)
			{
				if (element.Id == options.Blacklist[i])
					return "";
			}
		}
			
		var option = "<option ";
		if (options.SetOptionBackgroundImage != null)
			option += "style=\"background-image:url("+options.SetOptionBackgroundImage(element)+"\" ";
		option += "value=" + element.Id + ">";
		option += options.SetOptionText(element);
		option += "</option>";
		
		return option;
	}
	
})(jQuery);
