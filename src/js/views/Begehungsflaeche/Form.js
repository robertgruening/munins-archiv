var _viewModelFormBegehungsflaeche = null;
var _viewModelListKontextType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormBegehungsflaeche = viewModelFactory.getViewModelFormBegehungsflaeche();
	_viewModelListKontextType = viewModelFactory.getViewModelListKontextType();

	InitStatusChanged();
	InitDataChanged();
	InitBreadcrumb();
	InitButtonNew();
	InitButtonSave();
	InitButtonDelete();
	InitButtonUndo();
	InitButtonToOverview();
	InitButtonSelectLfdNummer();
	InitButtonSelectOrt();

	InitFieldId();
	InitFieldType();
	InitFieldBezeichnung();
	InitFieldPath();
	InitFieldCountOfChildren();
	InitFieldLfdNummern();
	InitFieldOrte();
});

function getPageName() {
	if (getFormMode() == "create") {
		return "BegehungsflaecheFormNew";
	}
	else if (getFormMode() == "edit") {
		return "BegehungsflaecheFormEdit";
	}
}

function loadForm() {
	console.info("loading form");

	if (getUrlParameterValue("Id")) {
		console.debug("Kontext is requested by ID", getUrlParameterValue("Id"));
		_viewModelFormBegehungsflaeche.load(getUrlParameterValue("Id"));
	}
	else if (getUrlParameterValue("Parent_Id")) {
		console.debug("creation of a new Kontext is requested with parent ID", getUrlParameterValue("Parent_Id"));
		var parent = new Kontext();
		parent.Id = getUrlParameterValue("Parent_Id");

		_viewModelFormBegehungsflaeche.setParent(parent);
		showMessageParentSet();
		_viewModelFormBegehungsflaeche.updateAllListeners();
	}
	else {
		console.debug("there is no Kontext requested");
		_viewModelFormBegehungsflaeche.updateAllListeners();
	}
}

function InitStatusChanged() {
	_viewModelFormBegehungsflaeche.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
	_viewModelFormBegehungsflaeche.register("create", new GuiClient(loadCreatedElement, showErrorMessages));
	_viewModelFormBegehungsflaeche.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormBegehungsflaeche.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function InitDataChanged() {
	_viewModelFormBegehungsflaeche.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
}

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : getPageName()
	});
}

function loadCreatedElement(element) {
	window.open(window.location.href.replace(window.location.search, "") + "?Id=" + element.Id, "_self");
}

//#region messages
function showMessageParentSet() {
	showInformationMessageBox("übergeordnete Kontext gesetzt");
}

function showMessageLoaded(element) {
	showSuccessMessageBox("Kontext \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") geladen");
}

function showMessageSaved(element) {
	showSuccessMessageBox("Kontext \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gespeichert");
}

function showMessageDeleted(element) {
	showSuccessMessageBox("Kontext \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gelöscht");
}
//#endregion

//#region form fields

//#region Id
function InitFieldId() {
	_viewModelFormBegehungsflaeche.register("id", new GuiClient(setId, showErrorMessages));
}

function setId(id) {
	if (id == null) {
		document.title = "Kontext";
		DisableButtonDelete();
	}
	else {
		document.title = "Kontext: (" + id + ")";
		EnableButtonDelete();
	}
}
//#endregion

//#region Type
function InitFieldType() {
	console.info("initialising field 'Kontext type'");

	_viewModelFormBegehungsflaeche.register("type", new GuiClient(setType, showMessagesType));

	_viewModelListKontextType.register("loadAll", new GuiClient(fillSelectionKontextType, showMessagesType));
	_viewModelListKontextType.loadAll();

	$("#selectType").change(function () {
		var kontextType = new KontextType();
		kontextType.Id = $("#selectType").val();

		_viewModelFormBegehungsflaeche.setType(kontextType);
	});
}

function fillSelectionKontextType(kontextTypes) {
	console.info("setting values of field 'Kontext type'");
	console.debug("values of 'Kontext type'", kontextTypes);
	$("#selectType").empty();
	$("#selectType").append("<option value='' >Bitte wählen</option>");

	kontextTypes.forEach(kontextType => {
		$("#selectType").append("<option value=" + kontextType.Id + ">" + kontextType.Bezeichnung + "</option>");
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
	_viewModelFormBegehungsflaeche.register("bezeichnung", new GuiClient(setBezeichnung, showMessagesBezeichnung));
	$("#textboxBezeichnung").change(function () {
		_viewModelFormBegehungsflaeche.setBezeichnung($("#textboxBezeichnung").val())
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
	_viewModelFormBegehungsflaeche.register("path", new GuiClient(setPath, null));
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
	_viewModelFormBegehungsflaeche.register("children", new GuiClient(setCountOfChildren, null));
}

function setCountOfChildren(children) {
	console.info("setting value of 'count of children'");
	console.debug("children are ", children);
	$("#labelCountOfChildren").text(children.length);
}
//#endregion

//#region LfD-Nummern
function InitFieldLfdNummern() {
	_viewModelFormBegehungsflaeche.register("lfdNummern", new GuiClient(setLfdNummern, showMessagesLfdNummern));
}

function InitButtonSelectLfdNummer() {
	$("#buttonSelectLfdNummer").click(ShowFormSelectLfdNummer);
}

function ShowFormSelectLfdNummer() {
	$("#dialogSelectLfdNummer").dialog({
		height: "auto",
		width: 750,
		title: "Lfd-Nummer auswählen",
		modal: true,
		resizable: false,
		buttons: {
			"Speichern": function () {
				_viewModelFormBegehungsflaeche.addLfdNummer(GetSelectedLfdNummerNode());
				$(this).dialog("close");
			},
			"Abbrechen": function () {
				$(this).dialog("close");
			}
		}
	});
	_webServiceClientLfdNummer.LoadAll("listSelect.loaded");
	$("#dialogSelectLfdNummer").dialog("open");
}

function setLfdNummern(lfdNummern) {
	console.info("setting value of 'LfdNummern'");
	console.debug("LfdNummern are ", lfdNummern);

	$("#divLfdNummern div #divList").empty();

	if (lfdNummern.length == 0) {
		return;
	}

	$("#divLfdNummern div #divList").append($("<ul>"));

	lfdNummern.forEach(lfdNummer => {
		var li = $("<li>");
		var labelLfdNummer = $("<label>");
		labelLfdNummer.text(lfdNummer.Bezeichnung);
		li.append(labelLfdNummer);

		var linkButtonDelete = $("<a>");
		linkButtonDelete.attr("title", "löschen");
		linkButtonDelete.attr("class", "linkButton riskyAction");
		linkButtonDelete.attr("href", "javascript:removeLfdNummer(" + lfdNummer.Id + ");");

		var icon = $("<i>");
		icon.attr("class", "fas fa-trash-alt");
		linkButtonDelete.append(icon);
		li.append(linkButtonDelete);


		$("#divLfdNummern div #divList ul").append(li);
	});
}

function removeLfdNummer(lfdNummerId) {
	var lfdNummer = new Object();
	lfdNummer.Id = lfdNummerId;

	_viewModelFormBegehungsflaeche.removeLfdNummer(lfdNummer);
}

function showMessagesLfdNummern(messages) {
	$("#divLfdNummern .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Orte
function InitFieldOrte() {
	_viewModelFormBegehungsflaeche.register("orte", new GuiClient(setOrte, showMessagesOrte));
}

function InitButtonSelectOrt() {
	$("#buttonAddOrt").click(ShowFormSelectOrt);
}

function ShowFormSelectOrt() {
	$("#dialogSelect").dialog({
		height: "auto",
		width: 750,
		title: "Ort auswählen",
		modal: true,
		resizable: false,
		buttons: {
			"Speichern": function () {
				_viewModelFormBegehungsflaeche.addOrt(getSelectedItem());
				$(this).dialog("close");
			},
			"Abbrechen": function () {
				$(this).dialog("close");
			}
		}
	});

	var viewModelFactory = new ViewModelFactory();
	var viewModelExplorer = viewModelFactory.getViewModelExplorerOrt();
	var iconCssClasses =  IconConfig.getCssClasses("Ort");
	initExplorerSelectTypedItem(viewModelExplorer, iconCssClasses);

	$("#dialogSelect").dialog("open");
}

function setOrte(orte) {
	$("#divOrte div #divList").empty();
	$("#divOrte div #divList").append($("<ul>"));

	orte.forEach(ort => {
		var li = $("<li>");
		var linkOrt = $("<a>");
		linkOrt.attr("title", "gehe zu");
		linkOrt.attr("href", "../../pages/Ort/Explorer.html?Id=" + ort.Id);
		linkOrt.text("/" + ort.Path);
		li.append(linkOrt);

		var linkButtonDelete = $("<a>");
		linkButtonDelete.attr("title", "löschen");
		linkButtonDelete.attr("class", "linkButton riskyAction");
		linkButtonDelete.attr("href", "javascript:removeOrt(" + ort.Id + ");");

		var icon = $("<i>");
		icon.attr("class", "fas fa-trash-alt");
		linkButtonDelete.append(icon);
		li.append(linkButtonDelete);


		$("#divOrte div #divList ul").append(li);
	});
}

function removeOrt(ortId) {
	var ort = new Object();
	ort.Id = ortId;

	_viewModelFormBegehungsflaeche.removeOrt(ort);
}

function showMessagesOrte(messages) {
	$("#divOrte .fieldValue div[name=messages]").text(messages);
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
	$("#buttonSave").click(function () { _viewModelFormBegehungsflaeche.save(); });
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
		$("<p>").append("Möchten Sie diese Kontext löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		width: 750,
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelFormBegehungsflaeche.delete();

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
	_viewModelFormBegehungsflaeche.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormBegehungsflaeche.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
	$("#buttonUndo").click(function () {
		console.log("button 'undo' clicked");
		_viewModelFormBegehungsflaeche.undoAllChanges();
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
	_viewModelFormBegehungsflaeche.register("parent", new GuiClient(EnableButtonToOverview, showErrorMessages));
	$("#buttonToOverview").attr("href", "/Munins Archiv/src/pages/Kontext/Explorer.html", "_self");
}

function EnableButtonToOverview(parent) {
	if (parent === undefined ||
		parent === null ||
		parent.Id === undefined) {

			$("#buttonToOverview").attr("href", "/Munins Archiv/src/pages/Kontext/Explorer.html", "_self");
		}
		else {
			$("#buttonToOverview").attr("href", "/Munins Archiv/src/pages/Kontext/Explorer.html?Id=" + parent.Id, "_self");
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
