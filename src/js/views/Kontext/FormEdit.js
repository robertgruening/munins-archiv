$(document).ready(function() {
	_webServiceClientKontextType.Register("loadAll", new GuiClient(FillSelectionKontextType));
		
	$("#textboxBezeichnung").on("input", UpdatePath);
});

function UpdatePath(e)
{
	var bezeichnung = GetKontextBezeichnung();
	var path = GetKontextPath();
	
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

	SetKontextPath(path);
}

function FillEditForm(node)
{
	SetKontextBezeichnung(node.Bezeichnung);
	SetKontextType(node.Type.Bezeichnung);
	SetKontextPath(node.Path);
	SetKontextCountOfChildren(node.Children);
	SetKontextCountOfFunde(node.Funde);
}

function FillSelectionKontextType(types)
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

	$("#selectTypes").html(options);
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

function SetKontextType(typeBezeichnung)
{
	var typeId = $("#selectTypes option").first().val();

	if (typeBezeichnung != undefined &&
		typeBezeichnung != null)
	{
		typeId = $("#selectTypes option").filter(function () { return $(this).html() == typeBezeichnung; }).val();
	}
	
	$("#selectTypes").val(typeId);
}

function GetKontextBezeichnung()
{
	return $("#textboxBezeichnung").val();
}

function SetKontextBezeichnung(bezeichnung)
{
	$("#textboxBezeichnung").val(bezeichnung);
}

function GetKontextTypeId()
{
	return $("#selectTypes option:selected").val();
}

function GetKontextPath()
{
	if ($("#labelPath").text().length >= 1)
	{
		return $("#labelPath").text().substr(1);
	}

	return "";
}

function SetKontextPath(path)
{
	$("#labelPath").text("/" + path);
}

function SetKontextCountOfChildren(children)
{
	$("#divChildren #labelCountOfChildren").text(children.length);
}

function SetKontextCountOfFunde(funde)
{
	$("#divFunde #labelCountOfFunde").text(funde.length);
}