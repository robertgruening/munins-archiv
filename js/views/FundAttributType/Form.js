var _viewModelFormFundAttributType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormFundAttributType = viewModelFactory.getViewModelFormFundAttributType();

	InitStatusChanged();
    InitButtonNew();
    InitButtonSave();
	InitButtonDelete();
	InitButtonUndo();
	InitButtonToList();

	InitFieldId();
	InitFieldIcon();
	InitFieldBezeichnung();
	InitFieldCountOfFundAttribute();

	if (getUrlParameterValue("Id")) {
		_viewModelFormFundAttributType.load(getUrlParameterValue("Id"));
	}
	else {
		_viewModelFormFundAttributType.updateAllListeners();
	}
});

function getPageName() {
	if (getFormMode() == "create") {
		return "FundAttributTypeFormNew";
	}
	else if (getFormMode() == "edit") {
		return "FundAttributTypeFormEdit";
	}
}

function InitStatusChanged() {
	_viewModelFormFundAttributType.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
	_viewModelFormFundAttributType.register("create", new GuiClient(loadCreatedElement, showErrorMessages));
	_viewModelFormFundAttributType.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormFundAttributType.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function loadCreatedElement(element) {
	window.open(window.location.href.replace(window.location.search, "") + "?Id=" + element.Id, "_self");
}

//#region messages
function showMessageLoaded(element) {
    showInformationMessageBox("Fundattributtyp \"" + element.Bezeichnung + "\" geladen");
}

function showMessageSaved(element) {
    showSuccessMessageBox("Fundattributtyp \"" + element.Bezeichnung + "\" gespeichert");
}

function showMessageDeleted(element) {
    showSuccessMessageBox("Fundattributtyp \"" + element.Bezeichnung + "\" gelöscht");
}
//#endregion

//#region form fields

//#region Id
function InitFieldId() {
	_viewModelFormFundAttributType.register("id", new GuiClient(setId, showErrorMessages));
}

function setId(id) {
	if (id == null) {
		document.title = "Fundattributtyp";
		DisableButtonDelete();
	}
	else {
		document.title = "Fundattributtyp: (" + id + ")";
		EnableButtonDelete();
	}
}
//#endregion

//#region Icon
function InitFieldIcon() {
	_viewModelFormFundAttributType.register("bezeichnung", new GuiClient(setIcon, null));
}

function setIcon(bezeichnung) {
	console.log("setting value of 'Icon' to " + IconConfig.getCssClasses("FundAttribut"));
	$("#icon").addClass(IconConfig.getCssClasses("FundAttribut"));
}
//#endregion

//#region Bezeichnung
function InitFieldBezeichnung() {
	_viewModelFormFundAttributType.register("bezeichnung", new GuiClient(setBezeichnung, showMessagesBezeichnung));
	$("#textboxBezeichnung").change(function () {
		_viewModelFormFundAttributType.setBezeichnung($("#textboxBezeichnung").val())
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

//#region Anzahl von Fundattributen
function InitFieldCountOfFundAttribute() {
	_viewModelFormFundAttributType.register("countOfFundAttributen", new GuiClient(setCountOfFundAttributen, null));
}

function setCountOfFundAttributen(countOfFundAttributen) {
	console.log("setting value of 'count of FundAttribute' to " + countOfFundAttributen);
	$("#labelCountOfFundAttributen").text(countOfFundAttributen);
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
	_viewModelFormFundAttributType.register("dataChanged", new GuiClient(EnableButtonSave, showErrorMessages));
	_viewModelFormFundAttributType.register("dataResetted", new GuiClient(DisableButtonSave, showErrorMessages));
}

function EnableButtonSave() {
	$("#buttonSave").off("click");
	$("#buttonSave").click(function ()
	{
		ResetPropertiesMessages();
		_viewModelFormFundAttributType.save();
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
		$("<p>").append("Möchten Sie diesen Fundattributtyp löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelFormFundAttributType.delete();

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
	_viewModelFormFundAttributType.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
	_viewModelFormFundAttributType.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormFundAttributType.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
}

function EnableButtonUndo() {
	$("#buttonUndo").off("click");
	$("#buttonUndo").click(function () {
		console.log("button 'undo' clicked");
		_viewModelFormFundAttributType.undoAllChanges();
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
		window.open("/pages/FundAttributType/List.html", "_self");
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
