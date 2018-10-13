$(document).ready(function() {
	_webServiceClientFundAttributType.Register("loadAll", new GuiClient(FillSelectionFundAttributType));
		
	$("#textboxBezeichnung").on("input", UpdatePath);
});

function UpdatePath(e)
{
	var bezeichnung = GetFundAttributBezeichnung();
	var path = GetFundAttributPath();
	
	var lastSlashIndex = path.lastIndexOf("/");

	if (lastSlashIndex == -1)
	{
		path = bezeichnung;
	}
	else
	{
		path = path.substr(0, lastSlashIndex);
		path += "/" + bezeichnung;
	}

	SetFundAttributPath(path);
}

function FillEditForm(node)
{
	SetFundAttributBezeichnung(node.Bezeichnung);
	SetFundAttributType(node.Type.Bezeichnung);
	SetFundAttributPath(node.Path);
	SetFundAttributCountOfChildren(node.Children);
	SetFundAttributCountOfFunde(node.CountOfFunde);
}

function FillSelectionFundAttributType(types)
{
	var options = "";

	for (var i = 0; i < types.length; i++)
	{
		if (i == 0)
		{
			options += CreateOptionType(types[i], true);
		}
		else
		{
			options += CreateOptionType(types[i], false);
		}
	}

	$("#selectTypen").html(options);
}

function CreateOptionType(type, select)
{
	var option = "<option value=" + type.Id + " ";

	if (select == true)
	{
		option += "selected=selected ";
	}

	option += ">";
	option += type.Bezeichnung;
	option += "</option>";
	
	return option;
}

function SetFundAttributType(typeBezeichnung)
{
	var typeId = $("#selectTypen option").first().val();

	if (typeBezeichnung != undefined &&
		typeBezeichnung != null)
	{
		typeId = $("#selectTypen option").filter(function () { return $(this).html() == typeBezeichnung; }).val();
	}
	
	$("#selectTypen").val(typeId);
}

function GetFundAttributBezeichnung()
{
	return $("#textboxBezeichnung").val();
}

function SetFundAttributBezeichnung(bezeichnung)
{
	$("#textboxBezeichnung").val(bezeichnung);
}

function GetFundAttributTypeId()
{
	return $("#selectTypen option:selected").val();
}

function GetFundAttributPath()
{
	if ($("#labelPath").text().length >= 1)
	{
		return $("#labelPath").text().substr(1);
	}

	return "";
}

function SetFundAttributPath(path)
{
	$("#labelPath").text("/" + path);
}

function SetFundAttributCountOfChildren(children)
{
	$("#divChildren #labelCountOfChildren").text(children.length);
}

function SetFundAttributCountOfFunde(countOfFunde)
{
	$("#divFunde #labelCountOfFunde").text(countOfFunde);
}