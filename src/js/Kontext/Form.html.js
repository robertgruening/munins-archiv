var _selectorMultiDropdownParent = "#divParentSelections";
var _selectorTextboxParentId = "#textboxParentId";
var _selectorMultiDropdownKontext = "#divKontextSelections";
var _selectorTextboxKontextId = "#textboxId";

$(document).ready(function() {
	$("#navigation").Navigation();
	
	if (GetURLParameter("Id"))
	{
	    $("#breadcrumb").Breadcrumb({
		    PageName : "KontextFormEdit"
	    });
	}
	else
	{
	    $("#breadcrumb").Breadcrumb({
		    PageName : "KontextFormNew"
	    });
	}

	$("#textboxId").attr("disabled",true);
	$(_selectorTextboxParentId).attr("disabled",true);
	$("#buttonAddChild").attr("disabled",true);
	$("#buttonAddFund").attr("disabled",true);
	
	$("#buttonSetParent").click(function() { SetParent(); });
	$("#buttonAddAblage").click(function() { AddAblage(); });
	$("#buttonAddLfD").click(function() { AddLfD(); });
	$("#buttonAddOrt").click(function() { AddOrt(); });
	$("#textboxBezeichnung").keyup(function() { checkBezeichnung($(this)); })
	                        .change(function() { checkBezeichnung($(this)); });
	
	LoadSelectionType();
	LoadListRootKontexte();
	
	if (GetURLParameter("Id"))
	{
		LoadKontextById(GetURLParameter("Id"));
		
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

function selectTypes_onChange()
{
	SelectTypeId($("#selectTypes option:selected").val());
}

function SelectTypeId(typeId)
{
	if (typeId == undefined ||
		typeId == null)
	{
		typeId = $("#selectTypes option").filter(function () { return $(this).html() == "Raum"; }).val();
	}
	
	$("#selectTypes").val(typeId);				
	ShowFormFieldBlocksByType();
}

function ShowFormFieldBlocksByType()
{	
	$("#divParent").hide();
	$("#divBegehungLfDErfassungsJahr").hide();
	$("#divBegehungLfDErfassungsNr").hide();
	$("#divBegehungDatum").hide();
	$("#divBegehungKommentar").hide();
	$("#divLfDs").hide();
	$("#divOrte").hide();
	$("#divAblagen").hide();
	$("#divFunde").hide();
	
	if ($("#selectTypes option:selected").text() == "Fundstelle")
	{
	}
	else if ($("#selectTypes option:selected").text() == "Begehungsfläche")
	{
		$("#divParent").show();
		$("#divLfDs").show();
		$("#divOrte").show();
	}
	else if ($("#selectTypes option:selected").text() == "Begehung")
	{
		$("#divParent").show();
		$("#divBegehungLfDErfassungsJahr").show();
		$("#divBegehungLfDErfassungsNr").show();
		$("#divBegehungDatum").show();
		$("#divBegehungKommentar").show();
		$("#divLfDs").show();
		$("#divAblagen").show();
		$("#divFunde").show();
	}
	else if ($("#selectTypes option:selected").text() == "Grabung")
	{
		$("#divParent").show();
	}
	else if ($("#selectTypes option:selected").text() == "Fläche")
	{
		$("#divParent").show();
		$("#divOrte").show();
		$("#divAblagen").show();
		$("#divFunde").show();
	}
	else if ($("#selectTypes option:selected").text() == "Befund")
	{
		$("#divParent").show();
		$("#divAblagen").show();
		$("#divFunde").show();
	}
	else if ($("#selectTypes option:selected").text() == "Laufende Nummer")
	{
		$("#divParent").show();
		$("#divAblagen").show();
		$("#divFunde").show();
	}
}

function buttonNeu_onClick()
{
	ClearFields();
}

function ClearFields()
{
	$("#textboxId").val("");
	SelectTypeId();
	$("#textboxBezeichnung").val("");
	$("#textboxBegehungLfDErfassungsJahr").val("");
	$("#textboxBegehungLfDErfassungsNr").val("");
	$("#textboxBegehungDatum").val("");
	$("#textboxBegehungKommentar").val("");
	$(_selectorTextboxParentId).val("");
	setTimeout(LoadListParents(), 1000);
	setTimeout(LoadListChildren(), 1000);
	setTimeout(LoadListAblagen(), 1000);
	setTimeout(LoadListFunde(), 1000);
	setTimeout(LoadListLfDs(), 1000);
	setTimeout(LoadListOrte(), 1000);
	
	document.title = "Kontext";
}

function GetKontextJSON()
{
	var kontext = {
		"Id" : $("#textboxId").val(),
		"Bezeichnung" : $("#textboxBezeichnung").val(),
		"KontextTyp_Id" : $("#selectTypes option:selected").val(),
		"Parent_Id" : $(_selectorTextboxParentId).val() == "" ? null : $(_selectorTextboxParentId).val()
	};
	
	if ($("#selectTypes option:selected").text() == "Begehung")
	{
		kontext.LfDErfassungsJahr = $("#textboxBegehungLfDErfassungsJahr").val();
		kontext.LfDErfassungsNr = $("#textboxBegehungLfDErfassungsNr").val();
		kontext.Datum = $("#textboxBegehungDatum").val();
		kontext.Kommentar = $("#textboxBegehungKommentar").val();
	}
	
	return kontext;
}

function SetKontextJSON(kontext)
{
	$("#textboxId").val(kontext.Id);
	$("#textboxBezeichnung").val(kontext.Bezeichnung);
	SelectTypeId(kontext.Type.Id);
	LoadListChildren(kontext.Id);
	LoadListAblagen(kontext.Id);
	LoadListFunde(kontext.Id);
	LoadListOrte(kontext.Id);
	
	if (kontext.Parent)
	{
		$(_selectorTextboxParentId).val(kontext.Parent.Id);
	}

	LoadListParents();
	
	if (kontext.Type.Bezeichnung == "Begehungsfläche")
	{
		LoadListLfDs(kontext.Id);
	}
	else if (kontext.Type.Bezeichnung == "Begehung")
	{
		$("#textboxBegehungLfDErfassungsJahr").val(kontext.LfDErfassungsJahr);
		$("#textboxBegehungLfDErfassungsNr").val(kontext.LfDErfassungsNr);
		$("#textboxBegehungDatum").val(kontext.Datum);
		$("#textboxBegehungKommentar").val(kontext.Kommentar);
	}
	
	document.title = "("+kontext.Id+") "+kontext.Type.Bezeichnung+": "+kontext.Bezeichnung;
}

function SetShortView(kontext)
{
	$("#shortView").KontextShortView({
		Element : kontext
	});
}

function buttonSpeichern_onClick()
{	
	SaveKontext();	
}

function SaveKontext()
{
	if ($("#textboxId").val() == GetValueForNoSelection())
	{
		return;
	}
	
	$.ajax(
	{
		type:"POST",
		url:"../Dienste/Kontext/Save/",
		data: {
			"Kontext" : JSON.stringify(GetKontextJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			var message = $.parseJSON(data);
			alert(message.Message);
			LoadListRootKontexte();
			
			if (message.ElementId)
				LoadKontextById(message.ElementId);
		}
	});
}

function LoadListParents()
{	
	$("#divParent #divList").empty();

	if ($("#textboxParentId").val() == undefined ||
		$("#textboxParentId").val() == "")
	{
		return;
	}
		
	$("#divParent #divList").List(
	{
		UrlGetElements : "../Dienste/Kontext/GetWithParents/" + $("#textboxParentId").val() + "/AsList",
		SetListItemText : function(element)
		{
			return element.Type.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "../Kontext/Form.html"
	});
}

function LoadListChildren(kontextId)
{
	$("#divKontexte #divList").empty();
	
	if (kontextId == undefined ||
		kontextId == null)
	{
		return;
	}
	
	$("#divKontexte #divList").List(
	{
		UrlGetElements : "../Dienste/Kontext/GetWithChildren/" + kontextId,
		SetListItemText : function(element)
		{
			return element.Type.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "../Kontext/Form.html"
	});
}

function AddChild(kontextId)
{
	window.open("../Kontext/Form.html?Parent_Id=" + kontextId);
}

function AddFund(kontextId)
{
	window.open("../Fund/Form.html?Kontext_Id=" + kontextId);
}

function LoadListAblagen(kontextId)
{
	$("#divAblagen #divList").empty();
	
	if (kontextId == undefined ||
		kontextId == null)
	{
		return;
	}
	
	$("#divAblagen #divList").List(
	{
		UrlGetElements : "../Dienste/Ablage/Get/Kontext/" + kontextId,
		SetListItemText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Type.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
				
			return element.Type.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		ListItemLink : "../Ablage/Form.html"
	});
}

function LoadListFunde(kontextId)
{
	$("#divFunde #divList").empty();
	
	if (kontextId == undefined ||
		kontextId == null)
	{
		return;
	}
	
	$("#divFunde #divList").List(
	{
		UrlGetElements : "../Dienste/Fund/Get/Kontext/" + kontextId,
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
					if (element.Attribute[i].Type.Bezeichnung == "Material")
						material = element.Attribute[i];
					else if (element.Attribute[i].Type.Bezeichnung == "Gegenstand")
						gegenstand = element.Attribute[i];
					else if (element.Attribute[i].Type.Bezeichnung == "Erhaltung")
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

function LoadListLfDs(kontextId)
{
	$("#divLfDs #divList").empty();
	
	if (kontextId == undefined ||
		kontextId == null)
	{
		return;
	}
	
	$("#divLfDs #divList").List(
	{
		UrlGetElements : "../Dienste/LfD/Get/Kontext/" + kontextId,
		SetListItemText : function(element)
		{
			return element.TK25Nr+" / "+element.Nr+" ("+element.Id+")";
		},
		ListItemLink : "../LfD/Form.html"
	});
}

function LoadListRootKontexte()
{	
	$("#divRootKontexte #divList").empty();

	$("#divRootKontexte #divList").List(
	{
		UrlGetElements : "../Dienste/Kontext/GetWithChildren/",
		SetListItemText : function(element)
		{
			return element.Type.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "../Kontext/Form.html"
	});
}

function SetParent()
{	
	var dialog = "<div id=dialogSetParent title='Übergeordneten Kontext auswählen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Bitte wählen Sie einen Kontext aus, unter den Sie den neue Kontext hinzufügen möchten:</p>";
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
		UrlGetParents : "../Dienste/Kontext/GetWithParents/",
		UrlGetChildren : "../Dienste/Kontext/GetWithChildren/",
		//SelectedElementId : null,
		//Blacklist : [],
		SetOptionBackgroundImage : function(element)
		{		
			return "../images/system/Icon"+element.Type.Bezeichnung.replace(" ","_")+"_16px.png";
		},
		SetOptionText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Type.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
				
			return element.Type.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
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
	
	var dialog = "<div id=dialogDelete title='Kontext löschen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Möchten Sie den Kontext ("+$("#textboxId").val()+") wirklich löschen?</p>";
	dialog += "</div>";
	$("body").append(dialog);
	$("#dialogDelete").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Ja": function() {
				$(this).dialog("close");
				DeleteKontext();
				$("#dialogDelete").remove();
			},
			"Nein": function() {
				$(this).dialog("close");
				$("#dialogDelete").remove();
			}
		}
	});
}

function DeleteKontext()
{
	$.ajax(
	{
		type:"GET",
		url:"../Dienste/Kontext/Delete/" + GetKontextJSON().Id,
		success:function(data, textStatus, jqXHR)
		{
			alert(data);
			ClearFields();
			LoadListRootKontexte();
		}
	});
}

function LoadSelectionType()
{
	$.ajax(
	{
		type:"GET",
		url:"../Dienste/Kontext/Type/Get/",
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
				var types = $.parseJSON(data);
				var options = "";
				for (var i = 0; i < types.length; i++)
				{
					if (i == 0)
						options += CreateOptionType(types[i], true);
					else
						options += CreateOptionType(types[i], false);
				}
				$("#selectTypes").html(options);
				SelectTypeId();
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function CreateOptionType(type, select)
{
	var option = "<option value=" + type.Id + " ";
	if (select == true)
		option += "selected=selected ";
	option += "style=\"background-image:url(../images/system/Icon"+type.Bezeichnung.replace(" ","_")+"_16px.png);background-repeat: no-repeat; padding-left: 20px;\" ";
	option += ">";
	option += type.Bezeichnung;
	option += "</option>";
	
	return option;
}

function LoadKontextById(id)
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
		url:"../Dienste/Kontext/GetWithParents/" + id,
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
				}
				kontext.Parent = parent;
				SetKontextJSON(kontext);
				SetShortView(kontext);
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

function AddAblage()
{
	var dialog = "<div id=dialogAddAblage title='Ablage hinzufügen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Bitte wählen Sie ein Ablagelement aus, das Sie hinzufügen möchten:</p>";
	dialog += "<div id=divAddAblage class=field></div>";
	dialog += "<input id=hiddenfieldAblageId type=hidden></input>"
	dialog += "</div>";
	$("body").append(dialog);
	LoadMultiDropdownAblage();
	$("#dialogAddAblage").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Hinzufügen": function() {
				$(this).dialog("close");
				SaveAssociationWithAblage($("#hiddenfieldAblageId").val());
				$("#dialogAddAblage").remove();
			},
			"Abbrechen": function() {
				$(this).dialog("close");
				$("#dialogAddAblage").remove();
			}
		}
	});
}

function LoadMultiDropdownAblage()
{
	$("#divAddAblage").MultiDropdown(
	{
		UrlGetParents : "../Dienste/Ablage/GetWithParents/",
		UrlGetChildren : "../Dienste/Ablage/GetWithChildren/",
		//SelectedElementId : null,
		SetOptionBackgroundImage : function(element)
		{		
			return "../images/system/Icon"+element.Type.Bezeichnung.replace(" ","_")+"_16px.png";
		},
		SetOptionText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Type.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
				
			return element.Type.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		SetSelectedElementId : function(elementId)
		{
			$("#hiddenfieldAblageId").val(elementId);
		}
	});
}

function SaveAssociationWithAblage(ablageId)
{
	$.ajax(
	{
		type:"GET",
		url:"../Dienste/Kontext/Link/" + GetCurrentElementId() + "/Ablage/" + ablageId,
		success:function(data, textStatus, jqXHR)
		{
			LoadListAblagen(GetCurrentElementId());
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function AddOrt()
{
	var dialog = "<div id=dialogAddOrt title='Ort hinzufügen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Bitte wählen Sie ein Ortelement aus, das Sie hinzufügen möchten:</p>";
	dialog += "<div id=divAddOrt class=field></div>";
	dialog += "<input id=hiddenfieldOrtId type=hidden></input>"
	dialog += "</div>";
	$("body").append(dialog);
	LoadMultiDropdownOrt();
	$("#dialogAddOrt").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Hinzufügen": function() {
				$(this).dialog("close");
				SaveAssociationWithOrt($("#hiddenfieldOrtId").val());
				$("#dialogAddOrt").remove();
			},
			"Abbrechen": function() {
				$(this).dialog("close");
				$("#dialogAddOrt").remove();
			}
		}
	});
}

function LoadMultiDropdownOrt()
{
	$("#divAddOrt").MultiDropdown(
	{
		UrlGetParents : "../Dienste/Ort/GetWithParents/",
		UrlGetChildren : "../Dienste/Ort/GetWithChildren/",
		SetOptionText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Type.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
				
			return element.Type.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		SetSelectedElementId : function(elementId)
		{
			$("#hiddenfieldOrtId").val(elementId);
		}
	});
}

function SaveAssociationWithOrt(ortId)
{
	$.ajax(
	{
		type:"GET",
		url:"../Dienste/Kontext/Link/" + GetCurrentElementId() + "/Ort/" + ortId,
		success:function(data, textStatus, jqXHR)
		{
			LoadListOrte(GetCurrentElementId());
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

function AddLfD()
{
	if ($("#textboxId").val() == GetValueForNoSelection())
	{
		return;
	}
	
	var dialog = "<div id=dialogAddLfD title='LfD hinzufügen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Bitte geben Sie die zweiteilige LfD-Nummer ein:</p>";
	dialog += "<label>TK25-Ausschnitt: </label></br><input type=text id=textboxTK25Nr ></input></br>";
	dialog += "<label>Ausschnitts-Nr.: </label></br><input type=text id=textboxNr ></input>";
	dialog += "</div>";
	$("body").append(dialog);
	$("#dialogAddLfD").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Ja": function() {
				$(this).dialog("close");
				SaveLfD();
				$("#dialogAddLfD").remove();
			},
			"Nein": function() {
				$(this).dialog("close");
				$("#dialogAddLfD").remove();
			}
		}
	});
}

function SaveLfD()
{
	var tk25Nr = $("#textboxTK25Nr").val();
	var nr = $("#textboxNr").val();
	
	$.ajax(
	{
		type:"POST",
		url:"../Dienste/LfD/Save/",
		data: {
			LfD : JSON.stringify({
				TK25Nr : tk25Nr,
				Nr : nr
			})
		},
		success:function(data, textStatus, jqXHR)
		{
			GetLfDAndSaveAssociationWithLfD(tk25Nr, nr);
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function GetLfDAndSaveAssociationWithLfD(tk25Nr, nr)
{
	$.ajax(
	{
		type:"GET",
		url:"../Dienste/LfD/Get/" + tk25Nr + "/" + nr,
		success:function(data, textStatus, jqXHR)
		{
			var lfd = $.parseJSON(data);
			SaveAssociationWithLfD(lfd.Id);
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function SaveAssociationWithLfD(lfdId)
{
	$.ajax(
	{
		type:"GET",
		url:"../Dienste/Kontext/Link/" + GetCurrentElementId() + "/LfD/" + lfdId,
		success:function(data, textStatus, jqXHR)
		{
			LoadListLfDs(GetCurrentElementId());
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function LoadListOrte(kontextId)
{
	$("#divOrte #divList").empty();
	
	if (kontextId == undefined ||
		kontextId == null)
	{
		return;
	}
	
	$("#divOrte #divList").List(
	{
		UrlGetElements : "../Dienste/Ort/Get/Kontext/" + kontextId,
		SetUrlUnlink : function(ortId)
		{
			return "../Dienste/Kontext/Unlink/" + kontextId + "/Ort/" + ortId;
		},
		SetListItemText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Type.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
				
			return element.Type.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		ListItemLink : "../Ort/Form.html",
		IsDeletable : true
	});
}
