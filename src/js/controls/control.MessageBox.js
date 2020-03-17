function showInformationMessageBox(message) {
	$.toast({
		heading: "Information",
		text: message,
		icon: "info"
	});
}

function showSuccessMessageBox(message) {
	$.toast({
		heading: "Information",
		text: message,
		icon: "success"
	});
}

function showWarningMessageBox(message) {
	$.toast({
		heading: "Warnung",
		text: message,
		hideAfter: false,
		icon: "warning"
	});
}

function showErrorMessage(message)
{
	$.toast({
		heading: "Fehler",
		text: message,
		hideAfter: false,
		icon: "error"
	});
}
