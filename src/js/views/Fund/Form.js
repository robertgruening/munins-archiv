var _selectorTextboxAblageId = "#textboxSelectedAblageId";
var _selectorTextboxKontextId = "#textboxSelectedKontextId";

$(document).ready(function() {
	//_webServiceClientFund.Register("load", new GuiClient(Fill));
	_webServiceClientFund.Register("load", new GuiClient(SetSelectedElement));
	_webServiceClientFund.Register("delete", new GuiClient(openFormNewElement));

	InitBreadcrumb();
	InitButtonNew();
	InitButtonSave();
	InitButtonDelete();
	InitButtonSelectKontext();
	InitButtonSelectAblage();

	$(_selectorTextboxAblageId).attr("disabled",true);
	$(_selectorTextboxKontextId).attr("disabled",true);
	
	$("#buttonAddFundAttribut").click(function() { AddAttribut(); });
	
	if (getUrlParameterValue("Id"))
	{
		var fund = new Fund();
		fund.Id = getUrlParameterValue("Id");
		_webServiceClientFund.Load(fund);
		
		return;
	}

	SetFundJSON(new Fund());
});

function InitBreadcrumb()
{
	if (getFormMode() == "create")
	{
	    $("#breadcrumb").Breadcrumb({
		    PageName : "FundFormNew"
	    });
	}
	else if (getFormMode() == "edit")
	{
	    $("#breadcrumb").Breadcrumb({
		    PageName : "FundFormEdit"
	    });
	}
}

function InitButtonNew()
{
	EnableButtonNew();
	$("#buttonNew").click(openFormNewElement);
}

function InitButtonSave()
{
	EnableButtonSave();
	$("#buttonSave").click(SaveFund);
}

function InitButtonDelete()
{
	DisableButtonDelete();
	$("#buttonDelete").click(ShowDialogDelete);
}

function InitButtonSelectKontext()
{
	$("#buttonSelectKontext").click(ShowFormSelectKontext);
}

function InitButtonSelectAblage()
{
	$("#buttonSelectAblage").click(ShowFormSelectAblage);
}

function EnableButtonNew()
{
	$("#buttonNew").removeClass("disabled");
	$("#buttonNew").prop("disabled", false);
}

function DisableButtonNew()
{
	$("#buttonNew").addClass("disabled");
	$("#buttonNew").prop("disabled", true);
}

function EnableButtonSave()
{
	$("#buttonSave").removeClass("disabled");
	$("#buttonSave").prop("disabled", false);
}

function DisableButtonSave()
{
	$("#buttonSave").addClass("disabled");
	$("#buttonSave").prop("disabled", true);
}

function EnableButtonDelete()
{
	$("#buttonDelete").removeClass("disabled");
	$("#buttonDelete").prop("disabled", false);
}

function DisableButtonDelete()
{
	$("#buttonDelete").addClass("disabled");
	$("#buttonDelete").prop("disabled", true);
}

function ShowFormSelectAblage()
{
	$("#dialogSelectAblage").dialog({
		height: "auto",
		width: 750,
		title: "Ablage auswählen",
		modal: true,
		resizable: false,
		buttons: {
			"Speichern": function()
			{
				var fund = GetSelectedElement();
				fund.Ablage = GetSelectedAblage();
				SetSelectedElement(fund);				

				$(this).dialog("close");
				//$("#tree").jstree(true).refresh();
			},
			"Abbrechen": function()
			{
				$(this).dialog("close");
			}
		}
	});

	$("#treeSelectAblage").jstree(true).refresh();

	$("#dialogSelectAblage").dialog("open");
}

function ShowFormSelectKontext()
{
	$("#dialogSelectKontext").dialog({
		height: "auto",
		width: 750,
		title: "Kontext auswählen",
		modal: true,
		resizable: false,
		buttons: {
			"Speichern": function()
			{
				var fund = GetSelectedElement();
				fund.Kontext = GetSelectedKontext();
				SetSelectedElement(fund);				

				$(this).dialog("close");
				//$("#tree").jstree(true).refresh();
			},
			"Abbrechen": function()
			{
				$(this).dialog("close");
			}
		}
	});

	$("#treeSelectKontext").jstree(true).refresh();

	$("#dialogSelectKontext").dialog("open");
}

function SaveFund()
{

}

function GetIcon(type, state)
{
	return IconConfig.getCssClasses(type, state);
}

function ClearFields()
{
	$("#textboxBeschriftung").val("");
	$("#textboxAnzahl").val("");
	$(_selectorTextboxAblageId).val("");
	$(_selectorTextboxKontextId).val("");
	//LoadMultiDropdownAblage(null);
	//LoadMultiDropdownKontext(null);
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
		"Anzahl" : convertAnzahlInputText($("#textboxAnzahl").val()),
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
	$("#textboxBeschriftung").val(fund.Bezeichnung);
	$("#textboxAnzahl").val(getFundAnzahlLabelText(fund));
	$("#textboxDimension1").val(fund.Dimension1);
	$("#textboxDimension2").val(fund.Dimension2);
	$("#textboxDimension3").val(fund.Dimension3);
	$("#textboxMasse").val(fund.Masse);
	SetFundAttribute(fund.FundAttribute);
	$("#buttonAddFundAttribut").attr("disabled", false);
    $("#textboxSelectedKontextId").val(fund.Kontext == null ? "" : ("/" + fund.Kontext.Path));
    $("#textboxSelectedAblageId").val(fund.Ablage == null ? "" : ("/" + fund.Ablage.Path));
	
	// // Ablage
	// if (fund.Ablage == undefined ||
	// 	fund.Ablage == null)
	// {
	// 	$(_selectorTextboxAblageId).val("");
	// }
	// else
	// {
	// 	$(_selectorTextboxAblageId).val(fund.Ablage.Path);
	// }
	
	// // Kontext
	// if (fund.Kontext == undefined ||
	// 	fund.Kontext == null)
	// {
	// 	$(_selectorTextboxKontextId).val("");
	// }
	// else
	// {
	// 	$(_selectorTextboxKontextId).val(fund.Kontext.Path);
	// }
	
	if (fund.Id == null)
	{
		document.title = "Fund";
	}
	else
	{
		document.title = "("+fund.Id+") Fund: "+fund.Bezeichnung;
	}
}

function ShowDialogDelete()
{
	var selectedNode = GetSelectedElement();

	$("#dialogDelete").empty();
	$("#dialogDelete").append(
		$("<p>").append("Möchten Sie diesen Fund löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		width: 750,
		modal: true,
		buttons: {
			"Löschen": function()
			{
				_webServiceClientFund.Delete(selectedNode, "deleted");

				$(this).dialog("close");
			},
			"Abbrechen": function()
			{
				$(this).dialog("close");
			}
		}
	});

	$("#DialogDelete").dialog("open");
}

function SetFundAttribute(fundAttribute)
{
	console.log(fundAttribute.length);
	$("#divFundAttribute div #divList").empty();

	$("#divFundAttribute div #divList").text(fundAttribute.length);
}
