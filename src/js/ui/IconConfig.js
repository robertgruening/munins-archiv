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
			return "fas fa-chevron-circle-down";
		}

		return "fas fa-chevron-circle-right";
	}

	if (type == "Ablage")
	{
		if (state != undefined &&
			state == "open")
		{
			return "fas fa-box-open";
		}

		return "fas fa-box";
	}

	if (type == "Fund")
	{
		return "fas fa-puzzle-piece";
	}

	if (type == "FundAttribut")
	{
		return "fas fa-tag";
	}

	return "";
}