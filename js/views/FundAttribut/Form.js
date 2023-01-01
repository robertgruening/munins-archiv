var _viewModelFormFundAttribut = null;
var _viewModelListFundAttributType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormFundAttribut = viewModelFactory.getViewModelFormFundAttribut();
	_viewModelListFundAttributType = viewModelFactory.getViewModelListFundAttributType();

	InitStatusChanged();
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
	InitFieldCountOfFunde();
});

function getPageName() {
	if (getFormMode() == "create") {
		return "FundAttributFormNew";
	}
	else if (getFormMode() == "edit") {
		return "FundAttributFormEdit";
	}
}

function loadForm() {
	console.info("loading form");

	if (getUrlParameterValue("Id")) {
		console.debug("Fundattribut is requested by ID", getUrlParameterValue("Id"));
		_viewModelFormFundAttribut.load(getUrlParameterValue("Id"));
	}
	else if (getUrlParameterValue("Parent_Id")) {
		console.debug("creation of a new Fundattribut is requested with parent ID", getUrlParameterValue("Parent_Id"));
		var parent = new FundAttribut();
		parent.Id = getUrlParameterValue("Parent_Id");

		_viewModelFormFundAttribut.setParent(parent);
		showMessageParentSet();
		_viewModelFormFundAttribut.updateAllListeners();
	}
	else {
		console.debug("there is no Fundattribut requested");
		_viewModelFormFundAttribut.updateAllListeners();
	}
}

function InitStatusChanged() {
	_viewModelFormFundAttribut.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
	_viewModelFormFundAttribut.register("create", new GuiClient(loadCreatedElement, showErrorMessages));
	_viewModelFormFundAttribut.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormFundAttribut.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function loadCreatedElement(element) {
	window.open(window.location.href.replace(window.location.search, "") + "?Id=" + element.Id, "_self");
}

//#region messages
function showMessageParentSet() {
	showInformationMessageBox("übergeordnetes Fundattribut gesetzt");
}

function showMessageLoaded(element) {
	showSuccessMessageBox("Fundattribut \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") geladen");
}

function showMessageSaved(element) {
	showSuccessMessageBox("Fundattribut \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gespeichert");
}

function showMessageDeleted(element) {
	showSuccessMessageBox("Fundattribut \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gelöscht");
}
//#endregion

//#region form fields

//#region Id
function InitFieldId() {
	_viewModelFormFundAttribut.register("id", new GuiClient(setId, showErrorMessages));
}

function setId(id) {
	if (id == null) {
		document.title = "Fundattribut";
		DisableButtonDelete();
	}
	else {
		document.title = "Fundattribut: (" + id + ")";
		EnableButtonDelete();
	}
}
//#endregion

//#region Type
function InitFieldType() {
	console.info("initialising field 'Fundattribut type'");

	_viewModelFormFundAttribut.register("type", new GuiClient(setType, showMessagesType));

	_viewModelListFundAttributType.register("loadAll", new GuiClient(fillSelectionFundAttributType, showMessagesType));
	_viewModelListFundAttributType.loadAll();

	$("#selectType").change(function () {

		if ($("#selectType").val() == undefined ||
			 $("#selectType").val() == null ||
			 $("#selectType").val().length == 0)
		{
			_viewModelFormFundAttribut.setType(null);
			return;
		}

		var kontextType = new FundAttributType();
		kontextType.Id = $("#selectType").val();
		kontextType.Bezeichnung = $("#selectType option:selected").text();

		_viewModelFormFundAttribut.setType(kontextType);
	});
}

function fillSelectionFundAttributType(fundAttributTypes) {
	console.info("setting values of field 'Fundattribut type'");
	console.debug("values of 'Fundattribut type'", fundAttributTypes);
	$("#selectType").empty();
	$("#selectType").append("<option value='' >Bitte wählen</option>");

	fundAttributTypes.forEach(fundAttributType => {
		$("#selectType").append("<option value=" + fundAttributType.Id + ">" + fundAttributType.Bezeichnung + "</option>");
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
	_viewModelFormFundAttribut.register("bezeichnung", new GuiClient(setBezeichnung, showMessagesBezeichnung));
	$("#textboxBezeichnung").change(function () {
		_viewModelFormFundAttribut.setBezeichnung($("#textboxBezeichnung").val())
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
	_viewModelFormFundAttribut.register("path", new GuiClient(setPath, null));
}

function setPath(path) {
	console.info("setting value of 'Path'");
	console.debug("'Path' is", path);
	$("#labelPath").text(path);
}
//#endregion

//#region Anzahl von Children
function InitFieldCountOfChildren() {
	_viewModelFormFundAttribut.register("children", new GuiClient(setCountOfChildren, null));
}

function setCountOfChildren(children) {
	console.info("setting value of 'count of children'");
	console.debug("children are ", children);
	$("#labelCountOfChildren").text(children.length);
}
//#endregion

//#region Anzahl von Funde
function InitFieldCountOfFunde() {
	_viewModelFormFundAttribut.register("countOfFunde", new GuiClient(setCountOfFunde, null));
}

function setCountOfFunde(countOfFunde) {
	console.info("setting value of 'count of funde'");
	console.debug("Funde are ", countOfFunde);
	$("#labelCountOfFunde").text(countOfFunde);
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
	_viewModelFormFundAttribut.register("dataChanged", new GuiClient(EnableButtonSave, showErrorMessages));
	_viewModelFormFundAttribut.register("dataResetted", new GuiClient(DisableButtonSave, showErrorMessages));
}

function EnableButtonSave() {
	$("#buttonSave").off("click");
	$("#buttonSave").click(function ()
	{
		ResetPropertiesMessages();
		_viewModelFormFundAttribut.save();
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
		$("<p>").append("Möchten Sie dieses Fundattribut löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelFormFundAttribut.delete();

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
	_viewModelFormFundAttribut.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
	_viewModelFormFundAttribut.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormFundAttribut.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
}

function EnableButtonUndo() {
	$("#buttonUndo").off("click");
	$("#buttonUndo").click(function () {
		console.log("button 'undo' clicked");
		_viewModelFormFundAttribut.undoAllChanges();
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

//#region open overview
function InitButtonToOverview() {
	EnableButtonToOverview();
	_viewModelFormFundAttribut.register("parent", new GuiClient(EnableButtonToOverview, showErrorMessages));
}

function EnableButtonToOverview(parent) {
	if (parent === undefined ||
		parent === null ||
		parent.Id === undefined) {

			$("#buttonToOverview").attr("href", "/munins-archiv/pages/FundAttribut/Explorer.html", "_self");
		}
		else {
			$("#buttonToOverview").attr("href", "/munins-archiv/pages/FundAttribut/Explorer.html?Id=" + parent.Id, "_self");
		}

		$("#buttonToOverview").removeClass("disabled");
		$("#buttonToOverview").prop("disabled", false);
	}

	function DisableButtonToOverview() {
		$("#buttonToOverview").removeAttr("href");
		$("#buttonToOverview").addClass("disabled");
		$("#buttonToOverview").prop("disabled", true);
	}
	//#endregion
	//#endregion
