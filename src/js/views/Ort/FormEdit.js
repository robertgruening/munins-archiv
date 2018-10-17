$(document).ready(function() {
	_webServiceClientOrtType.Register("loadAll", new GuiClient(FillSelectionOrtType));
		
	$("#textboxBezeichnung").on("input", UpdatePath);
});

function UpdatePath(e)
{
	var bezeichnung = GetOrtBezeichnung();
	var path = GetOrtPath();
	
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

	SetOrtPath(path);
}

function FillEditForm(node)
{
	SetOrtBezeichnung(node.Bezeichnung);
	SetOrtType(node.Type.Bezeichnung);
	SetOrtPath(node.Path);
	SetOrtCountOfChildren(node.Children);
	SetOrtCountOfKontexte(node.CountOfKontexte);
}

function FillSelectionOrtType(types)
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

function SetOrtType(typeBezeichnung)
{
	var typeId = $("#selectTypen option").first().val();

	if (typeBezeichnung != undefined &&
		typeBezeichnung != null)
	{
		typeId = $("#selectTypen option").filter(function () { return $(this).html() == typeBezeichnung; }).val();
	}
	
	$("#selectTypen").val(typeId);
}

function GetOrtBezeichnung()
{
	return $("#textboxBezeichnung").val();
}

function SetOrtBezeichnung(bezeichnung)
{
	$("#textboxBezeichnung").val(bezeichnung);
}

function GetOrtTypeId()
{
	return $("#selectTypen option:selected").val();
}

function GetOrtPath()
{
	if ($("#labelPath").text().length >= 1)
	{
		return $("#labelPath").text().substr(1);
	}

	return "";
}

function SetOrtPath(path)
{
	$("#labelPath").text("/" + path);
}

function SetOrtCountOfChildren(children)
{
	$("#divChildren #labelCountOfChildren").text(children.length);
}

function SetOrtCountOfKontexte(countOfKontexte)
{
	$("#divFunde #labelCountOfKontexte").text(countOfKontexte);
}