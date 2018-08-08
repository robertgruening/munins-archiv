//var _kartonschildIndex = 0;

$(document).ready(function() {
	_webServiceClientAblageType.Register("loadAll", new GuiClient(InitGrid));
	
	$("#navigation").Navigation();

    $("#messageBox").dialog({
        autoOpen: false,
        height: "auto",
        modal: true
    });

	$("#buttonCreateFund").attr("disabled",true);
	$("#buttonDelete").attr("disabled",true);
	
	//$("#buttonAddKarton").click(function() { AddAblageToKartonschildSeite(); });
	$("#textboxBezeichnung").keyup(function() { checkBezeichnung($(this)); })
	                        .change(function() { checkBezeichnung($(this)); });
	
	LoadSelectionType();
	
	if (GetURLParameter("Id"))
	{
	    $("#breadcrumb").Breadcrumb({
		    PageName : "AblageFormEdit"
		});
		
		LoadAblageById(GetURLParameter("Id"));
		
		$("#buttonCreateFund").click(function() { OpenPageNewFund(); });
		$("#buttonCreateFund").attr("disabled",false);
		
		$("#buttonDelete").attr("disabled",false);
		
		return;
	}

	$("#breadcrumb").Breadcrumb({
		PageName : "AblageFormNew"
	});
	
	SetAblageJSON();
	
	if (GetURLParameter("Parent_Id"))
	{
		$("#textboxParentId").val(GetURLParameter("Parent_Id"));
		LoadListParents();
		
		return;
	}
});

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

function selectTypen_onChange()
{
	ShowFormFieldBlocksByType();
}

function SetAblageType(typeBezeichnung)
{
	var typeId = $("#selectTypen option").filter(function () { return $(this).html() == "Raum"; }).val();

	if (typeBezeichnung != undefined &&
		typeBezeichnung != null)
	{
		typeId = $("#selectTypen option").filter(function () { return $(this).html() == typeBezeichnung; }).val();
	}
	
	$("#selectTypen").val(typeId);
	ShowFormFieldBlocksByType();
}

function ShowFormFieldBlocksByType()
{
	$("#divParent").hide();
	
	if ($("#selectTypen option:selected").text() == "Raum")
	{
	}
	else
	{
		$("#divParent").show();
	}
}

function SetFormTitle(title)
{
	document.title = title;
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
	return $("#textboxPath").val();
}

function SetAblagePath(path)
{
	$("#textboxPath").val(path);
}

function SetAblageParent(parent)
{
	$("#divParent #divList").empty();
	$("#divParent #divList").append("<ul></ul>");

	if (parent == undefined ||
		parent == null)
	{
		return;
	}

	$("#divParent #divList ul").append("<li><a href='../Ablage/Form.html?Id=" + parent.Id + "'>" + parent.Type.Bezeichnung + ": " + parent.Bezeichnung + "</a></li>");
}

function SetShortView(ablage)
{
	$("#shortView").AblageShortView({
		Element : ablage
	});
}

function LoadListChildren(children)
{
	$("#divAblagen #divList").empty();

	if (children == undefined ||
		children == null ||
		children.length == 0)
	{
		$("#divAblagen #divList").append("<label>keine</label>");
		return;
	}

	$("#divAblagen #divList").append("<ul></ul>");

	for (var i = 0; i < children.length; i++)
	{
		$("#divAblagen #divList ul").append("<li><a href='../Ablage/Form.html?Id=" + children[i].Id + "'>" + children[i].Type.Bezeichnung + ": " + children[i].Bezeichnung + "</a></li>");
	}
}

function LoadListFunde(funde)
{
	$("#divFunde #divList").empty();
	$("#divFunde #divList").append("<ul></ul>");

	for (var i = 0; i < funde.length; i++)
	{
		var listItemText = "";
		listItemText += funde[i].Anzahl.toString().replace("-", ">")+"x ";
		
		if (funde[i].FundAttribute != undefined &&
			funde[i].FundAttribute != null &&
			funde[i].FundAttribute.length > 0)
		{
			var material = null;
			var gegenstand = null;
			var erhaltung = null;
			
			for (var j = 0; j < funde[i].FundAttribute.length; j++)
			{
				if (funde[i].FundAttribute[j].Type.Bezeichnung == "Material")
					material = funde[i].FundAttribute[j];
				else if (funde[i].FundAttribute[j].Type.Bezeichnung == "Gegenstand")
					gegenstand = funde[i].FundAttribute[j];
				else if (funde[i].FundAttribute[j].Type.Bezeichnung == "Erhaltung")
					erhaltung = funde[i].FundAttribute[j];
					
				if (material != null &&
					gegenstand != null &&
					erhaltung != null)
					break;
			}
			if (material != null)
				listItemText += material.Bezeichnung + " ";
				
			if (gegenstand != null)
				listItemText += gegenstand.Bezeichnung + " ";
				
			if (erhaltung != null)
				listItemText += erhaltung.Bezeichnung + " ";
		}
		
		if (funde[i].Bezeichnung == null)
			listItemText += " ";
		else
			listItemText += ": \""+funde[i].Bezeichnung+"\" ";
		
		$("#divFunde #divList ul").append("<li><a href='../Fund/Form.html?Id=" + funde[i].Id + "'>" + listItemText + "</a></li>");
	}
}

function buttonNeu_onClick()
{
	OpenPageNewAblage();
}

function buttonSpeichern_onClick()
{	
	SaveAblage();	
}

function buttonDelete_onClick()
{
	if (!IsAblageSet())
	{
		return;
	}
	
	var dialog = "<div id=dialogDelete title='Ablage löschen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Möchten Sie die Ablage (" + _ablage.Id + ") wirklich löschen?</p>";
	dialog += "</div>";
	$("body").append(dialog);
	$("#dialogDelete").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Ja": function() {
				$(this).dialog("close");
				DeleteAblage();
				$("#dialogDelete").remove();
			},
			"Nein": function() {
				$(this).dialog("close");
				$("#dialogDelete").remove();
			}
		}
	});
}

function GetURLParameter(name)
{
	var url = window.location.search.substring(1);
	var parameters = url.split("&");

	for (var i = 0; i < parameters.length; i++)
	{
		var parameter = parameters[i].split("=");

		if (parameter[0] == name)
		{
			return parameter[1];
		}
	}
}

function ShowMessages(messages)
{
    $("#messageBox").empty();
    $("#messageBox").append(messages);
    $("#messageBox").dialog("open");
}

/*
function AddAblageToKartonschildSeite()
{
	var dialog = "<div id=dialogAddAblage title='Ablage hinzufügen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Bitte wählen Sie ein Ablagelement aus, das Sie hinzufügen möchten:</p>";
	dialog += "<div id=divAddAblage class=field></div>";
	dialog += "<input id=hiddenfieldAblageId type=hidden></input>"
	dialog += "</div>";
	$("body").append(dialog);
	LoadMultiDropdownAblageForKartonschild();
	$("#dialogAddAblage").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Hinzufügen": function() {
				$(this).dialog("close");
				LoadAblageByIdForKartonschild($("#hiddenfieldAblageId").val());
				$("#dialogAddAblage").remove();
			},
			"Abbrechen": function() {
				$(this).dialog("close");
				$("#dialogAddAblage").remove();
			}
		}
	});
}

function LoadMultiDropdownAblageForKartonschild()
{
	$("#divAddAblage").MultiDropdown(
	{
		UrlGetParents : "../Dienste/Ablage/GetWithParents/",
		UrlGetChildren : "../Dienste/Ablage/GetWithChildren/",
		SetOptionBackgroundImage : function(element)
		{		
			return "../images/system/Icon"+element.Typ.Bezeichnung.replace(" ","_")+"_16px.png";
		},
		SetOptionText : function(element)
		{
			if (element.FullBezeichnung == "")
			{
				return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
			}
				
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		SetSelectedElementId : function(elementId)
		{
			$("#hiddenfieldAblageId").val(elementId);
		}
	});
}

function LoadAblageByIdForKartonschild(id)
{
	if (id == undefined ||
		id == null ||
		id == GetValueForNoSelection())
	{
		//ClearFields();
		return;
	}
	
	$.ajax(
	{
		type:"POST",
		url:"../Dienste/Ablage/GetWithParents/" + id,
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{				
				var parents = $.parseJSON(data);
				var ablage = parents[0];
				var parent = null;
				
				while (ablage.Children != undefined &&
					ablage.Children.length > 0)
				{
					parent = ablage;
					ablage = ablage.Children[0];				
				}
				ablage.Parent = parent;
				LoadKontexteForKartonschild(ablage);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function LoadKontexteForKartonschild(ablage)
{	
	$.ajax(
	{
		type:"POST",
		url:"../Dienste/Kontext/Get/" + ablage.Id,
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{	
				var kontext = $.parseJSON(data)[0];
				LoadKontextMitParentsForKartonschild(ablage, kontext.Id);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function LoadKontextMitParentsForKartonschild(ablage, kontextId)
{	
	$.ajax(
	{
		type:"GET",
		url:"../Dienste/Kontext/GetWithParents/" + kontextId,
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{					
				var parents = $.parseJSON(data);
				var kontext = parents[0];
				var parent = null;
				
				while (kontext.Children != undefined &&
					kontext.Children.length > 0)
				{
					parent = kontext;
					kontext = kontext.Children[0];	
					kontext.Parent = parent;			
				}
				// Annahme:
				// Die Ablage ist mit einem Kontext der Zeit verbunden,
				// aber mit dem darüberliegenden Kontext des Ortes ist
				// der Ort verbunden.
				// Beispiel:
				// Karton ist verknüpft mit Begehung und
				// Ort ist verknüpft mit Begehungsfläche
				if (kontext.Typ.Bezeichnung == "Begehung")
				{
					LoadOrteForKartonschild(ablage, kontext.Parent);
				}
				else if (kontext.Typ.Bezeichnung == "Laufende Nummer")
				{
					LoadOrteForKartonschild(ablage, kontext.Parent.Parent);
				}
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function LoadOrteForKartonschild(ablage, kontext)
{	
	$.ajax(
	{
		type:"POST",
		url:"../Dienste/Ort/GetWithParents/" + ,
		data: {
			KontextId : kontext.Id
		},
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{	
				var ort = $.parseJSON(data)[0];
				LoadNewKartonForKartonschild(ablage, ort);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function LoadNewKartonForKartonschild(ablage, ort)
{
	$("#page").append(CreateNewKartonschild(_kartonschildIndex, ablage, ort));
	_kartonschildIndex++;
}

function CreateNewKartonschild(index, ablage, ort)
{
	var kartonschild = "<div class=kartonschild>";
	kartonschild += "<p class=labelKennung>Kennung</p>";
	kartonschild += "<p class=kennung>"+ablage.FullBezeichnung+"</p>";
	kartonschild += "<table>";
	kartonschild += GetOrtsTabelleForKartonschild(ort);
	kartonschild += "<table>";
	kartonschild += "<div>";
	
	return kartonschild;
}

function GetOrtsTabelleForKartonschild(ort)
{
	var zeile = "";
	zeile += "<tr>";
	zeile += "<td class=ortsTypBezeichnung>" + ort.Typ.Bezeichnung + "<td>";
	zeile += "<td class=ortsBezeichnung>" + ort.Bezeichnung + "<td>";
	zeile += "</tr>";
	
	if (ort.Children != undefined)
		zeile += GetOrtsTabelleForKartonschild(ort.Children[0]);
		
	return zeile;
}
*/
