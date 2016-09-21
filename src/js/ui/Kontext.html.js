var _selectorMultiDropdownParent = "#divParentSelections";
var _selectorTextboxParentId = "#textboxParentId";

var _selectorMultiDropdownKontext = "#divKontextSelections";
var _selectorTextboxKontextId = "#textboxId";

$(document).ready(function() {
	$("#textboxId").attr("disabled",true);
	$(_selectorTextboxParentId).attr("disabled",true);
	$("#buttonAddChild").attr("disabled",true);
	
	$("#buttonSetParent").click(function() { SetParent(); });
	$("#buttonAddAblage").click(function() { AddAblage(); });
	$("#buttonAddLfD").click(function() { AddLfD(); });
	$("#buttonAddOrt").click(function() { AddOrt(); });
	
	LoadSelectionTyp();
	LoadListRootKontexte();
	
	if (GetURLParameter("Id"))
	{
		LoadKontextById(GetURLParameter("Id"));
		
		$("#buttonAddChild").click(function() { AddChild(GetURLParameter("Id")); });
		$("#buttonAddChild").attr("disabled",false);
		
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
	//$("#divParent").hide();
	$("#divBegehungLfDErfassungsJahr").hide();
	$("#divBegehungLfDErfassungsNr").hide();
	$("#divBegehungDatum").hide();
	$("#divBegehungKommentar").hide();
	$("#divLfDs").hide();
	
	if ($("#selectTypen option:selected").text() == "Fundstelle")
	{
	}
	else if ($("#selectTypen option:selected").text() == "Begehungsfläche")
	{
		//$("#divParent").show();
		$("#divLfDs").show();
	}
	else if ($("#selectTypen option:selected").text() == "Begehung")
	{
		//$("#divParent").show();
		$("#divBegehungLfDErfassungsJahr").show();
		$("#divBegehungLfDErfassungsNr").show();
		$("#divBegehungDatum").show();
		$("#divBegehungKommentar").show();
	}
	else
	{
		//$("#divParent").show();
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
		"KontextTyp_Id" : $("#selectTypen option:selected").val(),
		"Parent_Id" : $(_selectorTextboxParentId).val() == "" ? null : $(_selectorTextboxParentId).val()
	};
	
	if ($("#selectTypen option:selected").text() == "Begehung")
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
	SelectTypId(kontext.Typ.Id);
	LoadListChildren(kontext.Id);
	LoadListAblagen(kontext.Id);
	LoadListFunde(kontext.Id);
	LoadListOrte(kontext.Id);
	
	if (kontext.Parent)
		$(_selectorTextboxParentId).val(kontext.Parent.Id);

	LoadListParents();
	
	if (kontext.Typ.Bezeichnung == "Begehungsfläche")
	{
		LoadListLfDs(kontext.Id);
	}
	else if (kontext.Typ.Bezeichnung == "Begehung")
	{
		$("#textboxBegehungLfDErfassungsJahr").val(kontext.LfDErfassungsJahr);
		$("#textboxBegehungLfDErfassungsNr").val(kontext.LfDErfassungsNr);
		$("#textboxBegehungDatum").val(kontext.Datum);
		$("#textboxBegehungKommentar").val(kontext.Kommentar);
	}
	
	document.title = "("+kontext.Id+") "+kontext.Typ.Bezeichnung+": "+kontext.Bezeichnung;
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
		url:"Dienste/SaveKontext.php",
		data: {
			"Kontext" : JSON.stringify(GetKontextJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			alert(data);
			LoadListRootKontexte();
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
		UrlGetElements : "Dienste/GetKontextMitParents.php",
		Data : data,
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "Kontext.html"
	});
}

function LoadListChildren(kontextId)
{
	var data = null;
	
	if (kontextId != undefined &&
		kontextId != null)
	{
		data = { Id : kontextId };
	}
	
	$("#divKontexte #divList").List(
	{
		UrlGetElements : "Dienste/GetKontextChildren.php",
		Data : data,
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "Kontext.html"
	});
}

function LoadListAblagen(kontextId)
{
	var data = null;
	
	if (kontextId != undefined &&
		kontextId != null)
	{
		data = { KontextId : kontextId };
	}
	
	$("#divAblagen #divList").List(
	{
		UrlGetElements : "Dienste/GetAblage.php",
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

function LoadListFunde(kontextId)
{
	var data = null;
	
	if (kontextId != undefined &&
		kontextId != null)
	{
		data = { KontextId : kontextId };
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

function LoadListLfDs(kontextId)
{
	var data = null;
	
	if (kontextId != undefined &&
		kontextId != null)
	{
		data = { KontextId : kontextId };
	}
	
	$("#divLfDs #divList").List(
	{
		UrlGetElements : "Dienste/GetLfD.php",
		Data : data,
		SetListItemText : function(element)
		{
			return element.TK25Nr+" / "+element.Nr+" ("+element.Id+")";
		},
		ListItemLink : "LfD.html"
	});
}

function LoadListRootKontexte()
{	
	$("#divRootKontexte #divList").List(
	{
		UrlGetElements : "Dienste/GetKontextChildren.php",
		Data : { Id : null },
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "Kontext.html"
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
		UrlGetParents : "Dienste/GetKontextMitParents.php",
		UrlGetChildren : "Dienste/GetKontextChildren.php",
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
		type:"POST",
		url:"Dienste/DeleteKontext.php",
		data: {
			"Kontext" : JSON.stringify(GetKontextJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			alert(data);
			ClearFields();
			LoadListRootKontexte();
		}
	});
}

function LoadSelectionTyp()
{
	$.ajax(
	{
		type:"POST",
		url:"Dienste/GetKontextTyp.php",
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
		type:"POST",
		url:"Dienste/GetKontextMitParents.php",
		data: {
			Id : id
		},
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
		UrlGetParents : "Dienste/GetAblageMitParents.php",
		UrlGetChildren : "Dienste/GetAblageChildren.php",
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
			$("#hiddenfieldAblageId").val(elementId);
		}
	});
}

function SaveAssociationWithAblage(ablageId)
{
	$.ajax(
	{
		type:"POST",
		url:"Dienste/SaveAssociation.php",
		data: {
			KontextId : GetCurrentElementId(),
			AblageId : ablageId
		},
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
		UrlGetParents : "Dienste/GetOrtMitParents.php",
		UrlGetChildren : "Dienste/GetOrtChildren.php",
		SetOptionText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
				
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
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
		type:"POST",
		url:"Dienste/SaveAssociation.php",
		data: {
			KontextId : GetCurrentElementId(),
			OrtId : ortId
		},
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
		url:"Dienste/SaveLfD.php",
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
		type:"POST",
		url:"Dienste/GetLfD.php",
		data: {
			TK25Nr : tk25Nr,
			Nr : nr
		},
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
		type:"POST",
		url:"Dienste/SaveAssociation.php",
		data: {
			KontextId : GetCurrentElementId(),
			LfDId : lfdId
		},
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
	var data = null;
	
	if (kontextId != undefined &&
		kontextId != null)
	{
		data = { KontextId : kontextId };
	}
	
	$("#divOrte #divList").List(
	{
		UrlGetElements : "Dienste/GetOrt.php",
		UrlDeleteAssociation : "Dienste/DeleteAssociation.php",
		SetData : function(ortId)
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
		ListItemLink : "Ort.html",
		IsDeletable : true
	});
}
