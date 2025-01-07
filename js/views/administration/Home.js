$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	$("#defectiveAblagen").DefectiveAblagen();
	$("#defectiveKontexte").DefectiveKontexte();
	$("#checkedFunde").CheckedFunde();
	$("#checkedAblagen").CheckedAblagen();
	$("#checkedKontexte").CheckedKontexte();
	$("#loginUsers").LoginUsers();
});

function getPageName() {
	return "Home";
}

//#region form actions
//#endregion
