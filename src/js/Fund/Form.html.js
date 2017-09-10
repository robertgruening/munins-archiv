var _selectorMultiDropdownAblage = "#divAblageSelections";
var _selectorTextboxAblageId = "#textboxSelectedAblageId";
var _selectorMultiDropdownKontext = "#divKontextSelections";
var _selectorTextboxKontextId = "#textboxSelectedKontextId";
var _offset = 0;

$(document).ready(function() {
	$("#navigation").Navigation();
	$("#breadcrumb").Breadcrumb({
		PageName : "FundForm"
	});

	$("#textboxId").attr("disabled",true);
	$(_selectorTextboxAblageId).attr("disabled",true);
	$(_selectorTextboxKontextId).attr("disabled",true);
	
	$("#buttonAddFundAttribut").click(function() { AddAttribut(); });
	$("#buttonSearch").click(function() { Search(); } );
	
	if (GetURLParameter("Id"))
	{
		LoadFundById(GetURLParameter("Id"));
		
		return;
	}
	
	ClearFields();
	
	if (GetURLParameter("Ablage_Id"))
	{
		$(_selectorTextboxAblageId).val(GetURLParameter("Ablage_Id"));
		LoadMultiDropdownAblage($(_selectorTextboxAblageId).val());
	}	
	
	if (GetURLParameter("Kontext_Id"))
	{
		$(_selectorTextboxKontextId).val(GetURLParameter("Kontext_Id"));
		LoadMultiDropdownKontext($(_selectorTextboxKontextId).val());
	}
});

function buttonNeu_onClick()
{
	ClearFields();
}

function ClearFields()
{
	$("#textboxId").val("");
	$("#textboxBeschriftung").val("");
	$("#textboxAnzahl").val("1");
	$(_selectorTextboxAblageId).val("");
	$(_selectorTextboxKontextId).val("");
	LoadMultiDropdownAblage(null);
	LoadMultiDropdownKontext(null);
	//setTimeout(LoadListAttribute(), 1000);
	$("#divFundAttribute #divList").empty();
	$("#buttonAddFundAttribut").attr("disabled", true);
	
	document.title = "Fund";
}

function GetFundJSON()
{
	var fund = {
		"Id" : $("#textboxId").val(),
		"Bezeichnung" : $("#textboxBeschriftung").val(),
		"Anzahl" : $("#textboxAnzahl").val().replace(">", "-"),
		"Dimension1" : $("#textboxDimension1").val() == "" ? null : $("#textboxDimension1").val(),
		"Dimension2" : $("#textboxDimension2").val() == "" ? null : $("#textboxDimension2").val(),
		"Dimension3" : $("#textboxDimension3").val() == "" ? null : $("#textboxDimension3").val(),
		"Masse" : $("#textboxMasse").val() == "" ? null : $("#textboxMasse").val(),
		"Ablage_Id" : $(_selectorTextboxAblageId).val() == "" ? null : $(_selectorTextboxAblageId).val(),
		"Kontext_Id" : $(_selectorTextboxKontextId).val() == "" ? null : $(_selectorTextboxKontextId).val()
	};
	
	return fund;
}

function SetFundJSON(fund)
{
	$("#textboxId").val(fund.Id);
	$("#textboxBeschriftung").val(fund.Bezeichnung);
	$("#textboxAnzahl").val(ConvertFundAnzahl(fund.Anzahl));
	$("#textboxDimension1").val(fund.Dimension1);
	$("#textboxDimension2").val(fund.Dimension2);
	$("#textboxDimension3").val(fund.Dimension3);
	$("#textboxMasse").val(fund.Masse);
	LoadListAttribute(fund.Id);	
	$("#buttonAddFundAttribut").attr("disabled", false);
	
	// Ablage
	if (fund.Ablage == undefined ||
		fund.Ablage == null)
	{
		$(_selectorTextboxAblageId).val("");
		LoadMultiDropdownAblage(null);
	}
	else
	{
		$(_selectorTextboxAblageId).val(fund.Ablage.Id);
		LoadMultiDropdownAblage(fund.Ablage.Id);	
	}
	
	// Kontext
	if (fund.Kontext == undefined ||
		fund.Kontext == null)
	{
		$(_selectorTextboxKontextId).val("");
		LoadMultiDropdownKontext(null);
	}
	else
	{
		$(_selectorTextboxKontextId).val(fund.Kontext.Id);
		LoadMultiDropdownKontext(fund.Kontext.Id);	
	}
	
	document.title = "("+fund.Id+") Fund: "+fund.Bezeichnung;
}

function SetShortView(fund)
{
	$("#shortView").FundShortView({
		Element : fund
	});
}

function buttonSpeichern_onClick()
{	
	SaveFund();	
}

function SaveFund()
{
	if ($("#textboxId").val() == GetValueForNoSelection())
	{
		return;
	}
	
	$.ajax(
	{
		type:"POST",
		url:"../Dienste/Fund/Save",
		data: {
			"Fund" : JSON.stringify(GetFundJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			var message = $.parseJSON(data);
			alert(message.Message);
			
			if (message.ElementId)
				LoadFundById(message.ElementId);
		}
	});
}

function LoadListAttribute(fundId)
{
	$("#divFundAttribute #divList").empty();
	
	if (fundId == undefined ||
		fundId == null)
	{
		data = { FundId : fundId };
	}
	
	$("#divFundAttribute #divList").List(
	{
		UrlGetElements : "../Dienste/FundAttribut/Get/Fund/" + fundId,
		SetUrlUnlink : function(fundAttributId)
		{
			return "../Dienste/Fund/Unlink/" + fundId + "/FundAttribut/" + fundAttributId;
		},
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.FullBezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "../FundAttribut/Form.html",
		IsDeletable : true
	});
}

function AddAttribut()
{
	var dialog = "<div id=dialogAddAttribut title='Attribut hinzufügen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Bitte wählen Sie ein Attribut aus, das den Fund beschreibt:</p>";
	dialog += "<div id=divAddAttribut class=field></div>";
	dialog += "<input id=hiddenfieldFundAttributId type=hidden></input>"
	dialog += "</div>";
	$("body").append(dialog);
	LoadMultiDropdownAttribut();
	$("#dialogAddAttribut").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Hinzufügen": function() {
				$(this).dialog("close");
				SaveAssociationWithAttribut($("#hiddenfieldFundAttributId").val());
				$("#dialogAddAttribut").remove();
			},
			"Abbrechen": function() {
				$(this).dialog("close");
				$("#dialogAddAttribut").remove();
			}
		}
	});
}

function LoadMultiDropdownAttribut()
{
	$("#divAddAttribut").MultiDropdown(
	{
		UrlGetParents : "../Dienste/FundAttribut/GetWithParents/",
		UrlGetChildren : "../Dienste/FundAttribut/GetWithChildren/",
		SetOptionText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		SetSelectedElementId : function(elementId)
		{
			$("#hiddenfieldFundAttributId").val(elementId);
		}
	});
}

function SaveAssociationWithAttribut(attributId)
{
	$.ajax(
	{
		type:"GET",
		url:"../Dienste/Fund/Link/" + GetCurrentElementId() + "/FundAttribut/" + attributId,
		success:function(data, textStatus, jqXHR)
		{
			LoadListAttribute(GetCurrentElementId());
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function GetCurrentElementId()
{
	return $("#textboxId").val();
}

function LoadMultiDropdownAblage(ablageId)
{
	$(_selectorMultiDropdownAblage).MultiDropdown(
	{
		UrlGetParents : "../Dienste/Ablage/GetWithParents/",
		UrlGetChildren : "../Dienste/Ablage/GetWithChildren/",
		SelectedElementId : ablageId,
		SetOptionBackgroundImage : function(element)
		{		
			return "../images/system/Icon"+element.Typ.Bezeichnung.replace(" ","_")+"_16px.png";
		},
		SetOptionText : function(element)
		{			
			if (element.FullBezeichnung == "")
				return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
				
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		SetSelectedElementId : function(elementId)
		{
			$(_selectorTextboxAblageId).val(elementId);
		}
	});
}

function LoadMultiDropdownKontext(kontextId)
{
	$(_selectorMultiDropdownKontext).MultiDropdown(
	{
		UrlGetParents : "../Dienste/Kontext/GetWithParents/",
		UrlGetChildren : "../Dienste/Kontext/GetWithChildren/",
		SelectedElementId : kontextId,
		SetOptionBackgroundImage : function(element)
		{		
			return "../images/system/Icon"+element.Typ.Bezeichnung.replace(" ","_")+"_16px.png";
		},
		SetOptionText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		SetSelectedElementId : function(elementId)
		{
			$(_selectorTextboxKontextId).val(elementId);
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
		url:"../Dienste/Ablage/Unlink/" + GetFundJSON().Id,
		success:function(data, textStatus, jqXHR)
		{
			alert(data);
			ClearFields();
		}
	});
}

function LoadFundById(id)
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
		url:"../Dienste/Fund/Get/" + id,
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
				SetFundJSON($.parseJSON(data));
                SetShortView($.parseJSON(data));
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

function GetValueForNoSelection()
{
	return -1;
}

function Search()
{
	_offset = 0;
	LoadSearchResult();
}

function LoadSearchResult()
{	
	var myData = {
		"Offset" : _offset,
		"Limit" : 10,
	};
	
	if ($("#textboxFilterBeschriftung").val() != "")
		myData.Beschriftung = $("#textboxFilterBeschriftung").val();
	if ($("#textboxFilterAblageId").val() != "")
		myData.AblageId = $("#textboxFilterAblageId").val();
	if ($("#textboxFilterKontextId").val() != "")
		myData.KontextId = $("#textboxFilterKontextId").val();
	
	$.ajax(
	{
		type:"POST",
		url:"../Dienste/Fund/Search/",
		data: myData,
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
				ShowSearchResult($.parseJSON(data));
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function SearchPrevious()
{
	if (_offset > 0)
	{
		_offset -= 10;
		LoadSearchResult();
	}
}

function SearchNext()
{
	_offset += 10;
	LoadSearchResult();
}

function ShowSearchResult(message)
{
	$("#divErgebnisse").empty();
	$("#divErgebnisse").append("<p>" + message.From + " bis " + message.To + " von " + message.Gesamtanzahl +"</p>");
	$("#divErgebnisse").append("<input type=button id=searchPrevious class=notToPrint value=Zurück></input>");
	$("#divErgebnisse").append("<input type=button id=searchNext class=notToPrint value=Weiter></input>");
	$("#searchPrevious").attr("disabled",true);
	$("#searchNext").attr("disabled",true);
		
	if ((message.From - 10) > 0)
	{
		$("#searchPrevious").click(function() { SearchPrevious(); });
		$("#searchPrevious").attr("disabled",false);
	}
		
	if (message.To < message.Gesamtanzahl)
	{
		$("#searchNext").click(function() { SearchNext(); });
		$("#searchNext").attr("disabled",false);
	}
	
	var tabelle = "";
	tabelle += "<table>";
	tabelle += "<tr>";
	tabelle += "<th>Nr.</th>";
	tabelle += "<th>Id</th>";
	tabelle += "<th>Anzahl</th>";
	tabelle += "<th>Beschriftung</th>";	
	tabelle += "<th>Ablage</th>";
	tabelle += "<th>Kontext</th>";
	tabelle += "<th>Attribute</th>";
	tabelle += "</tr>";
	
	for (var i = 0; i < message.Elemente.length; i++)
	{		
		tabelle += "<tr>";
		tabelle += "<td>" + (message.From + i) + "</td>";
		tabelle += "<td><a href=\"../Fund/Form.html?Id="+message.Elemente[i].Id + "\">" + message.Elemente[i].Id + "</a></td>";
		tabelle += "<td><a href=\"../Fund/Form.html?Id="+message.Elemente[i].Id + "\">" + ConvertFundAnzahl(message.Elemente[i].Anzahl) + "</a></td>";
		tabelle += "<td><a href=\"../Fund/Form.html?Id="+message.Elemente[i].Id + "\">" + message.Elemente[i].Bezeichnung + "</a></td>";
		tabelle += "<td><a href=\"../Ablage/Form.html?Id="+message.Elemente[i].Ablage.Id + "\">" + message.Elemente[i].Ablage.FullBezeichnung + "</a></td>";	
		tabelle += "<td><a href=\"../Kontext/Form.html?Id="+message.Elemente[i].Kontext.Id + "\">" + message.Elemente[i].Kontext.FullBezeichnung + "</a></td>";	
		tabelle += "<td><ul>"
		
		for (var j = 0; j < message.Elemente[i].Attribute.length; j++)
		{
			tabelle += "<li><a href=\"../FundAttribut/Form.html?Id=" + message.Elemente[i].Attribute[j].Id + "\">" + message.Elemente[i].Attribute[j].FullBezeichnung + "</a></li>"
		}
		
		tabelle += "</ul></td>";	
		tabelle += "</tr>";
	}
	
	tabelle += "</table>";
	
	$("#divErgebnisse").append(tabelle);
}

function ConvertFundAnzahl(fundAnzahl)
{	
	if (fundAnzahl < 0)
		return ">" + (fundAnzahl * (-1));
		
	return fundAnzahl;
}
