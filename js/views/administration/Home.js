$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	$("#defectiveAblagen").DefectiveAblagen();
	$("#defectiveKontexte").DefectiveKontexte();
	$("#checkedFunde").CheckedFunde();
	$("#loginUsers").LoginUsers();
});

function getPageName() {
	return "Home";
}

//#region form actions
//#endregion
