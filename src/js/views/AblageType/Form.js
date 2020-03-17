var _viewModelFormAblageType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormAblageType = viewModelFactory.getViewModelFormAblageType();

	InitStatusChanged();
	InitDataChanged();
    InitBreadcrumb();
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
	_viewModelFormAblageType.register("create", new GuiClient(showMessageCreated, showErrorMessages));
	_viewModelFormAblageType.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormAblageType.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function InitDataChanged() {
	_viewModelFormAblageType.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
}

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : getPageName()
	});
}

//#region messages
function showMessageLoaded(element) {
	showInformationMessageBox("Ablagetyp \"" + element.Bezeichnung + "\" geladen");
}

function showMessageCreated(element) {
	showSuccessMessageBox("Ablagetyp \"" + element.Bezeichnung + "\" erzeugt");
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
	$("#buttonNew").click(openFormNewElement);
}

function EnableButtonNew() {
	$("#buttonNew").removeClass("disabled");
	$("#buttonNew").prop("disabled", false);
}

function DisableButtonNew() {
	$("#buttonNew").addClass("disabled");
	$("#buttonNew").prop("disabled", true);
}
//#endregion

//#region save
function InitButtonSave() {
	EnableButtonSave();
	$("#buttonSave").click(function () { _viewModelFormAblageType.save(); });
}

function EnableButtonSave() {
	$("#buttonSave").removeClass("disabled");
	$("#buttonSave").prop("disabled", false);
}

function DisableButtonSave() {
	$("#buttonSave").addClass("disabled");
	$("#buttonSave").prop("disabled", true);
}
//#endregion

//#region delete
function InitButtonDelete() {
	DisableButtonDelete();
	$("#buttonDelete").click(ShowDialogDelete);
}

function EnableButtonDelete() {
	$("#buttonDelete").removeClass("disabled");
	$("#buttonDelete").prop("disabled", false);
}

function DisableButtonDelete() {
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
		width: 750,
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
	_viewModelFormAblageType.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormAblageType.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
	$("#buttonUndo").click(function () {
        console.log("button 'undo' clicked");
		_viewModelFormAblageType.undoAllChanges();
	});
}

function EnableButtonUndo() {
	$("#buttonUndo").removeClass("disabled");
	$("#buttonUndo").prop("disabled", false);
}

function DisableButtonUndo() {
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
	$("#buttonToList").attr("href", "/Munins Archiv/src/pages/AblageType/List.html", "_self");
}

function EnableButtonToList() {
	$("#buttonToList").removeClass("disabled");
	$("#buttonToList").prop("disabled", false);
}

function DisableButtonToList() {
	$("#buttonToList").addClass("disabled");
	$("#buttonToList").prop("disabled", true);
}
//#endregion
//#endregion
