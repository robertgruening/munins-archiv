var _viewModelFormOrt = null;
var _viewModelListOrtType = null;
var _viewModelListOrtCategory = null;
var _semaphore = 0;

function increaseSemaphore()
{
	_semaphore++;
}

function decreaseSemaphore()
{
	_semaphore--;
}

function isSemaphoreResetted()
{
	return _semaphore <= 0;
}

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormOrt = viewModelFactory.getViewModelFormOrt();
	_viewModelListOrtType = viewModelFactory.getViewModelListOrtType();
	_viewModelListOrtCategory = viewModelFactory.getViewModelListOrtCategory();

	increaseSemaphore();
	increaseSemaphore();

	InitStatusChanged();
	InitButtonNew();
	InitButtonSave();
	InitButtonDelete();
	InitButtonUndo();
	InitButtonToOverview();

	InitFieldId();
	InitFieldType();
	InitFieldCategory();
	InitFieldBezeichnung();
	InitFieldPath();
	InitFieldCountOfChildren();
	InitFieldCountOfKontexte();
});

function getPageName() {
	if (getFormMode() == "create") {
		return "OrtFormNew";
	}
	else if (getFormMode() == "edit") {
		return "OrtFormEdit";
    }
}

function loadForm() {
	if (!isSemaphoreResetted())
	{
		return;
	}	
	
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

function loadCreatedElement(element) {
	window.open(window.location.href.replace(window.location.search, "") + "?Id=" + element.Id, "_self");
}

//#region messages
function showMessageParentSet() {
	showInformationMessageBox("übergeordneten Ort gesetzt");
}

function showMessageLoaded(element) {
	showSuccessMessageBox("Ort \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") geladen");
}

function showMessageSaved(element) {
	showSuccessMessageBox("Ort \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gespeichert");
}

function showMessageDeleted(element) {
	showSuccessMessageBox("Ort \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gelöscht");
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

		if ($("#selectType").val() == undefined ||
			 $("#selectType").val() == null ||
			 $("#selectType").val().length == 0)
		{
			_viewModelFormOrt.setType(null);
			return;
		}

		var ortType = new OrtType();
		ortType.Id = $("#selectType").val();
		ortType.Bezeichnung = $("#selectType option:selected").text();

		_viewModelFormOrt.setType(ortType);
	});
}

function fillSelectionOrtType(ortTypes) {
	console.info("setting values of field 'Ort type'");
	console.debug("values of 'Ort type'", ortTypes);
	$("#selectType").empty();
	$("#selectType").append("<option value='' >Bitte wählen</option>");

	ortTypes.forEach(ortType => {
		$("#selectType").append("<option value=" + ortType.Id + ">" + ortType.Bezeichnung + "</option>");
	});

	decreaseSemaphore();
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

//#region Category
function InitFieldCategory() {
	console.info("initialising field 'Ort category'");

	_viewModelFormOrt.register("category", new GuiClient(setCategory, showMessagesCategory));

	_viewModelListOrtCategory.register("loadAll", new GuiClient(fillSelectionOrtCategory, showMessagesCategory));
	_viewModelListOrtCategory.loadAll();

	$("#selectCategory").change(function () {

		if ($("#selectCategory").val() == undefined ||
			 $("#selectCategory").val() == null ||
			 $("#selectCategory").val().length == 0)
		{
			_viewModelFormOrt.setCategory(null);
			return;
		}

		var ortCategory = new OrtCategory();
		ortCategory.Id = $("#selectCategory").val();
		ortCategory.Bezeichnung = $("#selectCategory option:selected").text();

		_viewModelFormOrt.setCategory(ortCategory);
	});
}

function fillSelectionOrtCategory(ortCategories) {
	console.info("setting values of field 'Ort category'");
	console.debug("values of 'Ort category'", ortCategories);
	$("#selectCategory").empty();
	$("#selectCategory").append("<option value='' >Bitte wählen</option>");

	ortCategories.forEach(ortCategory => {
		$("#selectCategory").append("<option value=" + ortCategory.Id + ">" + ortCategory.Bezeichnung + "</option>");
	});

	decreaseSemaphore();
	loadForm();
}

function setCategory(category) {
	console.info("setting value of 'category'");
	console.debug("category is ", category);
	$("#selectCategory option[value='" + category.Id + "']").attr("selected","selected");
}

function showMessagesCategory(messages) {
	$("#divCategory .fieldValue div[name=messages]").text(messages);
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

//#region Anzahl von Kontexten
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
	_viewModelFormOrt.register("dataChanged", new GuiClient(EnableButtonSave, showErrorMessages));
	_viewModelFormOrt.register("dataResetted", new GuiClient(DisableButtonSave, showErrorMessages));
}

function EnableButtonSave() {
	$("#buttonSave").off("click");
	$("#buttonSave").click(function ()
	{
		ResetPropertiesMessages();
		_viewModelFormOrt.save();
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
		$("<p>").append("Möchten Sie diesen Ort löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
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
	_viewModelFormOrt.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
	_viewModelFormOrt.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormOrt.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
}

function EnableButtonUndo() {
	$("#buttonUndo").off("click");
	$("#buttonUndo").click(function () {
		console.log("button 'undo' clicked");
		_viewModelFormOrt.undoAllChanges();
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
	_viewModelFormOrt.register("parent", new GuiClient(EnableButtonToOverview, showErrorMessages));
}

function EnableButtonToOverview(parent) {
	if (parent === undefined ||
		parent === null ||
		parent.Id === undefined) {

			$("#buttonToOverview").attr("href", "/pages/Ort/Explorer.html", "_self");
		}
		else {
			$("#buttonToOverview").attr("href", "/pages/Ort/Explorer.html?Id=" + parent.Id, "_self");
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
