var _fundViewModel = new FundViewModel(new WebServiceClientFund());
_fundViewModel.init();

$(document).ready(function() {
	InitStatusChanged();
	InitDataChanged();
	InitBreadcrumb();
	InitButtonNew();
	InitButtonSave();
	InitButtonDelete();
	InitButtonUndo();
	InitButtonSelectFundAttribut();
	InitButtonSelectKontext();
	InitButtonSelectAblage();

	InitFieldId();
	InitFieldBeschriftung();
	InitFieldFundattribute();
	InitFieldAnzahl();
	InitFieldDimension1();
	InitFieldDimension2();
	InitFiledDimension3();
	InitFieldMasse();
	InitFieldAblage();
	InitFieldKontext();
		
	if (getUrlParameterValue("Id"))
	{
		_fundViewModel.load(getUrlParameterValue("Id"));
	}
	else
	{
		_fundViewModel.updateAllListeners();
	}
});

function InitStatusChanged()
{
	_fundViewModel.register("load", new GuiClient(showActionBannerLoaded, showMessages));
	_fundViewModel.register("create", new GuiClient(showActionBannerCreated, showMessages));
	_fundViewModel.register("save", new GuiClient(showActionBannerSaved, showMessages));
	_fundViewModel.register("delete", new GuiClient(showActionBannerDeleted, showMessages));
}

function InitDataChanged()
{
	_fundViewModel.register("dataChanged", new GuiClient(EnableButtonUndo, showMessages));
}

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

//#region form actions
//#region new
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

//#region save
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

//#region delete
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

function ShowDialogDelete()
{
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
//#endregion

//#region undo
function InitButtonUndo()
{
	DisableButtonUndo();
	_fundViewModel.register("dataResetted", new GuiClient(DisableButtonUndo, showMessages));
	$("#buttonUndo").click(function(){_fundViewModel.undoAllChanges();});
}

function EnableButtonUndo()
{
	$("#buttonUndo").removeClass("disabled");
	$("#buttonUndo").prop("disabled", false);
}

function DisableButtonUndo()
{
	$("#buttonUndo").removeClass("disabled");
	$("#buttonUndo").prop("disabled", true);
}
//#endregion
//#endregion

function GetIcon(type, state)
{
	return IconConfig.getCssClasses(type, state);
}

//#region Id
function InitFieldId()
{
	_fundViewModel.register("id", new GuiClient(setId, showMessages));
}

function setId(id)
{
	if (id == null)
	{
		document.title = "Fund";
		DisableButtonDelete();
	}
	else
	{
		document.title = "Fund: (" + id + ")";
		EnableButtonDelete();
	}
}
//#endregion

//#region Bezeichnung
function InitFieldBeschriftung()
{
	_fundViewModel.register("bezeichnung", new GuiClient(setBezeichnung, showMessages));
	$("#textboxBeschriftung").change(function() {
		_fundViewModel.setBezeichnung($("#textboxBeschriftung").val())
	});
}

function setBezeichnung(bezeichnung)
{
	$("#textboxBeschriftung").val(bezeichnung);
}
//#endregion

//#region Fundattribute
function InitFieldFundattribute()
{
	_fundViewModel.register("fundAttribute", new GuiClient(setFundAttribute, showMessages));
}

function InitButtonSelectFundAttribut()
{
	$("#buttonAddFundAttribut").click(ShowFormSelectFundAttribut);
}

function ShowFormSelectFundAttribut()
{
	$("#dialogSelectFundAttribut").dialog({
		height: "auto",
		width: 750,
		title: "Fundattribut auswählen",
		modal: true,
		resizable: false,
		buttons: {
			"Speichern": function()
			{
				_fundViewModel.addFundAttribut(GetSelectedFundAttribut());				
				$(this).dialog("close");
			},
			"Abbrechen": function()
			{
				$(this).dialog("close");
			}
		}
	});

	$("#treeSelectFundAttribut").jstree(true).refresh();

	$("#dialogSelectFundAttribut").dialog("open");
}

function setFundAttribute(fundAttribute)
{
	$("#divFundAttribute div #divList").empty();
	$("#divFundAttribute div #divList").append($("<ul>"));

	fundAttribute.forEach(fundAttribut => {
		var li = $("<li>");
		var linkFundAttribut = $("<a>");
		linkFundAttribut.attr("title", "gehe zu");
		linkFundAttribut.attr("href", "../FundAttribut/Explorer.html?Id=" + fundAttribut.Id);
		linkFundAttribut.text("/" + fundAttribut.Path);
		li.append(linkFundAttribut);
		
		var linkButtonDelete = $("<a>");
		linkButtonDelete.attr("title", "löschen");
		linkButtonDelete.attr("class", "linkButton riskyAction");
		linkButtonDelete.attr("href", "javascript:removeFundAttribut("+fundAttribut.Id+");");

		var icon = $("<i>");
		icon.attr("class", "fas fa-trash-alt");
		linkButtonDelete.append(icon);		
		li.append(linkButtonDelete);


		$("#divFundAttribute div #divList ul").append(li);
	});
}

function removeFundAttribut(fundAttributId)
{
	var fundAttribut = new Object();
	fundAttribut.Id = fundAttributId;

	_fundViewModel.removeFundAttribut(fundAttribut);
}
//#endregion

//#region Anzahl
function InitFieldAnzahl()
{
	_fundViewModel.register("anzahl", new GuiClient(setAnzahl, showMessages));
	$("#textboxAnzahl").change(function() {
		_fundViewModel.setAnzahl($("#textboxAnzahl").val())
	});
}

function setAnzahl(anzahl)
{
	$("#textboxAnzahl").val(anzahl);
}
//#endregion

//#region Dimension1
function InitFieldDimension1()
{
	_fundViewModel.register("dimension1", new GuiClient(setDimension1, showMessages));
	$("#textboxDimension1").change(function() {
		_fundViewModel.setDimension1($("#textboxDimension1").val())
	});
}

function setDimension1(dimension1)
{
	$("#textboxDimension1").val(dimension1);
}
//#endregion

//#region Dimension2
function InitFieldDimension2()
{
	_fundViewModel.register("dimension2", new GuiClient(setDimension2, showMessages));
	$("#textboxDimension2").change(function() {
		_fundViewModel.setDimension2($("#textboxDimension2").val())
	});
}

function setDimension2(dimension2)
{
	$("#textboxDimension2").val(dimension2);
}
//#endregion

//#region Dimension3
function InitFiledDimension3()
{
	_fundViewModel.register("dimension3", new GuiClient(setDimension3, showMessages));
	$("#textboxDimension3").change(function() {
		_fundViewModel.setDimension3($("#textboxDimension3").val())
	});
}

function setDimension3(dimension3)
{
	$("#textboxDimension3").val(dimension3);
}
//#endregion

//#region Masse
function InitFieldMasse()
{
	_fundViewModel.register("masse", new GuiClient(setMasse, showMessages));
	$("#textboxMasse").change(function() {
		_fundViewModel.setMasse($("#textboxMasse").val())
	});
}

function setMasse(masse)
{
	$("#textboxMasse").val(masse);
}
//#endregion

//#region Ablage
function InitFieldAblage()
{
	_fundViewModel.register("ablage", new GuiClient(setAblage, showMessages));
}

function InitButtonSelectAblage()
{
	$("#buttonSelectAblage").click(ShowFormSelectAblage);
}

function setAblage(ablage)
{
	if (ablage == null)
	{
		$("#linkSelectedAblage").text("");
		$("#linkSelectedAblage").attr("href", "");
	}
	else
	{
		$("#linkSelectedAblage").text("/" + ablage.Path);
		$("#linkSelectedAblage").attr("href", "../Ablage/Explorer.html?Id=" + ablage.Id);
	}
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
//#endregion

//#region Kontext
function InitFieldKontext()
{
	_fundViewModel.register("kontext", new GuiClient(setKontext, showMessages));
}

function InitButtonSelectKontext()
{
	$("#buttonSelectKontext").click(ShowFormSelectKontext);
}

function setKontext(kontext)
{
	if (kontext == null)
	{
		$("#linkSelectedKontext").text("");
		$("#linkSelectedKontext").attr("href", "");
	}
	else
	{
		$("#linkSelectedKontext").text("/" + kontext.Path);
		$("#linkSelectedKontext").attr("href", "../Kontext/Explorer.html?Id=" + kontext.Id);
	}
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
//#endregion

//#region actionBanner
function showActionBannerLoaded()
{
	$("#actionBanner").empty();
	$("#actionBanner").click(function()
	{
		$("#actionBanner").attr("clicked", "true");
		$("#actionBanner").stop().hide();
	});
	$("#actionBanner").mouseenter(function()
	{
		$("#actionBanner").stop();
		$("#actionBanner").fadeTo(0, 1);
	});
	$("#actionBanner").mouseleave(function()
	{
		if ($("#actionBanner").attr("clicked") == undefined ||			
			$("#actionBanner").attr("clicked") == "false")
		{
			$("#actionBanner").stop();
			$("#actionBanner").fadeTo(3000, 0, function()
			{
				$("#actionBanner").stop().hide();
			});
		}
	});
	$("#actionBanner").append("<p>Fund geladen</p>");
	$("#actionBanner").show("fade", {}, 500);
	$("#actionBanner").hide("fade", {}, 3000);
}

function showActionBannerCreated()
{
	$("#actionBanner").empty();
	$("#actionBanner").append("<p>Fund erzeugt</p>");
	$("#actionBanner").show("fade", {}, 500);
	$("#actionBanner").hide("fade", {}, 3000);
}

function showActionBannerSaved()
{
	$("#actionBanner").empty();
	$("#actionBanner").append("<p>Fund gespeichert</p>");
	$("#actionBanner").show("fade", {}, 500);
	$("#actionBanner").hide("fade", {}, 3000);
}

function showActionBannerDeleted()
{
	$("#actionBanner").empty();
	$("#actionBanner").append("<p>Fund gelöscht</p>");
	$("#actionBanner").show("fade", {}, 500);
	$("#actionBanner").hide("fade", {}, 3000);
}
//#endregion