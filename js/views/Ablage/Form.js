var _viewModelFormAblage = null;
var _viewModelListAblageType = null;
var _selectedParent = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormAblage = viewModelFactory.getViewModelFormAblage();
	_viewModelListAblageType = viewModelFactory.getViewModelListAblageType();

	InitStatusChanged();
	InitButtonNew();
	InitButtonSave();
	InitButtonDelete();
	InitButtonUndo();
	InitButtonSelectParent();
	InitTextBoxSearchParent();
	InitButtonPrintLabel();
	InitButtonToOverview();

	InitFieldId();
	InitFieldType();
	InitFieldBezeichnung();
	InitFieldParent();
	InitFieldPath();
	InitFieldCountOfChildren();
	InitFieldCountOfFunde();
	InitGridFunde();
	InitFieldGuid();
	InitFieldKontexte();
	InitFieldLastCheckedDate();
});

function getPageName() {
	if (getFormMode() == "create") {
		return "AblageFormNew";
	}
	else if (getFormMode() == "edit") {
		return "AblageFormEdit";
	}
}

function loadForm() {
	console.info("loading form");

	if (getUrlParameterValue("Id")) {
		console.debug("Ablage is requested by ID", getUrlParameterValue("Id"));
		_viewModelFormAblage.load(getUrlParameterValue("Id"));
	}
	else if (getUrlParameterValue("Parent_Id")) {
		console.debug("creation of a new Ablage is requested with parent ID", getUrlParameterValue("Parent_Id"));
		var parent = new Ablage();
		parent.Id = getUrlParameterValue("Parent_Id");
		parent.Path = "[ Pfad der übergeordnete Ablage ]";

		_viewModelFormAblage.setParent(parent);
		showMessageParentSet();
		_viewModelFormAblage.updateAllListeners();
	}
	else {
		console.debug("there is no Ablage requested");
		_viewModelFormAblage.updateAllListeners();
	}
}

function InitStatusChanged() {
	_viewModelFormAblage.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
	_viewModelFormAblage.register("create", new GuiClient(loadCreatedElement, showErrorMessages));
	_viewModelFormAblage.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormAblage.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function loadCreatedElement(element) {
	window.open(window.location.href.replace(window.location.search, "") + "?Id=" + element.Id, "_self");
}

//#region messages
function showMessageParentSet() {
	showInformationMessageBox("übergeordnete Ablage gesetzt");
}

function showMessageLoaded(element) {
	showSuccessMessageBox("Ablage \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") geladen");
}

function showMessageSaved(element) {
	showSuccessMessageBox("Ablage \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gespeichert");
}

function showMessageDeleted(element) {
	showSuccessMessageBox("Ablage \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gelöscht");
}
//#endregion

//#region form fields

//#region Id
function InitFieldId() {
	_viewModelFormAblage.register("id", new GuiClient(setId, showErrorMessages));
}

function setId(id) {
	if (id == null) {
		document.title = "Ablage";
		DisableButtonDelete();
	}
	else {
		document.title = "Ablage: (" + id + ")";
		EnableButtonDelete();
	}
}
//#endregion

//#region Type
function InitFieldType() {
	console.info("initialising field 'Ablage type'");

	_viewModelFormAblage.register("type", new GuiClient(setType, showMessagesType));

	_viewModelListAblageType.register("loadAll", new GuiClient(fillSelectionAblageType, showMessagesType));
	_viewModelListAblageType.loadAll();

	$("#selectType").change(function () {

		if ($("#selectType").val() == undefined ||
			 $("#selectType").val() == null ||
			 $("#selectType").val().length == 0)
		{
			_viewModelFormAblage.setType(null);
			return;
		}

		var ablageType = new AblageType();
		ablageType.Id = $("#selectType").val();
		ablageType.Bezeichnung = $("#selectType option:selected").text();

		_viewModelFormAblage.setType(ablageType);
	});
}

function fillSelectionAblageType(ablageTypes) {
	console.info("setting values of field 'Ablage type'");
	console.debug("values of 'Ablage type'", ablageTypes);
	$("#selectType").empty();
	$("#selectType").append("<option value='' >Bitte wählen</option>");

	ablageTypes.forEach(ablageType => {
		$("#selectType").append("<option value=" + ablageType.Id + ">" + ablageType.Bezeichnung + "</option>");
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
	_viewModelFormAblage.register("bezeichnung", new GuiClient(setBezeichnung, showMessagesBezeichnung));
	$("#textboxBezeichnung").change(function () {
		_viewModelFormAblage.setBezeichnung($("#textboxBezeichnung").val())
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

//#region Parent
function InitFieldParent() {
	_viewModelFormAblage.register("parent", new GuiClient(setParent, showMessagesParent));
}

function InitButtonSelectParent() {
	$("#buttonSelectParent").click(function() {
		if (_selectedParent == null) {
			return;
		}

		_viewModelFormAblage.setParent(_selectedParent);
		$("#textBoxSearchParentByPath").val("");
	});
}

function InitTextBoxSearchParent() {
	$.ajax(
	{
		type:"GET",
		url: "../../api/Services/Ablage",
		dataType: "JSON",
		success:function(data, textStatus, jqXHR)
		{
			SetTextBoxSearchParentAutocomplete(data);
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			console.log("FEHLER: \"../../api/Services/Ablage\" konnte nicht geladen werden!");
		}
	});
}

function SetTextBoxSearchParentAutocomplete(data) {
	var autoCompleteItems = new Array();

	data.forEach(item => {
		var autoCompleteItem = new Object();
		autoCompleteItem.label = item.Path;
		autoCompleteItem.value = item;
		autoCompleteItems.push(autoCompleteItem);
	});

	$("#textBoxSearchParentByPath").autocomplete({
		minLength: 0,
		source: autoCompleteItems,
		focus: function(event, ui) {
			$("#textBoxSearchParentByPath").val(ui.item.label);
			return false;
		},
		select: function(event, ui) {
			$("#textBoxSearchParentByPath").val(ui.item.label);
			_selectedParent = ui.item.value;
			return false;
		}
	})
	.autocomplete("instance")._renderItem = function(ul, item) {
		return $("<li>")
			.append("<div>" + item.label + "</div>")
			.appendTo(ul);
	};
}

function setParent(parent) {
	$("#divParent div #divList").empty();
	$("#divParent div #divList").append($("<ul>"));

	if (parent == null) {
		return;
	}

	var li = $("<li>");

	var linkButtonDelete = $("<a>");
	linkButtonDelete.attr("title", "löschen");
	linkButtonDelete.attr("class", "ui-button risky-action");
	linkButtonDelete.attr("href", "javascript:removeParent();");

	var icon = $("<i>");
	icon.attr("class", "fas fa-trash-alt");
	linkButtonDelete.append(icon);
	li.append(linkButtonDelete);

	li.append("&nbsp;");

	var linkParent = $("<a>");
	linkParent.attr("title", "gehe zu");
	linkParent.attr("href", "../../pages/Ablage/Form.html?Id=" + parent.Id);
	linkParent.text(parent.Path);
	li.append(linkParent);

	$("#divParent div #divList ul").append(li);
}

function removeParent() {
	_viewModelFormAblage.removeParent();
}

function showMessagesParent(messages) {
	$("#divParent .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Path
function InitFieldPath() {
	_viewModelFormAblage.register("path", new GuiClient(setPath, null));
}

function setPath(path) {
	console.info("setting value of 'Path'");
	console.debug("'Path' is", path);
	$("#labelPath").text(path);
}
//#endregion

//#region Anzahl von Children
function InitFieldCountOfChildren() {
	_viewModelFormAblage.register("children", new GuiClient(setCountOfChildren, null));
}

function setCountOfChildren(children) {
	console.info("setting value of 'count of children'");
	console.debug("children are ", children);
	$("#labelCountOfChildren").text(children.length);
}
//#endregion

//#region Anzahl von Funde
function InitFieldCountOfFunde() {
	_viewModelFormAblage.register("funde", new GuiClient(setCountOfFunde, null));
}

function setCountOfFunde(funde) {
	console.info("setting value of 'count of funde'");
	console.debug("Funde are ", funde);
	$("#labelCountOfFunde").text(funde.length);
}
//#endregion

//#region Funde
var ImageField = function(config) {
	jsGrid.Field.call(this, config);
}

ImageField.prototype = new jsGrid.Field({
	itemTemplate: function(value) {
		if (value == null) {
			return "kein Bild vorhanden";
		}

		return $("<img>")
			.attr("src", value)
			.attr("width", "70px")
			.attr("onclick", "imageModal_open(this)");
	}
});

var LinkToFundFormField = function(config) {
	jsGrid.Field.call(this, config);
}

LinkToFundFormField.prototype = new jsGrid.Field({
	itemTemplate: function(value) {
		var icon = $("<i>").addClass("fas fa-external-link-alt");
		var link = $("<a>").append(icon);
		$(link).attr("href", "/pages/Fund/Form.html?Id=" + value);
		$(link).attr("target", "_blank");
		$(link).attr("title", "Fundformular öffnen");
		return link;
	}
});

var CheckingField = function(config) {
	jsGrid.Field.call(this, config);
}

CheckingField.prototype = new jsGrid.Field({
	itemTemplate: function(value) {
		let div = $("<div>")
			.attr("title", value);
		
		if (value !== null) {
			div.append($("<i>")
				.addClass("fas fa-circle-check"));
			div.append("&nbsp;");
			div.append($("<span>")
				.text(new Date(value).toLocaleDateString()));
		}

		return div;
	}
});

var RatingField = function(config) {
	jsGrid.Field.call(this, config);
}

RatingField.prototype = new jsGrid.Field({
	itemTemplate: function(value) {
		let div = $("<div>")
			.attr("title", value);

		for (let i = 1; i <= 5; i++) {

			if (i <= value) {
				div.append($("<i>")
					.addClass("fas fa-star rating-star--checked"));
			}
			else {
				div.append($("<i>")
					.addClass("fas fa-star rating-star"));
			}
		}

		return div;
	}
});

function InitGridFunde()
{
	console.info("initializing grid of 'funde'");
	_viewModelFormAblage.register("funde", new GuiClient(UpdateGridData, showErrorMessages));

	jsGrid.locale("de");
    jsGrid.fields.image = ImageField;
	jsGrid.fields.linkToFundFormField = LinkToFundFormField;
	jsGrid.fields.checking = CheckingField;
	jsGrid.fields.rating = RatingField;

	$("#gridFunde").jsGrid({
		width: "100%",

		inserting: false,
		editing: false,
		sorting: false,
		paging: false,
		autoload: false,

		fields: [
			{
				title: "",
				name: "Id",
				type: "linkToFundFormField",
				width: 27
			},
			{
				title: "",
				name: "PreviewImage",
				type: "image",
				width: 50
			},
			{
				name: "Anzahl",
				type: "text"
			},
			{
				title: "Beschriftung",
				name: "Bezeichnung",
				type: "text"
			},
			{
				title: "Fundattribute",
				name: "FundAttributAnzeigeTexte",
				type: "text"
			},
			{
				title: "Ist geprüft",
				name: "LastCheckedDate",
				type: "checking"
			},
			{
				title: "Bewertung",
				name: "Rating",
				type: "rating"
			}
		],

		rowDoubleClick: function(args) {
			console.info("row double clicked");
			console.debug("selected grid item", args.item);

			window.open("/pages/Fund/Form.html?Id=" + args.item.Id, "_self");
		}
	});
}

function UpdateGridData(funde) {
	console.info("setting value of 'funde'");
	console.debug("'funde'", funde);
	$("#gridFunde").empty();

	var entries = new Array();

	funde.forEach(fund => {
		var copy = JSON.parse(JSON.stringify(fund));

		if (fund.Kontext != null &&
			fund.FileName != null) {

			copy.PreviewImage = getWebdavFundImageBaseUrl() + fund.Kontext.Path + "/" + fund.FileName;
		}

		copy.Anzahl = fund.Anzahl.replace("-", ">");
		copy.FundAttributAnzeigeTexte = "<ul>"

		fund.FundAttribute.forEach(fundAttribut => {
			copy.FundAttributAnzeigeTexte += "<li>" + fundAttribut.Type.Bezeichnung + ": " + fundAttribut.Bezeichnung + "</li>"
		});

		copy.FundAttributAnzeigeTexte += "</ul>"
		entries.push(copy);
	});

	$("#gridFunde").jsGrid({
		data: entries
	});
}
//#endregion

//#region GUID
function InitFieldGuid() {
	_viewModelFormAblage.register("guid", new GuiClient(setGuid, null));
}

function setGuid(guid) {
	console.info("setting value of 'GUID'");
	console.debug("GUID is ", guid);
	$("#labelGuid").text(guid);

	$("#divQrCodeGuid").empty();
	
	if (guid == null ||
		 guid == "")
	{
		return;
	}
	
	/**
	 * The GUID is 36 characters long.
	 * Using error correction level 'H'
	 * requires version 4 with 33x33 modules. 
	 */
	var modules = 33;
	var qrCodeLength = modules * 3;	
	
	$("#divQrCodeGuid").qrcode({
		text: guid,
		height: qrCodeLength,
		width: qrCodeLength
	});
}
//#endregion

//#region Kontexte
function InitFieldKontexte() {
	_viewModelFormAblage.register("kontexte", new GuiClient(setKontexte, showMessagesKontexte));
}

function setKontexte(kontexte) {
	console.info("setting value of 'Kontexte'");
	console.debug("Kontexte are ", kontexte);

	$("#divKontexte div #divList").empty();

	if (kontexte.length == 0) {
		return;
	}

	$("#divKontexte div #divList").append($("<ul>"));

	kontexte.forEach(kontext => {
		var li = $("<li>");

		var linkKontext = $("<a>");
		linkKontext.attr("href", "/pages/" + kontext.Type.Bezeichnung + "/Form.html?Id=" + kontext.Id);
		linkKontext.text(kontext.Path);
		li.append(linkKontext);

		$("#divKontexte div #divList ul").append(li);
	});
}

function showMessagesKontexte(messages) {
	$("#divKontexte .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region LastCheckedDate
function InitFieldLastCheckedDate() {
	_viewModelFormAblage.register("lastCheckedDate", new GuiClient(setLastCheckedDate, showMessagesLastCheckedDate));
	$("#checkboxLastCheckedDate").change(function () {
		if ($("#checkboxLastCheckedDate").is(":checked")) {
			let lastCheckedDate = new Date();
			$("#checkboxLastCheckedDate").next().text(lastCheckedDate.toLocaleDateString());
			_viewModelFormAblage.setLastCheckedDate(lastCheckedDate.toISOString());
		}
		else {
			$("#checkboxLastCheckedDate").next().text("");
			_viewModelFormAblage.setLastCheckedDate(null);
		}
	});
}

function setLastCheckedDate(lastCheckedDate) {
	if (lastCheckedDate == null) {
		$("#checkboxLastCheckedDate").next().text("");
		$("#checkboxLastCheckedDate").prop("checked", false);
	}
	else {
		$("#checkboxLastCheckedDate").next().text(new Date(lastCheckedDate).toLocaleDateString());
		$("#checkboxLastCheckedDate").prop("checked", true);
	}
}

function showMessagesLastCheckedDate(messages) {
	$("#divLastCheckedDate .fieldValue div[name=messages]").text(messages);
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
	_viewModelFormAblage.register("dataChanged", new GuiClient(EnableButtonSave, showErrorMessages));
	_viewModelFormAblage.register("dataResetted", new GuiClient(DisableButtonSave, showErrorMessages));
}

function EnableButtonSave() {
	$("#buttonSave").off("click");
	$("#buttonSave").click(function ()
	{
		ResetPropertiesMessages();
		_viewModelFormAblage.save();
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
		$("<p>").append("Möchten Sie diese Ablage löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelFormAblage.delete();

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
	_viewModelFormAblage.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
	_viewModelFormAblage.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormAblage.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
}

function EnableButtonUndo() {
	$("#buttonUndo").off("click");
	$("#buttonUndo").click(function () {
		console.log("button 'undo' clicked");
		_viewModelFormAblage.undoAllChanges();
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

//#region print label
function InitButtonPrintLabel() {
	DisableButtonPrintLabel();
	_viewModelFormAblage.register("id", new GuiClient(EnableButtonPrintLabel, showErrorMessages));
}

function EnableButtonPrintLabel(id) {
	if (id === undefined ||
		id === null)
	{
		DisableButtonPrintLabel();
	}
	else {
		$("#buttonPrintLabel").attr("href", "/pages/Ablage/PrintLabel.html?Id=" + id, "_self");
	}

	$("#buttonPrintLabel").removeClass("disabled");
	$("#buttonPrintLabel").prop("disabled", false);
}

function DisableButtonPrintLabel() {
	$("#buttonPrintLabel").removeAttr("href");
	$("#buttonPrintLabel").addClass("disabled");
	$("#buttonPrintLabel").prop("disabled", true);
}
//#endregion

//#region open overview
function InitButtonToOverview() {
	EnableButtonToOverview();
	_viewModelFormAblage.register("parent", new GuiClient(EnableButtonToOverview, showErrorMessages));
}

function EnableButtonToOverview(parent) {
	if (parent === undefined ||
		parent === null ||
		parent.Id === undefined)
	{

		$("#buttonToOverview").attr("href", "/pages/Ablage/Explorer.html", "_self");
	}
	else {
		$("#buttonToOverview").attr("href", "/pages/Ablage/Explorer.html?Id=" + parent.Id, "_self");
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
