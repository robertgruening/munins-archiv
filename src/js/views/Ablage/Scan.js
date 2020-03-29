var _viewModelFormAblage = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormAblage = viewModelFactory.getViewModelFormAblage();

	InitButtonScan();

	InitFieldId();
});

function getPageName() {
	return "AblageScan";
}

//#region form actions
//#region scan
function InitButtonScan() {
	$("#buttonScan").click(scanQrCode);
}
//#endregion
//#endregion

function scanQrCode() {
	
}