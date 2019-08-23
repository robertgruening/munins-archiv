var _viewModelFormOrt = null;
var _viewModelListOrtType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormOrt = viewModelFactory.getViewModelFormOrt();
	_viewModelListOrtType = viewModelFactory.getViewModelListOrtType();

	InitStatusChanged();
	InitDataChanged();
    InitBreadcrumb();
    InitButtonNew();
    InitButtonSave();
	InitButtonDelete();
	InitButtonUndo();
	InitButtonToOverview();

	InitFieldId();
	InitFieldType();
	InitFieldBezeichnung();
	InitFieldPath();
	InitFieldCountOfChildren();
	InitFieldCountOfKontexte();
});

function loadForm() {
	console.info("loading form");

	if (getUrlParameterValue("Id")) {
		console.debug("Ort is requested by ID", getUrlParameterValue("Id"));
		_viewModelFormOrt.load(getUrlParameterValue("Id"));
	}
	else if (getUrlParameterValue("Parent_Id")) {
		console.debug("creation of a new Ort is requested with parent ID", getUrlParameterValue("Parent_Id"));
		var parent = new Ort();
		parent.Id = getUrlParameterValue("Parent_Id");
		
		_viewModelFormOrt.setParent(parent);
		showMessageParentSet();
		_viewModelFormOrt.updateAllListeners();
	}
	else {
		console.debug("there is no Ort requested");
		_viewModelFormOrt.updateAllListeners();
	}
}

function InitStatusChanged() {
	_viewModelFormOrt.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
	_viewModelFormOrt.register("create", new GuiClient(loadCreatedElement, showErrorMessages));
	_viewModelFormOrt.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormOrt.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function InitDataChanged() {
	_viewModelFormOrt.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
}

function InitBreadcrumb()
{
	if (getFormMode() == "create") {
		$("#breadcrumb").Breadcrumb({
			PageName: "OrtFormNew"
		});
	}
	else if (getFormMode() == "edit") {
		$("#breadcrumb").Breadcrumb({
			PageName: "OrtFormEdit"
		});
    }
}

function loadCreatedElement(element) {
	window.open(window.location.href.replace(window.location.search, "") + "?Id=" + element.Id, "_self");
}

//#region messages
function showMessageParentSet() {
	$.toast({
        heading: "Information",
        text: "übergeordneten Ort gesetzt",
        icon: "info"
    });
}

function showMessageLoaded(element) {
    $.toast({
        heading: "Information",
        text: "Ort \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") geladen",
        icon: "success"
    });
}

function showMessageSaved(element) {
    $.toast({
        heading: "Information",
        text: "Ort \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gespeichert",
        icon: "success"
    });
}

function showMessageDeleted(element) {
    $.toast({
        heading: "Information",
        text: "Ort \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gelöscht",
        icon: "success"
    });
}
//#endregion

//#region form fields

//#region Id
function InitFieldId() {
	_viewModelFormOrt.register("id", new GuiClient(setId, showErrorMessages));
}

function setId(id) {
	if (id == null) {
		document.title = "Ort";
		DisableButtonDelete();
	}
	else {
		document.title = "Ort: (" + id + ")";
		EnableButtonDelete();
	}
}
//#endregion

//#region Type
function InitFieldType() {
	console.info("initialising field 'Ort type'");

	_viewModelFormOrt.register("type", new GuiClient(setType, showMessagesType));

	_viewModelListOrtType.register("loadAll", new GuiClient(fillSelectionOrtType, showMessagesType));
	_viewModelListOrtType.loadAll();

	$("#selectType").change(function () {
		var ortType = new OrtType();
		ortType.Id = $("#selectType").val();

		_viewModelFormOrt.setType(ortType);
	});
}

function fillSelectionOrtType(ortTypes) {
	console.info("setting values of field 'Ort type'");
	console.debug("values of 'Ort type'", ortTypes);
	$("#selectType").empty();

	ortTypes.forEach(ortType => {
		$("#selectType").append("<option value=" + ortType.Id + ">" + ortType.Bezeichnung + "</option>");
	});

	loadForm();
}

function setType(type) {
	console.info("setting value of 'type'");
	console.debug("type is ", type);
	$("#selectType option[value='" + type.Id + "']").attr("selected","selected");
}

function showMessagesType(messages) {
	$("#divType .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Bezeichnung
function InitFieldBezeichnung() {
	_viewModelFormOrt.register("bezeichnung", new GuiClient(setBezeichnung, showMessagesBezeichnung));
	$("#textboxBezeichnung").change(function () {
		_viewModelFormOrt.setBezeichnung($("#textboxBezeichnung").val())
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

//#region Path
function InitFieldPath() {
	_viewModelFormOrt.register("path", new GuiClient(setPath, null));
}

function setPath(path) {
	console.info("setting value of 'Path'");
	console.debug("'Path' is", path);

	if (!path.startsWith("/")) {
		console.warn("added '/' to path");
		path = "/" + path;
	}

	$("#labelPath").text(path);
}
//#endregion

//#region Anzahl von Children
function InitFieldCountOfChildren() {
	_viewModelFormOrt.register("children", new GuiClient(setCountOfChildren, null));
}

function setCountOfChildren(children) {
	console.info("setting value of 'count of children'");
	console.debug("children are ", children);
	$("#labelCountOfChildren").text(children.length);
}
//#endregion

//#region Anzahl von Kontexte
function InitFieldCountOfKontexte() {
	_viewModelFormOrt.register("countOfKontexte", new GuiClient(setCountOfKontexte, null));
}

function setCountOfKontexte(countOfKontexte) {
	console.info("setting value of 'count of Kontexte'");
	console.debug("count of Kontexte is ", countOfKontexte);
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
	$("#buttonSave").click(function () { _viewModelFormOrt.save(); });
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
		$("<p>").append("Möchten Sie diesen Ort löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		width: 750,
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelFormOrt.delete();

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
	_viewModelFormOrt.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormOrt.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
	$("#buttonUndo").click(function () { 
        console.log("button 'undo' clicked");
		_viewModelFormOrt.undoAllChanges(); 
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

//#region open overview
function InitButtonToOverview() {
	EnableButtonToOverview();
	_viewModelFormOrt.register("parent", new GuiClient(EnableButtonToOverview, showErrorMessages));
	$("#buttonToOverview").attr("href", "/Munins Archiv/src/Ort/Explorer.html", "_self");
}

function EnableButtonToOverview(parent) {
	if (parent === undefined ||
		parent === null || 
		parent.Id === undefined) {

		$("#buttonToOverview").attr("href", "/Munins Archiv/src/Ort/Explorer.html", "_self");
	}
	else {
		$("#buttonToOverview").attr("href", "/Munins Archiv/src/Ort/Explorer.html?Id=" + parent.Id, "_self");
	}

	$("#buttonToOverview").removeClass("disabled");
	$("#buttonToOverview").prop("disabled", false);
}

function DisableButtonToOverview() {
	$("#buttonToOverview").addClass("disabled");
	$("#buttonToOverview").prop("disabled", true);
}
//#endregion
//#endregion