var _selectorMultiDropdownParent = "#divParentSelections";
var _selectorTextboxParentId = "#textboxParentId";

var _selectorMultiDropdownOrt = "#divOrtSelections";
var _selectorTextboxOrtId = "#textboxId";

$(document).ready(function() {
	$("#textboxId").attr("disabled",true);
	$(_selectorTextboxParentId).attr("disabled",true);
	
	$("#buttonSetParent").click(function() { SetParent(); });
	$("#buttonAddTeil").click(function() { AddTeil(); });
	$("#buttonAddKontext").click(function() { AddKontext(); });
	
	LoadSelectionTyp();
	LoadListRootOrte();
	
	if (GetURLParameter("Id"))
		LoadOrtById(GetURLParameter("Id"));
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
		typId = $("#selectTypen option").filter(function () { return $(this).html() == "Landkreis"; }).val();
	}
	
	$("#selectTypen").val(typId);				
	ShowFormFieldBlocksByTyp();
}

function ShowFormFieldBlocksByTyp()
{	
	$("#divParent").hide();
	
	if ($("#selectTypen option:selected").text() == "Landkreis")
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
	setTimeout(LoadListParents(), 1000);
	setTimeout(LoadListChildren(), 1000);
	setTimeout(LoadListKontexte(), 1000);
	
	document.title = "Ort";
}

function GetOrtJSON()
{
	var ort = {
		"Id" : $("#textboxId").val(),
		"Bezeichnung" : $("#textboxBezeichnung").val(),
		"OrtTyp_Id" : $("#selectTypen option:selected").val(),
		"Parent_Id" : $(_selectorTextboxParentId).val() == "" ? null : $(_selectorTextboxParentId).val()
	};
	
	return ort;
}

function SetOrtJSON(ort)
{
	$("#textboxId").val(ort.Id);
	$("#textboxBezeichnung").val(ort.Bezeichnung);
	SelectTypId(ort.Typ.Id);
	LoadListChildren(ort.Id);
	LoadListKontexte(ort.Id);
	LoadListTeile(ort.Id);
	
	if (ort.Parent)
		$(_selectorTextboxParentId).val(ort.Parent.Id);

	LoadListParents();
		
	document.title = "("+ort.Id+") "+ort.Typ.Bezeichnung+": "+ort.Bezeichnung;
}

function buttonSpeichern_onClick()
{	
	SaveOrt();	
}

function SaveOrt()
{
	if ($("#textboxId").val() == GetValueForNoSelection())
	{
		return;
	}
	
	$.ajax(
	{
		type:"POST",
		url:"Dienste/SaveOrt.php",
		data: {
			"Ort" : JSON.stringify(GetOrtJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			alert(data);
			LoadListRootOrte();
		}
	});
}

function LoadListParents()
{	
	var data = null;
	
	if ($("#textboxParentId").val() != undefined &&
		$("#textboxParentId").val() != "")
	{	
		data = { 
			Id : $("#textboxParentId").val(), 
			ReturnDataStructure : "list"
		};
	}
		
	$("#divParent #divList").List(
	{
		UrlGetElements : "Dienste/GetOrtMitParents.php",
		Data : data,
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "Ort.html"
	});
}

function LoadListChildren(ortId)
{
	var data = null;
	
	if (ortId != undefined &&
		ortId != null)
	{
		data = { Id : ortId };
	}
	
	$("#divOrte #divList").List(
	{
		UrlGetElements : "Dienste/GetOrtChildren.php",
		Data : data,
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "Ort.html"
	});
}

function LoadListKontexte(ortId)
{
	var data = null;
	
	if (ortId != undefined &&
		ortId != null)
	{
		data = { OrtId : ortId };
	}
	
	$("#divKontexte #divList").List(
	{
		UrlGetElements : "Dienste/GetKontext.php",
		UrlDeleteAssociation : "Dienste/DeleteAssociation.php",
		SetData : function(kontextId)
		{
			return data = { OrtId : ortId,
							KontextId : kontextId };
		},
		Data : data,
		SetListItemText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
				
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		ListItemLink : "Kontext.html",
		IsDeletable : true
	});
}

function LoadListTeile(ortId)
{
	var data = null;
	
	if (ortId != undefined &&
		ortId != null)
	{
		data = { Id : ortId };
	}
	
	$("#divTeile #divList").List(
	{
		UrlGetElements : "Dienste/GetOrtTeile.php",
		UrlDeleteAssociation : "Dienste/DeleteAssociation.php",
		SetData : function(ort_B_Id)
		{
			return data = { OrtAId : ortId,
							OrtBId : ort_B_Id};
		},
		Data : data,
		SetListItemText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Bezeichnung+" ("+element.Id+")";
				
			return element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		ListItemLink : "Ort.html",
		IsDeletable : true
	});
}

function LoadListRootOrte()
{	
	$("#divRootOrte #divList").List(
	{
		UrlGetElements : "Dienste/GetOrtChildren.php",
		Data : { Id : null },
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "Ort.html"
	});
}

function SetParent()
{	
	var dialog = "<div id=dialogSetParent title='Übergeordneten Ort auswählen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Bitte wählen Sie einen Ort aus, unter den Sie den neuen Ort hinzufügen möchten:</p>";
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
		UrlGetParents : "Dienste/GetOrtMitParents.php",
		UrlGetChildren : "Dienste/GetOrtChildren.php",
		//SelectedElementId : null,
		//Blacklist : [],
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
	
	var dialog = "<div id=dialogDelete title='Ort löschen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Möchten Sie der Ort ("+$("#textboxId").val()+") wirklich löschen?</p>";
	dialog += "</div>";
	$("body").append(dialog);
	$("#dialogDelete").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Ja": function() {
				$(this).dialog("close");
				DeleteOrt();
				$("#dialogDelete").remove();
			},
			"Nein": function() {
				$(this).dialog("close");
				$("#dialogDelete").remove();
			}
		}
	});
}

function DeleteOrt()
{
	$.ajax(
	{
		type:"POST",
		url:"Dienste/DeleteOrt.php",
		data: {
			"Ort" : JSON.stringify(GetOrtJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			alert(data);
			ClearFields();
			LoadListRootOrte();
		}
	});
}

function LoadSelectionTyp()
{
	$.ajax(
	{
		type:"POST",
		url:"Dienste/GetOrtTyp.php",
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

function LoadOrtById(id)
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
		url:"Dienste/GetOrtMitParents.php",
		data: {
			Id : id
		},
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{				
				var parents = $.parseJSON(data);
				var ort = parents[0];
				var parent = null;
				
				while (ort.Children != undefined &&
					ort.Children.length > 0)
				{
					parent = ort;
					ort = ort.Children[0];				
				}
				ort.Parent = parent;
				SetOrtJSON(ort);
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
			OrtId : GetCurrentElementId(),
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

function AddTeil()
{
	var dialog = "<div id=dialogAddTeil title='Teil hinzufügen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Bitte wählen Sie ein Ortelement aus, das Sie hinzufügen möchten:</p>";
	dialog += "<div id=divAddTeil class=field></div>";
	dialog += "<input id=hiddenfieldTeilId type=hidden></input>"
	dialog += "</div>";
	$("body").append(dialog);
	LoadMultiDropdownTeil();
	$("#dialogAddTeil").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Hinzufügen": function() {
				$(this).dialog("close");
				SaveAssociationWithTeil($("#hiddenfieldTeilId").val());
				$("#dialogAddTeil").remove();
			},
			"Abbrechen": function() {
				$(this).dialog("close");
				$("#dialogAddTeil").remove();
			}
		}
	});
}

function LoadMultiDropdownTeil()
{
	$("#divAddTeil").MultiDropdown(
	{
		UrlGetParents : "Dienste/GetOrtMitParents.php",
		UrlGetChildren : "Dienste/GetOrtChildren.php",
		//SelectedElementId : null,
		SetOptionText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
			
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		SetSelectedElementId : function(elementId)
		{
			$("#hiddenfieldTeilId").val(elementId);
		}
	});
}

function SaveAssociationWithTeil(ortId)
{
	$.ajax(
	{
		type:"POST",
		url:"Dienste/SaveAssociation.php",
		data: {
			OrtAId : GetCurrentElementId(),
			OrtBId : ortId
		},
		success:function(data, textStatus, jqXHR)
		{
			LoadListTeile(GetCurrentElementId());
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
