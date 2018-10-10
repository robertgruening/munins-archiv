function IconConfig()
{
}

IconConfig.getCssClasses = function(type, state)
{
	if (type == undefined)
	{
		return "";
	}

	if (type == "Root")
	{
		if (state != undefined &&
			state == "open")
		{
			return "fas fa-chevron-circle-down root";
		}

		return "fas fa-chevron-circle-right root";
	}

	if (type == "Ablage")
	{
		if (state != undefined &&
			state == "open")
		{
			return "fas fa-box-open node";
		}

		return "fas fa-box node";
	}

	if (type == "Fund")
	{
		return "fas fa-puzzle-piece leaf";
	}

	return "";
}