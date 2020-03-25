var _viewModelFormAblageType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormAblageType = viewModelFactory.getViewModelFormAblageType();

	InitStatusChanged();
    InitButtonNew();
    InitButtonSave();
	InitButtonDelete();
	InitButtonUndo();
	InitButtonToList();

	InitFieldId();
	InitFieldIcon();
	InitFieldBezeichnung();
	InitFieldCountOfAblagen();

	if (getUrlParameterValue("Id")) {
		_viewModelFormAblageType.load(getUrlParameterValue("Id"));
	}
	else {
		_viewModelFormAblageType.updateAllListeners();
	}
});

function getPageName() {
	if (getFormMode() == "create") {
		return "AblageTypeFormNew";
	}
	else if (getFormMode() == "edit") {
		return "AblageTypeFormEdit";
	}
}

function InitStatusChanged() {
	_viewModelFormAblageType.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
	_viewModelFormAblageType.register("create", new GuiClient(loadCreatedElement, showErrorMessages));
	_viewModelFormAblageType.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormAblageType.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function loadCreatedElement(element) {
	window.open(window.location.href.replace(window.location.search, "") + "?Id=" + element.Id, "_self");
}

//#region messages
function showMessageLoaded(element) {
	showInformationMessageBox("Ablagetyp \"" + element.Bezeichnung + "\" geladen");
}

function showMessageSaved(element) {
	showSuccessMessageBox("Ablagetyp \"" + element.Bezeichnung + "\" gespeichert");
}

function showMessageDeleted(element) {
	showSuccessMessageBox("Ablagetyp \"" + element.Bezeichnung + "\" gelöscht");
}
//#endregion

//#region form fields

//#region Id
function InitFieldId() {
	_viewModelFormAblageType.register("id", new GuiClient(setId, showErrorMessages));
}

function setId(id) {
	if (id == null) {
		document.title = "Ablagetyp";
		DisableButtonDelete();
	}
	else {
		document.title = "Ablagetyp: (" + id + ")";
		EnableButtonDelete();
	}
}
//#endregion

//#region Icon
function InitFieldIcon() {
	_viewModelFormAblageType.register("bezeichnung", new GuiClient(setIcon, null));
}

function setIcon(bezeichnung) {
	console.log("setting value of 'Icon' to " + IconConfig.getCssClasses("Ablage"));
	$("#icon").addClass(IconConfig.getCssClasses("Ablage"));
}
//#endregion

//#region Bezeichnung
function InitFieldBezeichnung() {
	_viewModelFormAblageType.register("bezeichnung", new GuiClient(setBezeichnung, showMessagesBezeichnung));
	$("#textboxBezeichnung").change(function () {
		_viewModelFormAblageType.setBezeichnung($("#textboxBezeichnung").val())
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

//#region Anzahl von Ablagen
function InitFieldCountOfAblagen() {
	_viewModelFormAblageType.register("countOfAblagen", new GuiClient(setCountOfAblagen, null));
}

function setCountOfAblagen(countOfAblagen) {
	console.log("setting value of 'count of Ablagen' to " + countOfAblagen);
	$("#labelCountOfAblagen").text(countOfAblagen);
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
	_viewModelFormAblageType.register("dataChanged", new GuiClient(EnableButtonSave, showErrorMessages));
	_viewModelFormAblageType.register("dataResetted", new GuiClient(DisableButtonSave, showErrorMessages));
}

function EnableButtonSave() {
	$("#buttonSave").off("click");
	$("#buttonSave").click(function ()
	{
		ResetPropertiesMessages();
		_viewModelFormAblageType.save();
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
		$("<p>").append("Möchten Sie diesen Ablagetyp löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelFormAblageType.delete();

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
	_viewModelFormAblageType.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
	_viewModelFormAblageType.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormAblageType.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
}

function EnableButtonUndo() {
	$("#buttonUndo").off("click");
	$("#buttonUndo").click(function () {
		console.log("button 'undo' clicked");
		_viewModelFormAblageType.undoAllChanges();
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
	$("#buttonToList").attr("href", "/Munins Archiv/src/pages/AblageType/List.html", "_self");
	$("#buttonToList").removeClass("disabled");
	$("#buttonToList").prop("disabled", false);
}

function DisableButtonToList() {
	$("#buttonToList").removeAttr("href");
	$("#buttonToList").addClass("disabled");
	$("#buttonToList").prop("disabled", true);
}
//#endregion
//#endregion
