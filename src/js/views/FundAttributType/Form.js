var _viewModelFormFundAttributType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormFundAttributType = viewModelFactory.getViewModelFormFundAttributType();

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
	_viewModelFormFundAttributType.register("create", new GuiClient(showMessageCreated, showErrorMessages));
	_viewModelFormFundAttributType.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormFundAttributType.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function InitDataChanged() {
	_viewModelFormFundAttributType.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
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
        text: "Fundattributtyp \"" + element.Bezeichnung + "\" geladen",
        icon: "info"
    });
}

function showMessageCreated(element) {
    $.toast({
        heading: "Information",
        text: "Fundattributtyp \"" + element.Bezeichnung + "\" erzeugt",
        icon: "success"
    });
}

function showMessageSaved(element) {
    $.toast({
        heading: "Information",
        text: "Fundattributtyp \"" + element.Bezeichnung + "\" gespeichert",
        icon: "success"
    });
}

function showMessageDeleted(element) {
    $.toast({
        heading: "Information",
        text: "Fundattributtyp \"" + element.Bezeichnung + "\" gelöscht",
        icon: "success"
    });
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
	$("#buttonSave").click(function () { _viewModelFormFundAttributType.save(); });
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
		$("<p>").append("Möchten Sie diesen Fundattributtyp löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		width: 750,
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
	_viewModelFormFundAttributType.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormFundAttributType.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
	$("#buttonUndo").click(function () {
        console.log("button 'undo' clicked");
		_viewModelFormFundAttributType.undoAllChanges();
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
		window.open("/Munins Archiv/src/pages/FundAttributType/List.html", "_self");
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
