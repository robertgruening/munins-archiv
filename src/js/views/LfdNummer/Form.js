var _viewModelFormLfdNummer = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormLfdNummer = viewModelFactory.getViewModelFormLfdNummer();

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

function InitDataChanged() {
	_viewModelFormLfdNummer.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
}

function InitBreadcrumb()
{
	$("#breadcrumb").Breadcrumb({
		PageName : getPageName()
	});
}

//#region messages
function showMessageLoaded(element) {
    $.toast({
        heading: "Information",
        text: "LfD-Nummer \"" + element.Bezeichnung + "\" geladen",
        icon: "info"
    });
}

function showMessageCreated(element) {
    $.toast({
        heading: "Information",
        text: "LfD-Nummer \"" + element.Bezeichnung + "\" erzeugt",
        icon: "success"
    });
}

function showMessageSaved(element) {
    $.toast({
        heading: "Information",
        text: "LfD-Nummer \"" + element.Bezeichnung + "\" gespeichert",
        icon: "success"
    });
}

function showMessageDeleted(element) {
    $.toast({
        heading: "Information",
        text: "LfD-Nummer \"" + element.Bezeichnung + "\" gelöscht",
        icon: "success"
    });
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
	$("#buttonSave").click(function () { _viewModelFormLfdNummer.save(); });
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
	_viewModelFormLfdNummer.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormLfdNummer.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
	$("#buttonUndo").click(function () {
        console.log("button 'undo' clicked");
		_viewModelFormLfdNummer.undoAllChanges();
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
		window.open("/Munins Archiv/src/pages/LfdNummer/List.html", "_self");
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
