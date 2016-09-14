var _selectorMultiDropdownParent = "#divParentSelections";
var _selectorTextboxParentId = "#textboxParentId";

var _selectorMultiDropdownAblage = "#divAblageSelections";
var _selectorTextboxAblageId = "#textboxId";

$(document).ready(function() {
	$("#textboxId").attr("disabled",true);
	$(_selectorTextboxParentId).attr("disabled",true);
	
	$("#buttonAddKontext").click(function() { AddKontext(); });
	
	LoadSelectionTyp();
	LoadListRootAblagen();
	
	if (GetURLParameter("Id"))
		LoadAblageById(GetURLParameter("Id"));
	else
		ClearFields();
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
	$("#divParent").hide();
	
	if ($("#selectTypen option:selected").text() == "Raum")
	{
	}
	else
	{
		$("#divParent").show();
	}
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
	LoadMultiDropdownParent(null);
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
	
	if (ablage.Parent == undefined ||
		ablage.Parent == null)
	{
		LoadMultiDropdownParent(null);
	}
	else
	{
		LoadMultiDropdownParent(ablage);
	}
		
	document.title = "("+ablage.Id+") "+ablage.Typ.Bezeichnung+": "+ablage.Bezeichnung;
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
		url:"Dienste/SaveAblage.php",
		data: {
			"Ablage" : JSON.stringify(GetAblageJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			alert(data);
			LoadListRootAblagen();
		}
	});
}

function LoadListChildren(ablageId)
{
	var data = null;
	
	if (ablageId != undefined &&
		ablageId != null)
	{
		data = { Id : ablageId };
	}
	
	$("#divAblagen #divList").List(
	{
		UrlGetElements : "Dienste/GetAblageChildren.php",
		Data : data,
		SetListItemText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
			
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		ListItemLink : "Ablage.html"
	});
}

function LoadListKontexte(ablageId)
{
	var data = null;
	
	if (ablageId != undefined &&
		ablageId != null)
	{
		data = { AblageId : ablageId };
	}
	
	$("#divKontexte #divList").List(
	{
		UrlGetElements : "Dienste/GetKontext.php",
		Data : data,
		SetListItemText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
				
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		ListItemLink : "Kontext.html"
	});
}

function LoadListFunde(ablageId)
{
	var data = null;
	
	if (ablageId != undefined &&
		ablageId != null)
	{
		data = { AblageId : ablageId };
	}
	
	$("#divFunde #divList").List(
	{
		UrlGetElements : "Dienste/GetFund.php",
		Data : data,
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
		ListItemLink : "Fund.html"
	});
}

function LoadListRootAblagen()
{	
	$("#divRootAblagen #divList").List(
	{
		UrlGetElements : "Dienste/GetAblageChildren.php",
		Data : { Id : null },
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "Ablage.html"
	});
}

function LoadMultiDropdownParent(ablage)
{
	$(_selectorMultiDropdownParent).MultiDropdown(
	{
		UrlGetParents : "Dienste/GetAblageMitParents.php",
		UrlGetChildren : "Dienste/GetAblageChildren.php",
		SelectedElementId : ablage.Parent.Id,
		Blacklist : [ablage.Id],
		SetOptionBackgroundImage : function(element)
		{		
			return "images/system/Icon"+element.Typ.Bezeichnung.replace(" ","_")+"_16px.png";
		},
		SetOptionText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
				
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		SetSelectedElementId : function(elementId)
		{
			$(_selectorTextboxParentId).val(elementId);
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
		type:"POST",
		url:"Dienste/DeleteAblage.php",
		data: {
			"Ablage" : JSON.stringify(GetAblageJSON())
		},
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
		type:"POST",
		url:"Dienste/GetAblageTyp.php",
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
				var typen = $.parseJSON(data);
				var options = "";
				for (var i = 0; i < typen.length; i++)
				{
					if (i == 0)
						options += CreateOptionTyp(typen[i], true);
					else
						options += CreateOptionTyp(typen[i], false);
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
		option += "selected=selected ";
	option += "style=\"background-image:url(images/system/Icon"+typ.Bezeichnung.replace(" ","_")+"_16px.png);background-repeat: no-repeat; padding-left: 20px;\" ";
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
		type:"POST",
		url:"Dienste/GetAblageMitParents.php",
		data: {
			Id : id
		},
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
		UrlGetParents : "Dienste/GetKontextMitParents.php",
		UrlGetChildren : "Dienste/GetKontextChildren.php",
		//SelectedElementId : null,
		SetOptionBackgroundImage : function(element)
		{		
			return "images/system/Icon"+element.Typ.Bezeichnung.replace(" ","_")+"_16px.png";
		},
		SetOptionText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
			
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
		url:"Dienste/SaveAssociation.php",
		data: {
			AblageId : GetCurrentElementId(),
			KontextId : kontextId
		},
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
