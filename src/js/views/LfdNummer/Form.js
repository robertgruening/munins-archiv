var _viewModelFormLfdNummer = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormLfdNummer = viewModelFactory.getViewModelFormLfdNummer();

	InitStatusChanged();
    InitBreadcrumb();
    InitButtonNew();
    InitButtonSave();
	InitButtonDelete();
	InitButtonUndo();
	InitButtonToList();

	InitFieldId();
	InitFieldIcon();
	InitFieldBezeichnung();
	InitFieldCountOfKontexte();

	if (getUrlParameterValue("Id")) {
		_viewModelFormLfdNummer.load(getUrlParameterValue("Id"));
	}
	else {
		_viewModelFormLfdNummer.updateAllListeners();
	}
});

function getPageName() {
	if (getFormMode() == "create") {
		return "LfdNummerFormNew";
	}
	else if (getFormMode() == "edit") {
		return "LfdNummerFormEdit";
    }
}

function InitStatusChanged() {
	_viewModelFormLfdNummer.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
	_viewModelFormLfdNummer.register("create", new GuiClient(showMessageCreated, showErrorMessages));
	_viewModelFormLfdNummer.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormLfdNummer.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function InitBreadcrumb()
{
	$("#breadcrumb").Breadcrumb({
		PageName : getPageName()
	});
}

//#region messages
function showMessageLoaded(element) {
    showInformationMessageBox("LfD-Nummer \"" + element.Bezeichnung + "\" geladen");
}

function showMessageCreated(element) {
    showSuccessMessageBox("LfD-Nummer \"" + element.Bezeichnung + "\" erzeugt");
}

function showMessageSaved(element) {
    showSuccessMessageBox("LfD-Nummer \"" + element.Bezeichnung + "\" gespeichert");
}

function showMessageDeleted(element) {
    showSuccessMessageBox("LfD-Nummer \"" + element.Bezeichnung + "\" gelöscht");
}
//#endregion

//#region form fields

//#region Id
function InitFieldId() {
	_viewModelFormLfdNummer.register("id", new GuiClient(setId, showErrorMessages));
}

function setId(id) {
	if (id == null) {
		document.title = "LfD-Nummer";
		DisableButtonDelete();
	}
	else {
		document.title = "LfD-Nummer: (" + id + ")";
		EnableButtonDelete();
	}
}
//#endregion

//#region Icon
function InitFieldIcon() {
	_viewModelFormLfdNummer.register("bezeichnung", new GuiClient(setIcon, null));
}

function setIcon(bezeichnung) {
	console.log("setting value of 'Icon' to ", IconConfig.getCssClasses("LfD-Nummer"));
	$("#icon").addClass(IconConfig.getCssClasses("LfD-Nummer"));
}
//#endregion

//#region Bezeichnung
function InitFieldBezeichnung() {
	_viewModelFormLfdNummer.register("bezeichnung", new GuiClient(setBezeichnung, showMessagesBezeichnung));
	$("#textboxBezeichnung").change(function () {
		_viewModelFormLfdNummer.setBezeichnung($("#textboxBezeichnung").val())
	});
}

function setBezeichnung(bezeichnung) {
	console.log("setting value of 'Bezeichnung' to ", bezeichnung);
	$("#textboxBezeichnung").val(bezeichnung);
}

function showMessagesBezeichnung(messages) {
	$("#divBezeichnung .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Anzahl von Kontexten
function InitFieldCountOfKontexte() {
	_viewModelFormLfdNummer.register("countOfKontexte", new GuiClient(setCountOfKontexte, null));
}

function setCountOfKontexte(countOfKontexte) {
	console.log("setting value of 'count of Kontexte' to ", countOfKontexte);
	$("#labelCountOfKontexte").text(countOfKontexte);
}
//#endregion
//#endregion

//#region form actions
//#region new
function InitButtonNew() {
	EnableButtonNew();
}

function EnableButtonNew() {
	$("#buttonNew").click(openFormNewElement);
	$("#buttonNew").removeClass("disabled");
	$("#buttonNew").prop("disabled", false);
}

function DisableButtonNew() {
	$("#buttonNew").off("click");
	$("#buttonNew").addClass("disabled");
	$("#buttonNew").prop("disabled", true);
}
//#endregion

//#region save
function InitButtonSave() {
	DisableButtonSave();
	_viewModelFormLfdNummer.register("dataChanged", new GuiClient(EnableButtonSave, showErrorMessages));
	_viewModelFormLfdNummer.register("dataResetted", new GuiClient(DisableButtonSave, showErrorMessages));
}

function EnableButtonSave() {
	$("#buttonSave").click(function ()
	{
		ResetPropertiesMessages();
		_viewModelFormLfdNummer.save();
	});
	$("#buttonSave").removeClass("disabled");
	$("#buttonSave").prop("disabled", false);
}

function DisableButtonSave() {
	$("#buttonSave").off("click");
	$("#buttonSave").addClass("disabled");
	$("#buttonSave").prop("disabled", true);
}
//#endregion

//#region delete
function InitButtonDelete() {
	DisableButtonDelete();
}

function EnableButtonDelete() {
	$("#buttonDelete").click(ShowDialogDelete);
	$("#buttonDelete").removeClass("disabled");
	$("#buttonDelete").prop("disabled", false);
}

function DisableButtonDelete() {
	$("#buttonDelete").off("click");
	$("#buttonDelete").addClass("disabled");
	$("#buttonDelete").prop("disabled", true);
}

function ShowDialogDelete() {
	$("#dialogDelete").empty();
	$("#dialogDelete").append(
		$("<p>").append("Möchten Sie diese LfD-Nummer löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		width: 750,
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelFormLfdNummer.delete();

				$(this).dialog("close");
			},
			"Abbrechen": function () {
				$(this).dialog("close");
			}
		}
	});

	$("#DialogDelete").dialog("open");
}
//#endregion

//#region undo
function InitButtonUndo() {
	DisableButtonUndo();
	_viewModelFormLfdNummer.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
	_viewModelFormLfdNummer.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormLfdNummer.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
}

function EnableButtonUndo() {
	$("#buttonUndo").click(function () {
		console.log("button 'undo' clicked");
		_viewModelFormLfdNummer.undoAllChanges();
	});
	$("#buttonUndo").removeClass("disabled");
	$("#buttonUndo").prop("disabled", false);
}

function DisableButtonUndo() {
	$("#buttonUndo").off("click");
	$("#buttonUndo").addClass("disabled");
	$("#buttonUndo").prop("disabled", true);
}

function ResetPropertiesMessages() {
	$(".fieldValue div[name=messages]").empty();
}
//#endregion

//#region open list
function InitButtonToList() {
	EnableButtonToList();
}

function EnableButtonToList() {
	$("#buttonToList").click( function() {
        console.log("button 'to list' clicked");
		window.open("/Munins Archiv/src/pages/LfdNummer/List.html", "_self");
	});
	$("#buttonToList").removeClass("disabled");
	$("#buttonToList").prop("disabled", false);
}

function DisableButtonToList() {
	$("#buttonToList").off("click");
	$("#buttonToList").addClass("disabled");
	$("#buttonToList").prop("disabled", true);
}
//#endregion
//#endregion
