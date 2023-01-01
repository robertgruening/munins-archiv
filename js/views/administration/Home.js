$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	$("#defectiveAblagen").DefectiveAblagen();
	$("#defectiveKontexte").DefectiveKontexte();
	$("#lastFiveFunde").LastFiveFunde();
});

function getPageName() {
	return "Home";
}

//#region form actions
//#endregion
