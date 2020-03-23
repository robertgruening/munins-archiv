var _viewModelFormOrtType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormOrtType = viewModelFactory.getViewModelFormOrtType();

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
	InitFieldCountOfOrten();

	if (getUrlParameterValue("Id")) {
		_viewModelFormOrtType.load(getUrlParameterValue("Id"));
	}
	else {
		_viewModelFormOrtType.updateAllListeners();
	}
});

function getPageName() {
	if (getFormMode() == "create") {
		return "OrtTypeFormNew";
	}
	else if (getFormMode() == "edit") {
		return "OrtTypeFormEdit";
    }
}

function InitStatusChanged() {
	_viewModelFormOrtType.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
	_viewModelFormOrtType.register("create", new GuiClient(showMessageCreated, showErrorMessages));
	_viewModelFormOrtType.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormOrtType.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : getPageName()
	});
}

//#region messages
function showMessageLoaded(element) {
    showInformationMessageBox("Ortstyp \"" + element.Bezeichnung + "\" geladen");
}

function showMessageCreated(element) {
    showSuccessMessageBox("Ortstyp \"" + element.Bezeichnung + "\" erzeugt");
}

function showMessageSaved(element) {
    showSuccessMessageBox("Ortstyp \"" + element.Bezeichnung + "\" gespeichert");
}

function showMessageDeleted(element) {
    showSuccessMessageBox("Ortstyp \"" + element.Bezeichnung + "\" gelöscht");
}
//#endregion

//#region form fields

//#region Id
function InitFieldId() {
	_viewModelFormOrtType.register("id", new GuiClient(setId, showErrorMessages));
}

function setId(id) {
	if (id == null) {
		document.title = "Ortstyp";
		DisableButtonDelete();
	}
	else {
		document.title = "Ortstyp: (" + id + ")";
		EnableButtonDelete();
	}
}
//#endregion

//#region Icon
function InitFieldIcon() {
	_viewModelFormOrtType.register("bezeichnung", new GuiClient(setIcon, null));
}

function setIcon(bezeichnung) {
	console.log("setting value of 'Icon' to " + IconConfig.getCssClasses("Ort"));
	$("#icon").addClass(IconConfig.getCssClasses("Ort"));
}
//#endregion

//#region Bezeichnung
function InitFieldBezeichnung() {
	_viewModelFormOrtType.register("bezeichnung", new GuiClient(setBezeichnung, showMessagesBezeichnung));
	$("#textboxBezeichnung").change(function () {
		_viewModelFormOrtType.setBezeichnung($("#textboxBezeichnung").val())
	});
}

function setBezeichnung(bezeichnung) {
	console.log("setting value of 'Bezeichnung' to " + bezeichnung);
	$("#textboxBezeichnung").val(bezeichnung);
}

function showMessagesBezeichnung(messages) {
	$("#divBezeichnung .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Anzahl von Orten
function InitFieldCountOfOrten() {
	_viewModelFormOrtType.register("countOfOrten", new GuiClient(setCountOfOrten, null));
}

function setCountOfOrten(countOfOrten) {
	console.log("setting value of 'count of Orten' to " + countOfOrten);
	$("#labelCountOfOrten").text(countOfOrten);
}
//#endregion
//#endregion

//#region form actions
//#region new
function InitButtonNew() {
	EnableButtonNew();
}

function EnableButtonNew() {
	$("#buttonNew").off("click");
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
	_viewModelFormOrtType.register("dataChanged", new GuiClient(EnableButtonSave, showErrorMessages));
	_viewModelFormOrtType.register("dataResetted", new GuiClient(DisableButtonSave, showErrorMessages));
}

function EnableButtonSave() {
	$("#buttonSave").off("click");
	$("#buttonSave").click(function ()
	{
		ResetPropertiesMessages();
		_viewModelFormOrtType.save();
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
	$("#buttonDelete").off("click");
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
		$("<p>").append("Möchten Sie diesen Ortstyp löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelFormOrtType.delete();

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
	_viewModelFormOrtType.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
	_viewModelFormOrtType.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormOrtType.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
}

function EnableButtonUndo() {
	$("#buttonUndo").off("click");
	$("#buttonUndo").click(function () {
		console.log("button 'undo' clicked");
		_viewModelFormOrtType.undoAllChanges();
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
	$("#buttonToList").off("click");
	$("#buttonToList").click( function() {
        console.log("button 'to list' clicked");
		window.open("/Munins Archiv/src/pages/OrtType/List.html", "_self");
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
