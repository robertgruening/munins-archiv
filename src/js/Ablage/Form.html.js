var _selectorMultiDropdownParent = "#divParentSelections";
var _selectorTextboxParentId = "#textboxParentId";
var _selectorMultiDropdownAblage = "#divAblageSelections";
var _selectorTextboxAblageId = "#textboxId";
//var _kartonschildIndex = 0;

$(document).ready(function() {
	$("#navigation").Navigation();
	$("#breadcrumb").Breadcrumb({
		PageName : "AblageForm"
	});

	$("#textboxId").attr("disabled",true);
	$(_selectorTextboxParentId).attr("disabled",true);
	$("#buttonAddChild").attr("disabled",true);
	$("#buttonAddFund").attr("disabled",true);
	
	$("#buttonSetParent").click(function() { SetParent(); });
	$("#buttonAddKontext").click(function() { AddKontext(); });
	//$("#buttonAddKarton").click(function() { AddAblageToKartonschildSeite(); });
	$("#textboxBezeichnung").keyup(function() { checkBezeichnung($(this)); })
	                        .change(function() { checkBezeichnung($(this)); });
	
	LoadSelectionTyp();
	LoadListRootAblagen();
	
	if (GetURLParameter("Id"))
	{
		LoadAblageById(GetURLParameter("Id"));
		
		$("#buttonAddChild").click(function() { AddChild(GetURLParameter("Id")); });
		$("#buttonAddChild").attr("disabled",false);
		
		$("#buttonAddFund").click(function() { AddFund(GetURLParameter("Id")); });
		$("#buttonAddFund").attr("disabled",false);
		
		return;
	}
	
	ClearFields();
	
	if (GetURLParameter("Parent_Id"))
	{
		$(_selectorTextboxParentId).val(GetURLParameter("Parent_Id"));
		LoadListParents();
		
		return;
	}
});

function selectTypen_onChange()
{
	SelectTypId($("#selectTypen option:selected").val());
}

function SelectTypId(typId)
{
	if (typId == undefined ||
		typId == null)
	{
		typId = $("#selectTypen option").filter(function () { return $(this).html() == "Raum"; }).val();
	}
	
	$("#selectTypen").val(typId);
	ShowFormFieldBlocksByTyp();
}

function ShowFormFieldBlocksByTyp()
{	
	/*
	$("#divParent").hide();
	
	if ($("#selectTypen option:selected").text() == "Raum")
	{
	}
	else
	{
		$("#divParent").show();
	}
	*/
}

function buttonNeu_onClick()
{
	ClearFields();
}

function ClearFields()
{
	$("#textboxId").val("");
	SelectTypId();
	$("#textboxBezeichnung").val("");
	$(_selectorTextboxParentId).val("");
	setTimeout(LoadListParents(), 1000);
	setTimeout(LoadListChildren(), 1000);
	setTimeout(LoadListKontexte(), 1000);
	setTimeout(LoadListFunde(), 1000);
	
	document.title = "Ablage";
}

function GetAblageJSON()
{	
	var ablage = {
		"Id" : $("#textboxId").val(),
		"Bezeichnung" : $("#textboxBezeichnung").val(),
		"AblageTyp_Id" : $("#selectTypen option:selected").val(),
		"Parent_Id" : $(_selectorTextboxParentId).val() == "" ? null : $(_selectorTextboxParentId).val()
	};
	
	return ablage;
}

function SetAblageJSON(ablage)
{
	$("#textboxId").val(ablage.Id);
	$("#textboxBezeichnung").val(ablage.Bezeichnung);
	SelectTypId(ablage.Typ.Id);
	LoadListChildren(ablage.Id);
	LoadListKontexte(ablage.Id);
	LoadListFunde(ablage.Id);
	
	if (ablage.Parent)
		$(_selectorTextboxParentId).val(ablage.Parent.Id);

	LoadListParents();
		
	document.title = "("+ablage.Id+") "+ablage.Typ.Bezeichnung+": "+ablage.Bezeichnung;
}

function SetShortView(ablage)
{
	$("#shortView").AblageShortView({
		Element : ablage
	});
}

function buttonSpeichern_onClick()
{	
	SaveAblage();	
}

function SaveAblage()
{
	if ($("#textboxId").val() == GetValueForNoSelection())
	{
		return;
	}
	
	$.ajax(
	{
		type:"POST",
		url:"../Dienste/Ablage/Save",
		data: {
			"Ablage" : JSON.stringify(GetAblageJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			var message = $.parseJSON(data);
			alert(message.Message);
			LoadListRootAblagen();
			
			if (message.ElementId)
				LoadAblageById(message.ElementId);
		}
	});
}

function LoadListParents()
{		
	$("#divParent #divList").empty();

	if($(_selectorTextboxParentId).val() == undefined ||
		$(_selectorTextboxParentId).val() == "")
	{
		return;
	}

	$("#divParent #divList").List(
	{
		UrlGetElements : "../Dienste/Ablage/GetWithParents/" + $(_selectorTextboxParentId).val() + "/AsList",
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "../Ablage/Form.html"
	});
}

function LoadListChildren(ablageId)
{		
	$("#divAblagen #divList").empty();

	if(ablageId == undefined)
	{
		return;
	}

	$("#divAblagen #divList").List(
	{
		UrlGetElements : "../Dienste/Ablage/GetWithChildren/" + ablageId,
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "../Ablage/Form.html"
	});
}

function AddChild(ablageId)
{
	window.open("../Ablage/Form.html?Parent_Id=" + ablageId);
}

function AddFund(ablageId)
{
	window.open("../Fund/Form.html?Ablage_Id=" + ablageId);
}

function LoadListKontexte(ablageId)
{		
	$("#divKontexte #divList").empty();

	if(ablageId == undefined)
	{
		return;
	}

	$("#divKontexte #divList").List(
	{
		UrlGetElements : "../Dienste/Kontext/Get/Ablage/" + ablageId,
		SetListItemText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
				
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		ListItemLink : "../Kontext/Form.html"
	});
}

function LoadListFunde(ablageId)
{	
	$("#divFunde #divList").empty();

	if (ablageId == undefined)
	{
		return;
	}

	$("#divFunde #divList").List(
	{
		UrlGetElements : "../Dienste/Fund/Get/Ablage/" + ablageId,
		SetListItemText : function(element)
		{
			var listItemText = "";
			listItemText += element.Anzahl.toString().replace("-", ">")+"x ";
			
			if (element.Attribute != undefined &&
				element.Attribute != null &&
				element.Attribute.length > 0)
			{
				var material = null;
				var gegenstand = null;
				var erhaltung = null;
				
				for (var i = 0; i < element.Attribute.length; i++)
				{
					if (element.Attribute[i].Typ.Bezeichnung == "Material")
						material = element.Attribute[i];
					else if (element.Attribute[i].Typ.Bezeichnung == "Gegenstand")
						gegenstand = element.Attribute[i];
					else if (element.Attribute[i].Typ.Bezeichnung == "Erhaltung")
						erhaltung = element.Attribute[i];
						
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
			
			if (element.Bezeichnung == null)
				listItemText += " ";
			else
				listItemText += ": \""+element.Bezeichnung+"\" ";
			
			listItemText += "("+element.Id+")";
			
			return listItemText;
		},
		ListItemLink : "../Fund/Form.html"
	});
}

function LoadListRootAblagen()
{		
	$("#divRootAblagen #divList").empty();

	$("#divRootAblagen #divList").List(
	{
		UrlGetElements : "../Dienste/Ablage/GetWithChildren",
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "../Ablage/Form.html"
	});
}

function SetParent()
{	
	var dialog = "<div id=dialogSetParent title='Übergeordnete Ablage auswählen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Bitte wählen Sie eine Ablage aus, unter die Sie die neue Ablage hinzufügen möchten:</p>";
	dialog += "<div id=divSetParent class=field></div>";
	dialog += "<input id=hiddenfieldParentId type=hidden></input>"
	dialog += "</div>";
	$("body").append(dialog);
	LoadMultiDropdownParent();
	$("#dialogSetParent").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Auswählen": function() {
				$(this).dialog("close");
				$(_selectorTextboxParentId).val($("#hiddenfieldParentId").val());
				$("#dialogSetParent").remove();
				LoadListParents();
			},
			"Abbrechen": function() {
				$(this).dialog("close");
				$("#dialogSetParent").remove();
			}
		}
	});
}

function LoadMultiDropdownParent()
{
	$("#divSetParent").MultiDropdown(
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
			$("#hiddenfieldParentId").val(elementId);
		}
	});
}

function buttonDelete_onClick()
{
	if ($("#textboxId").val() == GetValueForNoSelection())
	{
		return;
	}
	
	var dialog = "<div id=dialogDelete title='Ablage löschen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Möchten Sie die Ablage ("+$("#textboxId").val()+") wirklich löschen?</p>";
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

function DeleteAblage()
{
	$.ajax(
	{
		type:"GET",
		url:"../Dienste/Ablage/Delete/" + GetAblageJSON().Id,
		success:function(data, textStatus, jqXHR)
		{
			alert(data);
			ClearFields();
			LoadListRootAblagen();
		}
	});
}

function LoadSelectionTyp()
{
	$.ajax(
	{
		type:"GET",
		url:"../Dienste/Ablage/Typ/Get/",
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
				var typen = $.parseJSON(data);
				var options = "";

				for (var i = 0; i < typen.length; i++)
				{
					if (i == 0)
					{
						options += CreateOptionTyp(typen[i], true);
					}
					else
					{
						options += CreateOptionTyp(typen[i], false);
					}
				}

				$("#selectTypen").html(options);
				SelectTypId();
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function CreateOptionTyp(typ, select)
{
	var option = "<option value=" + typ.Id + " ";

	if (select == true)
	{
		option += "selected=selected ";
	}

	option += "style=\"background-image:url(../images/system/Icon"+typ.Bezeichnung.replace(" ","_")+"_16px.png);background-repeat: no-repeat; padding-left: 20px;\" ";
	option += ">";
	option += typ.Bezeichnung;
	option += "</option>";
	
	return option;
}

function LoadAblageById(id)
{
	if (id == undefined ||
		id == null ||
		id == GetValueForNoSelection())
	{
		ClearFields();
		return;
	}
	
	$.ajax(
	{
		type:"GET",
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
				SetAblageJSON(ablage);
				SetShortView(ablage);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
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

function GetCurrentElementId()
{
	return $("#textboxId").val();
}

function AddKontext()
{
	var dialog = "<div id=dialogAddKontext title='Kontext hinzufügen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Bitte wählen Sie ein Kontextelement aus, das Sie hinzufügen möchten:</p>";
	dialog += "<div id=divAddKontext class=field></div>";
	dialog += "<input id=hiddenfieldKontextId type=hidden></input>"
	dialog += "</div>";
	$("body").append(dialog);
	LoadMultiDropdownKontext();
	$("#dialogAddKontext").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Hinzufügen": function() {
				$(this).dialog("close");
				SaveAssociationWithKontext($("#hiddenfieldKontextId").val());
				$("#dialogAddKontext").remove();
			},
			"Abbrechen": function() {
				$(this).dialog("close");
				$("#dialogAddKontext").remove();
			}
		}
	});
}

function LoadMultiDropdownKontext()
{
	$("#divAddKontext").MultiDropdown(
	{
		UrlGetParents : "../Dienste/Kontext/GetWithParents/",
		UrlGetChildren : "../Dienste/Kontext/GetWithChildren/",
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
			$("#hiddenfieldKontextId").val(elementId);
		}
	});
}

function SaveAssociationWithKontext(kontextId)
{
	$.ajax(
	{
		type:"POST",
		url:"../Dienste/Ablage/Link/" + GetCurrentElementId() + "/Kontext/" + kontextId,
		success:function(data, textStatus, jqXHR)
		{
			LoadListKontexte(GetCurrentElementId());
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function GetValueForNoSelection()
{
	return -1;
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
