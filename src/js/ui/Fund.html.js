var _selectorMultiDropdownAblage = "#divAblageSelections";
var _selectorTextboxAblageId = "#textboxSelectedAblageId";

var _selectorMultiDropdownKontext = "#divKontextSelections";
var _selectorTextboxKontextId = "#textboxSelectedKontextId";

$(document).ready(function() {
	$("#textboxId").attr("disabled",true);
	$(_selectorTextboxAblageId).attr("disabled",true);
	$(_selectorTextboxKontextId).attr("disabled",true);
	
	$("#buttonAddFundAttribut").click(function() { AddAttribut(); });
	
	if (GetURLParameter("Id"))
	{
		LoadFundById(GetURLParameter("Id"));
	}
	else
	{
		ClearFields();
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
		"Ablage_Id" : $(_selectorTextboxAblageId).val() == "" ? null : $(_selectorTextboxAblageId).val(),
		"Kontext_Id" : $(_selectorTextboxKontextId).val() == "" ? null : $(_selectorTextboxKontextId).val()
	};
	
	return fund;
}

function SetFundJSON(fund)
{
	$("#textboxId").val(fund.Id);
	$("#textboxBeschriftung").val(fund.Bezeichnung);
	$("#textboxAnzahl").val(fund.Anzahl.indexOf("-") >= 0 ? ">"+(fund.Anzahl * (-1)) : fund.Anzahl);
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
		url:"Dienste/SaveFund.php",
		data: {
			"Fund" : JSON.stringify(GetFundJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			alert(data);
			LoadFundById(data);
		}
	});
}

function LoadListAttribute(fundId)
{
	var data = null;
	
	if (fundId != undefined &&
		fundId != null)
	{
		data = { FundId : fundId };
	}
	
	$("#divFundAttribute #divList").List(
	{
		UrlGetElements : "Dienste/GetFundAttribut.php",
		UrlDeleteAssociation : "Dienste/DeleteAssociation.php",
		SetData : function(FundAttribut_Id)
		{
			return data = { FundId : fundId,
							FundAttributId : FundAttribut_Id};
		},
		Data : data,
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.FullBezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "FundAttribut.html",
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
		UrlGetParents : "Dienste/GetFundAttributMitParents.php",
		UrlGetChildren : "Dienste/GetFundAttributChildren.php",
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
		type:"POST",
		url:"Dienste/SaveAssociation.php",
		data: {
			FundId : GetCurrentElementId(),
			FundAttributId : attributId
		},
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
		UrlGetParents : "Dienste/GetAblageMitParents.php",
		UrlGetChildren : "Dienste/GetAblageChildren.php",
		SelectedElementId : ablageId,
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
			$(_selectorTextboxAblageId).val(elementId);
		}
	});
}

function LoadMultiDropdownKontext(kontextId)
{
	$(_selectorMultiDropdownKontext).MultiDropdown(
	{
		UrlGetParents : "Dienste/GetKontextMitParents.php",
		UrlGetChildren : "Dienste/GetKontextChildren.php",
		SelectedElementId : kontextId,
		SetOptionBackgroundImage : function(element)
		{		
			return "images/system/Icon"+element.Typ.Bezeichnung.replace(" ","_")+"_16px.png";
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
		type:"POST",
		url:"Dienste/DeleteAblage.php",
		data: {
			"Ablage" : JSON.stringify(GetFundJSON())
		},
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
		type:"POST",
		url:"Dienste/GetFund.php",
		data: {
			Id : id
		},
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
				SetFundJSON($.parseJSON(data));
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
