var _viewModelFormBegehungsflaeche = null;
var _viewModelListKontextType = null;
var _selectedLfdNummer = null;
var _selectedOrt = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormBegehungsflaeche = viewModelFactory.getViewModelFormBegehungsflaeche();
	_viewModelListKontextType = viewModelFactory.getViewModelListKontextType();

	InitStatusChanged();
	InitButtonNew();
	InitButtonSave();
	InitButtonDelete();
	InitButtonUndo();
	InitButtonToOverview();
	InitButtonSelectLfdNummer();
	InitButtonSelectOrt();
	InitTextBoxSearchLfdNummer();
	InitTextBoxSearchOrt();

	InitFieldId();
	InitFieldType();
	InitFieldBezeichnung();
	InitFieldPath();
	InitFieldCountOfChildren();
	InitFieldLfdNummern();
	InitFieldOrte();
	initFiles();
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

		if ($("#selectType").val() == undefined ||
			 $("#selectType").val() == null ||
			 $("#selectType").val().length == 0)
		{
			_viewModelFormBegehungsflaeche.setType(null);
			return;
		}

		var kontextType = new KontextType();
		kontextType.Id = $("#selectType").val();
		kontextType.Bezeichnung = $("#selectType option:selected").text();

		_viewModelFormBegehungsflaeche.setType(kontextType);
	});
}

function fillSelectionKontextType(kontextTypes) {
	console.info("setting values of field 'Kontext type'");
	console.debug("values of 'Kontext type'", kontextTypes);
	$("#selectType").empty();
	$("#selectType").append("<option value='' >Bitte wählen</option>");

	kontextTypes.forEach(kontextType => {
		if (kontextType.Bezeichnung == "Begehungsfläche")
		{
			$("#selectType").append("<option value=" + kontextType.Id + ">" + kontextType.Bezeichnung + "</option>");
		}
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
	$("#buttonSelectLfdNummer").click(addLfdNummer);
}

function addLfdNummer() {
	if (_selectedLfdNummer == null)	
	{
		return;
	}

	_viewModelFormBegehungsflaeche.addLfdNummer(_selectedLfdNummer);
	$("#textBoxSearchLfdNummer").val("");
}

function InitTextBoxSearchLfdNummer() {
	$.ajax(
	{
		type:"GET",
		url: "../../api/Services/LfdNummer",
		dataType: "JSON",
		success:function(data, textStatus, jqXHR)
		{
			SetTextBoxSearchLfdNummerAutocomplete(data);
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			console.log("FEHLER: \"../../api/Services/LfdNummer\" konnte nicht geladen werden!");
		}
	});
}

function SetTextBoxSearchLfdNummerAutocomplete(data) {
	var autoCompleteItems = new Array();

	data.forEach(item => {
		var autoCompleteItem = new Object();
		autoCompleteItem.label = item.Bezeichnung;
		autoCompleteItem.value = item;
		autoCompleteItems.push(autoCompleteItem);
	});

	$("#textBoxSearchLfdNummer").autocomplete({
		minLength: 0,
		source: autoCompleteItems,
		focus: function(event, ui) {
			$("#textBoxSearchLfdNummer").val(ui.item.label);
			return false;
		},
		select: function(event, ui) {
			$("#textBoxSearchLfdNummer").val(ui.item.label);
			_selectedLfdNummer = ui.item.value;
			return false;
		}
	})
	.autocomplete("instance")._renderItem = function(ul, item) {
		return $("<li>")
			.append("<div>" + item.label + "</div>")
			.appendTo(ul);
	};
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

		var linkButtonDelete = $("<a>");
		linkButtonDelete.attr("title", "löschen");
		linkButtonDelete.attr("class", "ui-button risky-action");
		linkButtonDelete.attr("href", "javascript:removeLfdNummer(" + lfdNummer.Id + ");");

		var icon = $("<i>");
		icon.attr("class", "fas fa-trash-alt");
		linkButtonDelete.append(icon);
		li.append(linkButtonDelete);

		li.append("&nbsp;");

		var labelLfdNummer = $("<label>");
		labelLfdNummer.text(lfdNummer.Bezeichnung);
		li.append(labelLfdNummer);

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
	$("#buttonSelectOrt").click(addOrt);
}

function addOrt() {
	if (_selectedOrt == null)	
	{
		return;
	}

	_viewModelFormBegehungsflaeche.addOrt(_selectedOrt);
	$("#textBoxSearchOrt").val("");
}

function InitTextBoxSearchOrt() {
	$.ajax(
	{
		type:"GET",
		url: "../../api/Services/Ort",
		dataType: "JSON",
		success:function(data, textStatus, jqXHR)
		{
			SetTextBoxSearchOrtAutocomplete(data);
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			console.log("FEHLER: \"../../api/Services/Ort\" konnte nicht geladen werden!");
		}
	});
}

function SetTextBoxSearchOrtAutocomplete(data) {
	var autoCompleteItems = new Array();

	data.forEach(item => {
		var autoCompleteItem = new Object();
		autoCompleteItem.label = item.Path;
		autoCompleteItem.value = item;
		autoCompleteItems.push(autoCompleteItem);
	});

	$("#textBoxSearchOrt").autocomplete({
		minLength: 0,
		source: autoCompleteItems,
		focus: function(event, ui) {
			$("#textBoxSearchOrt").val(ui.item.label);
			return false;
		},
		select: function(event, ui) {
			$("#textBoxSearchOrt").val(ui.item.label);
			_selectedOrt = ui.item.value;
			return false;
		}
	})
	.autocomplete("instance")._renderItem = function(ul, item) {
		return $("<li>")
			.append("<div>" + item.label + "</div>")
			.appendTo(ul);
	};
}

function setOrte(orte) {
	$("#divOrte div #divList").empty();
	$("#divOrte div #divList").append($("<ul>"));

	orte.forEach(ort => {
		var li = $("<li>");

		var linkButtonDelete = $("<a>");
		linkButtonDelete.attr("title", "löschen");
		linkButtonDelete.attr("class", "ui-button risky-action");
		linkButtonDelete.attr("href", "javascript:removeOrt(" + ort.Id + ");");

		var icon = $("<i>");
		icon.attr("class", "fas fa-trash-alt");
		linkButtonDelete.append(icon);
		li.append(linkButtonDelete);

		li.append("&nbsp;");

		var linkOrt = $("<a>");
		linkOrt.attr("title", "gehe zu");
		linkOrt.attr("href", "../../pages/Ort/Explorer.html?Id=" + ort.Id);
		linkOrt.text(ort.Path);
		li.append(linkOrt);

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

//#region Dateien
function initFiles() {
	_viewModelFormBegehungsflaeche.register("path", new GuiClient(listFiles, null));
}

function listFiles(path) {
	console.info("listing files");
	console.debug("'Path' is", path);

	if (path.startsWith("/")) {
		console.warn("removed '/' to path");
		path = path.substring(1);
	}
	
	$("#divFileList").KontextFileList({
		path : path
	});
}
//#endregion
//#endregion

//#region form actions
//#region new
function InitButtonNew() {
	DisableButtonNew();
	_viewModelFormBegehungsflaeche.register("parent", new GuiClient(EnableButtonNew, showErrorMessages));
}

function EnableButtonNew(parent) {
	if (parent == undefined ||
		 parent == null ||
		 parent.Id == null)
	{
		DisableButtonNew();
		return;
	}

	$("#buttonNew").attr("href", "/Munins Archiv/src/pages/Begehungsflaeche/Form.html?Parent_Id=" + parent.Id);
	$("#buttonNew").removeClass("disabled");
	$("#buttonNew").prop("disabled", false);
}

function DisableButtonNew() {
	$("#buttonNew").removeAttr("href");
	$("#buttonNew").addClass("disabled");
	$("#buttonNew").prop("disabled", true);
}
//#endregion

//#region save
function InitButtonSave() {
	DisableButtonSave();
	_viewModelFormBegehungsflaeche.register("dataChanged", new GuiClient(EnableButtonSave, showErrorMessages));
	_viewModelFormBegehungsflaeche.register("dataResetted", new GuiClient(DisableButtonSave, showErrorMessages));
}

function EnableButtonSave() {
	$("#buttonSave").off("click");
	$("#buttonSave").click(function ()
	{
		ResetPropertiesMessages();
		_viewModelFormBegehungsflaeche.save();
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
		$("<p>").append("Möchten Sie diese Kontext löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
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
	_viewModelFormBegehungsflaeche.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
	_viewModelFormBegehungsflaeche.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormBegehungsflaeche.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
}

function EnableButtonUndo() {
	$("#buttonUndo").off("click");
	$("#buttonUndo").click(function () {
		console.log("button 'undo' clicked");
		_viewModelFormBegehungsflaeche.undoAllChanges();
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
	_viewModelFormBegehungsflaeche.register("parent", new GuiClient(EnableButtonToOverview, showErrorMessages));
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
		$("#buttonToOverview").removeAttr("href");
		$("#buttonToOverview").addClass("disabled");
		$("#buttonToOverview").prop("disabled", true);
	}
	//#endregion
	//#endregion
