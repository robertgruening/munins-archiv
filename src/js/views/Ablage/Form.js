$(document).ready(function() {	
	$("#textboxBezeichnung").on("input", UpdatePath);
});

function UpdatePath(e)
{
	var bezeichnung = GetAblageBezeichnung();
	var path = GetAblagePath();
	
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

	SetAblagePath(path);
}

function FillEditForm(node)
{
	SetAblageBezeichnung(node.Bezeichnung);
	SetAblageType(node.Type.Bezeichnung);
	SetAblagePath(node.Path);
	SetAblageCountOfChildren(node.Children);
	SetAblageCountOfFunde(node.Funde);
}

function FillSelectionAblageType(types)
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

	option += "style=\"background-image:url(../images/system/Icon"+type.Bezeichnung.replace(" ","_")+"_16px.png);background-repeat: no-repeat; padding-left: 20px;\" ";
	option += ">";
	option += type.Bezeichnung;
	option += "</option>";
	
	return option;
}

function SetAblageType(typeBezeichnung)
{
	var typeId = $("#selectTypen option").first().val();

	if (typeBezeichnung != undefined &&
		typeBezeichnung != null)
	{
		typeId = $("#selectTypen option").filter(function () { return $(this).html() == typeBezeichnung; }).val();
	}
	
	$("#selectTypen").val(typeId);
}

function GetAblageBezeichnung()
{
	return $("#textboxBezeichnung").val();
}

function SetAblageBezeichnung(bezeichnung)
{
	$("#textboxBezeichnung").val(bezeichnung);
}

function GetAblageTypeId()
{
	return $("#selectTypen option:selected").val();
}

function GetAblagePath()
{
	if ($("#labelPath").text().length >= 1)
	{
		return $("#labelPath").text().substr(1);
	}

	return "";
}

function SetAblagePath(path)
{
	$("#labelPath").text("/" + path);
}

function SetAblageCountOfChildren(children)
{
	$("#divAblagen #labelCountOfChildren").text(children.length);
}

function SetAblageCountOfFunde(funde)
{
	$("#divFunde #labelCountOfFunde").text(funde.length);
}