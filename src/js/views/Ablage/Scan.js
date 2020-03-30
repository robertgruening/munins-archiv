var _viewModelFormAblage = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormAblage = viewModelFactory.getViewModelFormAblage();

	InitStatusChanged();
	InitButtonScan();
});

function getPageName() {
	return "AblageScan";
}

function InitStatusChanged() {
	_viewModelFormAblage.register("load", new GuiClient(openAblageFormPage, showErrorMessages));
}

//#region form actions
//#region scan
function InitButtonScan() {
	$("#buttonScan").click(function() {
		loadByGuid($("#textBoxGuid").val());
	});
}
//#endregion
//#endregion

function loadByGuid(guid) {
	_viewModelFormAblage.loadByGuid(guid);
}

function openAblageFormPage(element) {
	window.open("/Munins Archiv/src/pages/Ablage/Form.html?Id=" + element.Id, "_self");
}
