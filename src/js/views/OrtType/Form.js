var _viewModelFormOrtType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormOrtType = viewModelFactory.getViewModelFormOrtType();

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
	InitFieldCountOfOrten();

	if (getUrlParameterValue("Id")) {
		_viewModelFormOrtType.load(getUrlParameterValue("Id"));
	}
	else {
		_viewModelFormOrtType.updateAllListeners();
	}
});

function InitStatusChanged() {
	_viewModelFormOrtType.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
	_viewModelFormOrtType.register("create", new GuiClient(showMessageCreated, showErrorMessages));
	_viewModelFormOrtType.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormOrtType.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function InitDataChanged() {
	_viewModelFormOrtType.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
}

function InitBreadcrumb()
{
	if (getFormMode() == "create") {
		$("#breadcrumb").Breadcrumb({
			PageName: "OrtTypeFormNew"
		});
	}
	else if (getFormMode() == "edit") {
		$("#breadcrumb").Breadcrumb({
			PageName: "OrtTypeFormEdit"
		});
    }
}

//#region messages
function showMessageLoaded(element) {
    $.toast({
        heading: "Information",
        text: "Ortstyp \"" + element.Bezeichnung + "\" geladen",
        icon: "info"
    });
}

function showMessageCreated(element) {
    $.toast({
        heading: "Information",
        text: "Ortstyp \"" + element.Bezeichnung + "\" erzeugt",
        icon: "success"
    });
}

function showMessageSaved(element) {
    $.toast({
        heading: "Information",
        text: "Ortstyp \"" + element.Bezeichnung + "\" gespeichert",
        icon: "success"
    });
}

function showMessageDeleted(element) {
    $.toast({
        heading: "Information",
        text: "Ortstyp \"" + element.Bezeichnung + "\" gelöscht",
        icon: "success"
    });
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
	$("#buttonSave").click(function () { _viewModelFormOrtType.save(); });
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
		$("<p>").append("Möchten Sie diesen Ortstyp löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		width: 750,
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
	_viewModelFormOrtType.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormOrtType.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
	$("#buttonUndo").click(function () { 
        console.log("button 'undo' clicked");
		_viewModelFormOrtType.undoAllChanges(); 
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
	$("#buttonToList").click( function() {
        console.log("button 'to list' clicked");
		window.open("/Munins Archiv/src/OrtType/List.html", "_self");
	});
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