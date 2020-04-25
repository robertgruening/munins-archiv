var _viewModelFormAblage = null;
var _printLabelIndex = 0;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormAblage = viewModelFactory.getViewModelFormAblage();

	InitStatusChanged();
	InitButtonsSelectAblage();

	InitFieldBezeichnung();
	InitFieldGuid();
});

function getPageName() {
	return "AblagePrintLabels";
}

function InitStatusChanged() {
	_viewModelFormAblage.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
}

//#region button select Ablage
function InitButtonsSelectAblage() {
	$("#buttonSelectAblage0").click(function() {
		_printLabelIndex = 0;
		ShowFormSelectAblage();
	});
	$("#buttonSelectAblage1").click(function() {
		_printLabelIndex = 1;
		ShowFormSelectAblage();
	});
	$("#buttonSelectAblage2").click(function() {
		_printLabelIndex = 2;
		ShowFormSelectAblage();
	});
	$("#buttonSelectAblage3").click(function() {
		_printLabelIndex = 3;
		ShowFormSelectAblage();
	});
	$("#buttonSelectAblage4").click(function() {
		_printLabelIndex = 4;
		ShowFormSelectAblage();
	});
	$("#buttonSelectAblage5").click(function() {
		_printLabelIndex = 5;
		ShowFormSelectAblage();
	});
	$("#buttonSelectAblage6").click(function() {
		_printLabelIndex = 6;
		ShowFormSelectAblage();
	});
	$("#buttonSelectAblage7").click(function() {
		_printLabelIndex = 7;
		ShowFormSelectAblage();
	});
}

function ShowFormSelectAblage() {
	$("#dialogSelect").dialog({
		height: "auto",
		title: "Ablage auswählen",
		modal: true,
		buttons: {
			"Speichern": function () {
				_viewModelFormAblage.load(esti_getSelectedItem().Id);
				$(this).dialog("close");
			},
			"Abbrechen": function () {
				$(this).dialog("close");
			}
		}
	});

	var viewModelFactory = new ViewModelFactory();
	var viewModelExplorer = viewModelFactory.getViewModelExplorerAblage();
	var iconCssClasses =  IconConfig.getCssClasses("Ablage");
	esti_initExplorerSelectTypedItem($("#dialogSelect"), viewModelExplorer, iconCssClasses);

	$("#dialogSelect").dialog("open");
}
//#endregion

//#region messages
function showMessageLoaded(element) {
	showSuccessMessageBox("Ablage \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") geladen");
}
//#endregion

//#region form fields
//#region Bezeichnung
function InitFieldBezeichnung() {
	_viewModelFormAblage.register("bezeichnung", new GuiClient(setBezeichnung, showErrorMessages));
}

function setBezeichnung(bezeichnung) {
	console.log("setting value of 'Bezeichnung' to " + bezeichnung);
	$("#printLabel" + _printLabelIndex + " #labelBezeichnung").text(bezeichnung);
}
//#endregion

//#region GUID
function InitFieldGuid() {
	_viewModelFormAblage.register("guid", new GuiClient(setGuid, showErrorMessages));
}

function setGuid(guid) {
	console.info("setting value of 'GUID'");
	console.debug("GUID is ", guid);

	$("#printLabel" + _printLabelIndex + " #divQrCodeGuid").empty();
	
	if (guid == null ||
		 guid == "")
	{
		return;
	}
	
	$("#printLabel" + _printLabelIndex + " #divQrCodeGuid").qrcode({
		text: guid
	});
}
//#endregion
//#endregion