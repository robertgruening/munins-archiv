var _viewModelFormAblage = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormAblage = viewModelFactory.getViewModelFormAblage();

	InitStatusChanged();

	InitFieldBezeichnung();
	InitFieldGuid();

	loadForm();
});

function getPageName() {
	return "AblagePrintLabel";
}

function loadForm() {
	console.info("loading form");

	if (getUrlParameterValue("Id")) {
		console.debug("Ablage is requested by ID", getUrlParameterValue("Id"));
		_viewModelFormAblage.load(getUrlParameterValue("Id"));
	}
	else {
		console.debug("there is no Ablage requested");
	}
}

function InitStatusChanged() {
	_viewModelFormAblage.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
}

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
	$("#labelBezeichnung").text(bezeichnung);
}
//#endregion

//#region GUID
function InitFieldGuid() {
	_viewModelFormAblage.register("guid", new GuiClient(setGuid, showErrorMessages));
}

function setGuid(guid) {
	console.info("setting value of 'GUID'");
	console.debug("GUID is ", guid);

	$("#divQrCodeGuid").empty();
	
	if (guid == null ||
		 guid == "")
	{
		return;
	}
	
	/**
	 * The GUID is 36 characters long.
	 * Using error correction level 'H'
	 * requires version 4 with 33x33 modules. 
	 */
	var modules = 33;
	var qrCodeLength = modules * 2;	
	
	$("#divQrCodeGuid").qrcode({
		text: guid
	});
}
//#endregion
//#endregion