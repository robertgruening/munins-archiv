var _viewModelFormFund = null;
var _selectedFundAttribute = null;
var _selectedAblage = null;
var _selectedKontext = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormFund = viewModelFactory.getViewModelFormFund();

	InitStatusChanged();
	InitButtonNew();
	InitButtonSave();
	InitButtonDelete();
	InitButtonUndo();
	InitButtonSelectFundAttribut();
	InitButtonSelectKontext();
	InitButtonSelectAblage();
	InitButtonToSearch();
	InitTextBoxSearchFundAttribut();
	InitTextBoxSearchAblage();
	InitTextBoxSearchKontext();

	InitFieldId();
	InitFieldBeschriftung();
	InitFieldFundattribute();
	InitFieldAnzahl();
	InitFieldDimension1();
	InitFieldDimension2();
	InitFiledDimension3();
	InitFieldMasse();
	InitFieldAblage();
	InitFieldKontext();
	InitFieldFileName();
	InitFieldFolderName();
	InitFieldRating();

	if (getUrlParameterValue("Id")) {
		_viewModelFormFund.load(getUrlParameterValue("Id"));
	}
	else {
		_viewModelFormFund.updateAllListeners();
	}
});

function getPageName() {
	if (getFormMode() == "create") {
		return "FundFormNew";
	}
	else if (getFormMode() == "edit") {
		return "FundFormEdit";
	}
}

function InitStatusChanged() {
	_viewModelFormFund.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
	_viewModelFormFund.register("create", new GuiClient(loadCreatedElement, showErrorMessages));
	_viewModelFormFund.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormFund.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function loadCreatedElement(element) {
	window.open(window.location.href.replace(window.location.search, "") + "?Id=" + element.Id, "_self");
}

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
	_viewModelFormFund.register("dataChanged", new GuiClient(EnableButtonSave, showErrorMessages));
	_viewModelFormFund.register("dataResetted", new GuiClient(DisableButtonSave, showErrorMessages));
}

function EnableButtonSave() {
	$("#buttonSave").off("click");
	$("#buttonSave").click(function ()
	{
		ResetPropertiesMessages();
		_viewModelFormFund.save();
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
		$("<p>").append("Möchten Sie diesen Fund löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelFormFund.delete();

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
	_viewModelFormFund.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
	_viewModelFormFund.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormFund.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
}

function EnableButtonUndo() {
	$("#buttonUndo").off("click");
	$("#buttonUndo").click(function () { _viewModelFormFund.undoAllChanges(); });
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

//#region open search
function InitButtonToSearch() {
	EnableButtonToSearch();
}

function EnableButtonToSearch() {
	$("#buttonToSearch").off("click");
	$("#buttonToSearch").click( function() {
        console.log("button 'to search' clicked");
		window.open("/Munins Archiv/src/pages/Fund/Search.html", "_self");
	});
	$("#buttonToSearch").removeClass("disabled");
	$("#buttonToSearch").prop("disabled", false);
}

function DisableButtonToSearch() {
	$("#buttonToSearch").off("click");
	$("#buttonToSearch").addClass("disabled");
	$("#buttonToSearch").prop("disabled", true);
}
//#endregion
//#endregion

function GetIcon(type, state) {
	return IconConfig.getCssClasses(type, state);
}

//#region Id
function InitFieldId() {
	_viewModelFormFund.register("id", new GuiClient(setId, showErrorMessages));
}

function setId(id) {
	if (id == null) {
		document.title = "Fund";
		DisableButtonDelete();
	}
	else {
		document.title = "Fund: (" + id + ")";
		EnableButtonDelete();
	}
}
//#endregion

//#region Bezeichnung
function InitFieldBeschriftung() {
	_viewModelFormFund.register("bezeichnung", new GuiClient(setBezeichnung, showMessagesBeschriftung));
	$("#textboxBeschriftung").change(function () {
		_viewModelFormFund.setBezeichnung($("#textboxBeschriftung").val())
	});
}

function setBezeichnung(bezeichnung) {
	$("#textboxBeschriftung").val(bezeichnung);
}

function showMessagesBeschriftung(messages) {
	$("#divBeschriftung .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Fundattribute
function InitFieldFundattribute() {
	_viewModelFormFund.register("fundAttribute", new GuiClient(setFundAttribute, showMessagesFundAttribute));
}

function InitButtonSelectFundAttribut() {
	$("#buttonAddFundAttribut").click(addFundAttribut);
}

function addFundAttribut() {
	if (_selectedFundAttribute == null)	
	{
		return;
	}

	_viewModelFormFund.addFundAttribut(_selectedFundAttribute);
	$("#textBoxSearchFundAttributByPath").val("");
}

function InitTextBoxSearchFundAttribut() {
	$.ajax(
	{
		type:"GET",
		url: "../../api/Services/FundAttribut",
		dataType: "JSON",
		success:function(data, textStatus, jqXHR)
		{
			SetTextBoxSearchFundAttributAutocomplete(data);
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			console.log("FEHLER: \"../../api/Services/FundAttribut\" konnte nicht geladen werden!");
		}
	});
}

function SetTextBoxSearchFundAttributAutocomplete(data) {
	var autoCompleteItems = new Array();

	data.forEach(item => {
		var autoCompleteItem = new Object();
		autoCompleteItem.label = item.Path;
		autoCompleteItem.value = item;
		autoCompleteItems.push(autoCompleteItem);
	});

	$("#textBoxSearchFundAttributByPath").autocomplete({
		minLength: 0,
		source: autoCompleteItems,
		focus: function(event, ui) {
			$("#textBoxSearchFundAttributByPath").val(ui.item.label);
			return false;
		},
		select: function(event, ui) {
			$("#textBoxSearchFundAttributByPath").val(ui.item.label);
			_selectedFundAttribute = ui.item.value;
			return false;
		}
	})
	.autocomplete("instance")._renderItem = function(ul, item) {
		return $("<li>")
			.append("<div>" + item.label + "</div>")
			.appendTo(ul);
	};
}

function setFundAttribute(fundAttribute) {
	$("#divFundAttribute div #divList").empty();
	$("#divFundAttribute div #divList").append($("<ul>"));

	fundAttribute.forEach(fundAttribut => {
		var li = $("<li>");

		var linkButtonDelete = $("<a>");
		linkButtonDelete.attr("title", "löschen");
		linkButtonDelete.attr("class", "ui-button risky-action");
		linkButtonDelete.attr("href", "javascript:removeFundAttribut(" + fundAttribut.Id + ");");

		var icon = $("<i>");
		icon.attr("class", "fas fa-trash-alt");
		linkButtonDelete.append(icon);
		li.append(linkButtonDelete);

		li.append("&nbsp;");

		var linkFundAttribut = $("<a>");
		linkFundAttribut.attr("title", "gehe zu");
		linkFundAttribut.attr("href", "../../pages/FundAttribut/Form.html?Id=" + fundAttribut.Id);
		linkFundAttribut.text(fundAttribut.Path);
		li.append(linkFundAttribut);

		$("#divFundAttribute div #divList ul").append(li);
	});
}

function removeFundAttribut(fundAttributId) {
	var fundAttribut = new Object();
	fundAttribut.Id = fundAttributId;

	_viewModelFormFund.removeFundAttribut(fundAttribut);
}

function showMessagesFundAttribute(messages) {
	$("#divFundAttribute .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Anzahl
function InitFieldAnzahl() {
	_viewModelFormFund.register("anzahl", new GuiClient(setAnzahl, showMessagesAnzahl));
	$("#textboxAnzahl").change(function () {
		_viewModelFormFund.setAnzahl($("#textboxAnzahl").val())
	});
}

function setAnzahl(anzahl) {
	$("#textboxAnzahl").val(anzahl);
}

function showMessagesAnzahl(messages) {
	$("#divAnzahl .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Dimension1
function InitFieldDimension1() {
	_viewModelFormFund.register("dimension1", new GuiClient(setDimension1, showMessagesDimension1));
	$("#textboxDimension1").change(function () {
		_viewModelFormFund.setDimension1($("#textboxDimension1").val())
	});
}

function setDimension1(dimension1) {
	$("#textboxDimension1").val(dimension1);
}

function showMessagesDimension1(messages) {
	$("#divDimension1 .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Dimension2
function InitFieldDimension2() {
	_viewModelFormFund.register("dimension2", new GuiClient(setDimension2, showMessagesDimension2));
	$("#textboxDimension2").change(function () {
		_viewModelFormFund.setDimension2($("#textboxDimension2").val())
	});
}

function setDimension2(dimension2) {
	$("#textboxDimension2").val(dimension2);
}

function showMessagesDimension2(messages) {
	$("#divDimension2 .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Dimension3
function InitFiledDimension3() {
	_viewModelFormFund.register("dimension3", new GuiClient(setDimension3, showMessagesDimension3));
	$("#textboxDimension3").change(function () {
		_viewModelFormFund.setDimension3($("#textboxDimension3").val())
	});
}

function setDimension3(dimension3) {
	$("#textboxDimension3").val(dimension3);
}

function showMessagesDimension3(messages) {
	$("#divDimension3 .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Masse
function InitFieldMasse() {
	_viewModelFormFund.register("masse", new GuiClient(setMasse, showMessagesMasse));
	$("#textboxMasse").change(function () {
		_viewModelFormFund.setMasse($("#textboxMasse").val())
	});
}

function setMasse(masse) {
	$("#textboxMasse").val(masse);
}

function showMessagesMasse(messages) {
	$("#divMasse .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Ablage
function InitFieldAblage() {
	_viewModelFormFund.register("ablage", new GuiClient(setAblage, showMessagesAblage));
}

function InitButtonSelectAblage() {
	$("#buttonSelectAblage").click(function() {
		if (_selectedAblage == null) {
			return;
		}

		_viewModelFormFund.setAblage(_selectedAblage);
		$("#textBoxSearchAblageByPath").val("");
	});
}

function InitTextBoxSearchAblage() {
	$.ajax(
	{
		type:"GET",
		url: "../../api/Services/Ablage",
		dataType: "JSON",
		success:function(data, textStatus, jqXHR)
		{
			SetTextBoxSearchAblageAutocomplete(data);
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			console.log("FEHLER: \"../../api/Services/Ablage\" konnte nicht geladen werden!");
		}
	});
}

function SetTextBoxSearchAblageAutocomplete(data) {
	var autoCompleteItems = new Array();

	data.forEach(item => {
		var autoCompleteItem = new Object();
		autoCompleteItem.label = item.Path;
		autoCompleteItem.value = item;
		autoCompleteItems.push(autoCompleteItem);
	});

	$("#textBoxSearchAblageByPath").autocomplete({
		minLength: 0,
		source: autoCompleteItems,
		focus: function(event, ui) {
			$("#textBoxSearchAblageByPath").val(ui.item.label);
			return false;
		},
		select: function(event, ui) {
			$("#textBoxSearchAblageByPath").val(ui.item.label);
			_selectedAblage = ui.item.value;
			return false;
		}
	})
	.autocomplete("instance")._renderItem = function(ul, item) {
		return $("<li>")
			.append("<div>" + item.label + "</div>")
			.appendTo(ul);
	};
}

function setAblage(ablage) {
	if (ablage == null) {
		$("#linkSelectedAblage").text("");
		$("#linkSelectedAblage").attr("href", "");
	}
	else {
		$("#linkSelectedAblage").text(ablage.Path);
		$("#linkSelectedAblage").attr("href", "../../pages/Ablage/Form.html?Id=" + ablage.Id);
	}
}

function showMessagesAblage(messages) {
	$("#divAblage .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Kontext
function InitFieldKontext() {
	_viewModelFormFund.register("kontext", new GuiClient(setKontext, showMessagesKontext));
}

function InitButtonSelectKontext() {
	$("#buttonSelectKontext").click(function() {
		if (_selectedKontext == null) {
			return;
		}

		_viewModelFormFund.setKontext(_selectedKontext);
		$("#textBoxSearchKontextByPath").val("");
	});
}

function InitTextBoxSearchKontext() {
	$.ajax(
	{
		type:"GET",
		url: "../../api/Services/Kontext",
		dataType: "JSON",
		success:function(data, textStatus, jqXHR)
		{
			SetTextBoxSearchKontextAutocomplete(data);
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			console.log("FEHLER: \"../../api/Services/Kontext\" konnte nicht geladen werden!");
		}
	});
}

function SetTextBoxSearchKontextAutocomplete(data) {
	var autoCompleteItems = new Array();

	data.forEach(item => {
		var autoCompleteItem = new Object();
		autoCompleteItem.label = item.Path;
		autoCompleteItem.value = item;
		autoCompleteItems.push(autoCompleteItem);
	});

	$("#textBoxSearchKontextByPath").autocomplete({
		minLength: 0,
		source: autoCompleteItems,
		focus: function(event, ui) {
			$("#textBoxSearchKontextByPath").val(ui.item.label);
			return false;
		},
		select: function(event, ui) {
			$("#textBoxSearchKontextByPath").val(ui.item.label);
			_selectedKontext = ui.item.value;
			return false;
		}
	})
	.autocomplete("instance")._renderItem = function(ul, item) {
		return $("<li>")
			.append("<div>" + item.label + "</div>")
			.appendTo(ul);
	};
}

function setKontext(kontext) {
	if (kontext == null) {
		$("#linkSelectedKontext").text("");
		$("#linkSelectedKontext").attr("href", "");
	}
	else {
		$("#linkSelectedKontext").text(kontext.Path);
		$("#linkSelectedKontext").attr("href", "../../pages/" + kontext.Type.Bezeichnung + "/Form.html?Id=" + kontext.Id);
	}
}

function showMessagesKontext(messages) {
	$("#divKontext .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region FileName
function InitFieldFileName() {
	_viewModelFormFund.register("fileName", new GuiClient(setFileName, showMessagesFileName));
	$("#textboxFileName").change(function () {
		_viewModelFormFund.setFileName($("#textboxFileName").val())
	});

	$("img.preview").click(function()
	{
		imageModal_open(this);
	});
}

function setFileName(fileName) {
	$("#textboxFileName").val(fileName);

	if (_viewModelFormFund.getKontext() != null &&
		fileName != null) {

		let kontextPath = _viewModelFormFund.getKontext().Path;
		let previewFileName = fileName.substr(0, fileName.lastIndexOf(".")) + ".preview" + fileName.substr(fileName.lastIndexOf("."));
		let relativePreviewFilePath = kontextPath + "/" + previewFileName;
		$("img.preview").attr("src", getMuninsArchivFileServiceBaseUrl() + "/file.php?relativePath=/" +
 relativePreviewFilePath);		
	}
}

function showMessagesFileName(messages) {
	$("#divFileName .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region FolderName
function InitFieldFolderName() {
	_viewModelFormFund.register("folderName", new GuiClient(setFolderName, showMessagesFolderName));
	$("#textboxFolderName").change(function () {
		_viewModelFormFund.setFolderName($("#textboxFolderName").val())
	});
}

function setFolderName(masse) {
	$("#textboxFolderName").val(masse);
}

function showMessagesFolderName(messages) {
	$("#divFolderName .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Bewertung
function InitFieldRating() {
	_viewModelFormFund.register("rating", new GuiClient(setRating, showMessagesRating));
	$("#selectRating").change(function () {
		_viewModelFormFund.setRating($("#selectRating").val())
	});
}

function setRating(rating) {
	$("#selectRating").val(rating);
}

function showMessagesRating(messages) {
	$("#divRating .fieldValue div[name=messages]").text(messages);
}
//#endregion


function showMessageLoaded(element) {
    showInformationMessageBox("Fund (" + element.Id + ") geladen");
}

function showMessageSaved(element) {
	showSuccessMessageBox("Fund (" + element.Id + ") gespeichert");
}

function showMessageDeleted(element) {
    showSuccessMessageBox("Fund (" + element.Id + ") gelöscht");
}
