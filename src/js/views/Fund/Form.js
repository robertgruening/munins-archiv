var _fundViewModel = new FundViewModel();

$(document).ready(function() {
	InitBreadcrumb();
	InitButtonNew();
	InitButtonSave();
	InitButtonDelete();
	InitButtonSelectKontext();
	InitButtonSelectAblage();

	InitFieldBeschriftung();
	InitFieldFundattribute();
	InitFieldAnzahl();
	InitFieldDimension1();
	InitFieldDimension2();
	InitFiledDimension3();
	InitFieldMasse();
	InitFieldAblage();
	InitFieldKontext();
	
	$("#buttonAddFundAttribut").click(function() { AddAttribut(); });
	
	if (getUrlParameterValue("Id"))
	{
		_fundViewModel.load(getUrlParameterValue("Id"));
	}
});

//#region init
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

//#region button new
function InitButtonNew()
{
	EnableButtonNew();
	$("#buttonNew").click(openFormNewElement);
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
//#endregion

//#region button save
function InitButtonSave()
{
	EnableButtonSave();
	$("#buttonSave").click(function(){_fundViewModel.save();});
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
//#endregion

//#region button delete
function InitButtonDelete()
{
	DisableButtonDelete();
	$("#buttonDelete").click(ShowDialogDelete);
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
//#endregion

function InitButtonSelectKontext()
{
	$("#buttonSelectKontext").click(ShowFormSelectKontext);
}

function InitButtonSelectAblage()
{
	$("#buttonSelectAblage").click(ShowFormSelectAblage);
}

function InitFieldBeschriftung()
{
	_fundViewModel.register("bezeichnung", new GuiClient(setBezeichnung));
	$("#textboxBeschriftung").change(function() {
		_fundViewModel.setBezeichnung($("#textboxBeschriftung").val())
	});
}

function InitFieldFundattribute()
{
	_fundViewModel.register("fundAttribute", new GuiClient(setFundAttribute));
}

function InitFieldAnzahl()
{
	_fundViewModel.register("anzahl", new GuiClient(setAnzahl));
	$("#textboxAnzahl").change(function() {
		_fundViewModel.setAnzahl($("#textboxAnzahl").val())
	});
}

function InitFieldDimension1()
{
	_fundViewModel.register("dimension1", new GuiClient(setDimension1));
	$("#textboxDimension1").change(function() {
		_fundViewModel.setDimension1($("#textboxDimension1").val())
	});
}

function InitFieldDimension2()
{
	_fundViewModel.register("dimension2", new GuiClient(setDimension2));
	$("#textboxDimension2").change(function() {
		_fundViewModel.setDimension2($("#textboxDimension2").val())
	});
}

function InitFiledDimension3()
{
	_fundViewModel.register("dimension3", new GuiClient(setDimension3));
	$("#textboxDimension3").change(function() {
		_fundViewModel.setDimension3($("#textboxDimension3").val())
	});
}

function InitFieldMasse()
{
	_fundViewModel.register("masse", new GuiClient(setMasse));
	$("#textboxMasse").change(function() {
		_fundViewModel.setMasse($("#textboxMasse").val())
	});
}

function InitFieldKontext()
{
	$("#textboxSelectedKontext").attr("disabled",true);
	_fundViewModel.register("kontext", new GuiClient(setKontext));
}

function InitFieldAblage()
{
	$("#textboxSelectedAblage").attr("disabled",true);
	_fundViewModel.register("ablage", new GuiClient(setAblage));
}
//#endregion

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
				_fundViewModel.setAblage(GetSelectedAblage());
				setAblage(_fundViewModel.getAblage());
				$(this).dialog("close");
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
				_fundViewModel.setKontext(GetSelectedKontext());
				setKontext(_fundViewModel.getKontext());
				$(this).dialog("close");
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

function GetIcon(type, state)
{
	return IconConfig.getCssClasses(type, state);
}

function SetFundJSON(fund)
{
	SetFundAttribute(fund.FundAttribute);
	$("#buttonAddFundAttribut").attr("disabled", false);
	
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
				_fundViewModel.delete();

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

//#region Bezeichnung
function setBezeichnung(bezeichnung)
{
	$("#textboxBeschriftung").val(bezeichnung);
}
//#endregion

//#region Fundattribute
function setFundAttribute(fundAttribute)
{
	$("#divFundAttribute div #divList").empty();

	$("#divFundAttribute div #divList").text(fundAttribute.length);
}
//#endregion

//#region Anzahl
function setAnzahl(anzahl)
{
	$("#textboxAnzahl").val(anzahl);
}
//#endregion

//#region Dimension1
function setDimension1(dimension1)
{
	$("#textboxDimension1").val(dimension1);
}
//#endregion

//#region Dimension2
function setDimension2(dimension2)
{
	$("#textboxDimension2").val(dimension2);
}
//#endregion

//#region Dimension3
function setDimension3(dimension3)
{
	$("#textboxDimension3").val(dimension3);
}
//#endregion

//#region Masse
function setMasse(masse)
{
	$("#textboxMasse").val(masse);
}
//#endregion

//#region Ablage
function setAblage(ablage)
{
	$("#textboxSelectedAblage").val(ablage == null ? "" : ("/" + ablage.Path));
}
//#endregion

//#region Kontext
function setKontext(kontext)
{
	$("#textboxSelectedKontext").val(kontext == null ? "" : ("/" + kontext.Path));
}
//#endregion