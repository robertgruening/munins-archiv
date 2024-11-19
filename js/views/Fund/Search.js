var _viewModelSearchResultListFund = null;
var _selectedFundattribut = null;
let _selectedFundattribute = new Array();
var _selectedAblage = null;
let _selectedAblagen = new Array();
var _selectedKontext = null;
let _selectedKontexte = new Array();

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelSearchResultListFund = viewModelFactory.getViewModelSearchResultListFund();

    RegisterToViewModel();
	InitButtonNew();

	InitButtonSelectFundAttribut();
	InitButtonSelectAblage();
	InitButtonSelectKontext();
	InitTextBoxSearchFundAttribut();
	InitTextBoxSearchAblage();
	InitTextBoxSearchKontext();

	InitButtonSearch();
	initButtonGoToFirstPage();
	initButtonGoToPreviousPage();
	initButtonGoToNextPage();
	initButtonGoToLastPage();

    InitGrid();
});

function getPageName() {
	return "FundSearch";
}

function RegisterToViewModel() {
	_viewModelSearchResultListFund.register("dataChanged", new GuiClient(UpdateGridData, UpdateGridData));
	_viewModelSearchResultListFund.register("count", new GuiClient(enableButtonGoToFirstPage, disableButtonGoToFirstPage));
	_viewModelSearchResultListFund.register("count", new GuiClient(enableButtonGoToPreviousPage, disableButtonGoToPreviousPage));
	_viewModelSearchResultListFund.register("count", new GuiClient(enableButtonGoToNextPage, disableButtonGoToNextPage));
	_viewModelSearchResultListFund.register("count", new GuiClient(enableButtonGoToLastPage, disableButtonGoToLastPage));
	_viewModelSearchResultListFund.register("search", new GuiClient(ShowMessageSearchResultDisplayed, showErrorMessages));
	_viewModelSearchResultListFund.register("count", new GuiClient(setLabelCount, resetLabelCount));
}
//#region form actions
//#region new
function InitButtonNew() {
	EnableButtonNew();
	$("#buttonNew").attr("href", "/pages/Fund/Form.html");
}

function EnableButtonNew() {
	$("#buttonNew").attr("href", "/pages/Fund/Form.html");
	$("#buttonNew").removeClass("disabled");
	$("#buttonNew").prop("disabled", false);
}

function DisableButtonNew() {
	$("#buttonNew").removeAttr("href");
	$("#buttonNew").addClass("disabled");
	$("#buttonNew").prop("disabled", true);
}
//#endregion
//#endregion

//#region form data
//#region Fundattribute
function InitButtonSelectFundAttribut() {
	$("#buttonAddFundAttribut").click(addFundAttribut);
}

function addFundAttribut() {
	if (_selectedFundattribut == null)	
	{
		return;
	}

	for (i = 0; i < _selectedFundattribute.length; i++) {
		if (_selectedFundattribute[i].Id == _selectedFundattribut.Id) {
			return;
		}
	}

	_selectedFundattribute.push(_selectedFundattribut);
	setFundAttribute(_selectedFundattribute);
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
			_selectedFundattribut = ui.item.value;
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
	$("#divFundattribute div #divFundAttributList").empty();
	$("#divFundattribute div #divFundAttributList").append($("<ul>"));

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

		$("#divFundattribute div #divFundAttributList ul").append(li);
	});
}

function removeFundAttribut(fundAttributId) {
	var fundAttribut = new Object();
	fundAttribut.Id = fundAttributId;

	for (i = 0; i < _selectedFundattribute.length; i++) {
		if (_selectedFundattribute[i].Id == fundAttribut.Id) {
			_selectedFundattribute.splice(i, 1);
			break;
		}
	}

	setFundAttribute(_selectedFundattribute);
}

function showMessagesFundAttribute(messages) {
	$("#divFundattribute .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Ablage
function InitButtonSelectAblage() {
	$("#buttonAddAblage").click(addAblage);
}

function addAblage() {
	if (_selectedAblage == null)	
	{
		return;
	}

	for (i = 0; i < _selectedAblagen.length; i++) {
		if (_selectedAblagen[i].Id == _selectedAblage.Id) {
			return;
		}
	}

	_selectedAblagen.push(_selectedAblage);
	setAblagen(_selectedAblagen);
	$("#textBoxSearchAblageByPath").val("");
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

function setAblagen(ablagen) {
	$("#divAblagen div #divAblageList").empty();
	$("#divAblagen div #divAblageList").append($("<ul>"));

	ablagen.forEach(ablage => {
		var li = $("<li>");

		var linkButtonDelete = $("<a>");
		linkButtonDelete.attr("title", "löschen");
		linkButtonDelete.attr("class", "ui-button risky-action");
		linkButtonDelete.attr("href", "javascript:removeAblage(" + ablage.Id + ");");

		var icon = $("<i>");
		icon.attr("class", "fas fa-trash-alt");
		linkButtonDelete.append(icon);
		li.append(linkButtonDelete);

		li.append("&nbsp;");

		var linkAblage = $("<a>");
		linkAblage.attr("title", "gehe zu");
		linkAblage.attr("href", "../../pages/Ablage/Form.html?Id=" + ablage.Id);
		linkAblage.text(ablage.Path);
		li.append(linkAblage);

		$("#divAblagen div #divAblageList ul").append(li);
	});
}

function removeAblage(ablageId) {
	var ablage = new Object();
	ablage.Id = ablageId;

	for (i = 0; i < _selectedAblagen.length; i++) {
		if (_selectedAblagen[i].Id == ablage.Id) {
			_selectedAblagen.splice(i, 1);
			break;
		}
	}

	setAblagen(_selectedAblagen);
}

function showMessagesAblagen(messages) {
	$("#divAblagen .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Kontext
function InitButtonSelectKontext() {
	$("#buttonAddKontext").click(addKontext);
}

function addKontext() {
	if (_selectedKontext == null)	
	{
		return;
	}

	for (i = 0; i < _selectedKontexte.length; i++) {
		if (_selectedKontexte[i].Id == _selectedKontext.Id) {
			return;
		}
	}

	_selectedKontexte.push(_selectedKontext);
	setKontexte(_selectedKontexte);
	$("#textBoxSearchKontextByPath").val("");
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

function setKontexte(kontexte) {
	$("#divKontexte div #divKontextList").empty();
	$("#divKontexte div #divKontextList").append($("<ul>"));

	kontexte.forEach(kontext => {
		var li = $("<li>");

		var linkButtonDelete = $("<a>");
		linkButtonDelete.attr("title", "löschen");
		linkButtonDelete.attr("class", "ui-button risky-action");
		linkButtonDelete.attr("href", "javascript:removeKontext(" + kontext.Id + ");");

		var icon = $("<i>");
		icon.attr("class", "fas fa-trash-alt");
		linkButtonDelete.append(icon);
		li.append(linkButtonDelete);

		li.append("&nbsp;");

		var linkKontext = $("<a>");
		linkKontext.attr("title", "gehe zu");
		linkKontext.attr("href", "../../pages/Kontext/Form.html?Id=" + kontext.Id);
		linkKontext.text(kontext.Path);
		li.append(linkKontext);

		$("#divKontexte div #divKontextList ul").append(li);
	});
}

function removeKontext(kontextId) {
	var kontext = new Object();
	kontext.Id = kontextId;

	for (i = 0; i < _selectedKontexte.length; i++) {
		if (_selectedKontexte[i].Id == kontext.Id) {
			_selectedKontexte.splice(i, 1);
			break;
		}
	}

	setKontexte(_selectedKontexte);
}

function showMessagesKontexte(messages) {
	$("#divKontexte .fieldValue div[name=messages]").text(messages);
}
//#endregion
//#endregion

function clearSelectedItemHighlighting() {
    $(".jsgrid-row, .jsgrid-alt-row").each(function(index){
        $(this).removeClass("selected-row");
    });
}

function markSelectedItem(selectedItemIndex) {
    if (selectedItemIndex == undefined ||
        selectedItemIndex == null)
    {
        console.error("Selected item index is not set!")
        return;
    }

	console.debug("Selected item index", selectedItemIndex);

    var row = $(".jsgrid-row, .jsgrid-alt-row").eq(selectedItemIndex)

	if (row.hasClass("selected-row"))
	{
		console.debug("Deselect row");
	    row.removeClass("selected-row");
	}
	else
	{
		clearSelectedItemHighlighting();

		console.debug("Select row");
	    row.addClass("selected-row");
	}
}

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

function InitGrid()
{
    jsGrid.locale("de");
    jsGrid.fields.image = ImageField;
	jsGrid.fields.linkToFundFormField = LinkToFundFormField;
	jsGrid.fields.checking = CheckingField;
	jsGrid.fields.rating = RatingField;

    $("#gridContainer").jsGrid({
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
				title: "Ablage",
				name: "AblageLinkedPath",
				type: "text"
			},
			{
				title: "Kontext",
				name: "KontextLinkedPath",
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

        rowClick: function(args) {
			console.info("row clicked");
			console.debug("clicked item", args.item);
			markSelectedItem(args.itemIndex);
			_viewModelSearchResultListFund.selectItem(args.item);
        },

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
	$("#grid").empty();

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

		if (copy.Ablage != null)
		{
			copy.AblageLinkedPath = "<a href='/pages/Ablage/Form.html?Id=" + copy.Ablage.Id + "' target='_self'>" + copy.Ablage.Path + "</a>";
		}

		if (copy.Kontext != null)
		{
			copy.KontextLinkedPath = "<a href='/pages/" + copy.Kontext.Type.Bezeichnung + "/Form.html?Id=" + copy.Kontext.Id + "' target='_self'>" + copy.Kontext.Path + "</a>";
		}

		entries.push(copy);
	});

	$("#gridContainer").jsGrid({
		data: entries
	});
}

function ShowMessageSearchResultDisplayed(elements) {
    showInformationMessageBox("Suchergebnis angezeigt");
}

function InitButtonSearch() {
	$("#buttonSearch").click(search);
}

function getSearchConditions() {
	let searchConditions  = new Array();

	if ($("#textboxFilterBeschriftung").val() != "")
	{
		if ($("[name='choiceFilterBeschriftung']:checked").val() == "exact")
		{
			searchConditions.push({ "key" : "bezeichnung", "value" : $("#textboxFilterBeschriftung").val() });
		}
		else if ($("[name='choiceFilterBeschriftung']:checked").val() == "contains")
		{
			searchConditions.push({ "key" : "containsBezeichnung", "value" : $("#textboxFilterBeschriftung").val() });
		}
		searchConditions.push({ "key" : "containsBezeichnung", "value" : $("#textboxFilterBeschriftung").val() });
	}

	if ($("[name='choiceFilterHasFundAttribute']:checked").val() == "yes")
	{
		searchConditions.push({ "key" : "hasFundAttribute", "value" : "true" });
	}
	else if ($("[name='choiceFilterHasFundAttribute']:checked").val() == "no")
	{
		searchConditions.push({ "key" : "hasFundAttribute", "value" : "false" });
	}

	if ($("[name='choiceFilterHasFundAttribute']:checked").val() != "no" &&
		_selectedFundattribute.length >=1)
	{
		let fundattributIdList = new Array();

		for (i = 0; i < _selectedFundattribute.length; i++) {
			fundattributIdList.push(_selectedFundattribute[i].Id);
		}

		searchConditions.push({ "key" : "fundAttribut_Ids", "value" : fundattributIdList.join() });
	}

	if ($("[name='choiceFilterHasAblage']:checked").val() == "yes")
	{
		searchConditions.push({ "key" : "hasAblage", "value" : "true" });
	}
	else if ($("[name='choiceFilterHasAblage']:checked").val() == "no")
	{
		searchConditions.push({ "key" : "hasAblage", "value" : "false" });
	}

	if ($("[name='choiceFilterHasAblage']:checked").val() != "no" && 
		_selectedAblagen.length >= 1)
	{
		let ablageIdList = new Array();

		for (i = 0; i < _selectedAblagen.length; i++) {
			ablageIdList.push(_selectedAblagen[i].Id);
		}

		searchConditions.push({ "key" : "ablage_Ids", "value" : ablageIdList.join() });
	}

	if ($("[name='choiceFilterHasKontext']:checked").val() == "yes")
	{
		searchConditions.push({ "key" : "hasKontext", "value" : "true" });
	}
	else if ($("[name='choiceFilterHasKontext']:checked").val() == "no")
	{
		searchConditions.push({ "key" : "hasKontext", "value" : "false" });
	}

	if ($("[name='choiceFilterHasKontext']:checked").val() != "no" &&
		_selectedKontexte.length >= 1)
	{
		let kontextIdList = new Array();

		for (i = 0; i < _selectedKontexte.length; i++) {
			kontextIdList.push(_selectedKontexte[i].Id);
		}

		searchConditions.push({ "key" : "kontext_Ids", "value" : kontextIdList.join() });
	}

	if ($("[name='choiceFilterRatingPrecision']:checked").val() == "exact")
	{
		searchConditions.push({ "key" : "rating", "value" : $("#choiceFilterRating").val() });
	}
	
	if ($("[name='choiceFilterRatingPrecision']:checked").val() == "min")
	{
		searchConditions.push({ "key" : "minRating", "value" : $("#choiceFilterRating").val() });
	}
	
	if ($("[name='choiceFilterHasFileName']:checked").val() == "yes")
	{
		searchConditions.push({ "key" : "hasFileName", "value" : "true" });
	}
	else if ($("[name='choiceFilterHasFileName']:checked").val() == "no")
	{
		searchConditions.push({ "key" : "hasFileName", "value" : "false" });
	}

	if ($("#textboxFilterFileName").val() != "")
	{
		if ($("[name='choiceFilterFileName']:checked").val() == "exact")
		{
			searchConditions.push({ "key" : "fileName", "value" : $("#textboxFilterFileName").val() });
		}
		else if ($("[name='choiceFilterFileName']:checked").val() == "contains")
		{
			searchConditions.push({ "key" : "containsFileName", "value" : $("#textboxFilterFileName").val() });
		}
		searchConditions.push({ "key" : "containsFileName", "value" : $("#textboxFilterFileName").val() });
	}
	
	if ($("[name='choiceFilterIsChecked']:checked").val() == "yes")
	{
		searchConditions.push({ "key" : "isChecked", "value" : "true" });
	}
	else if ($("[name='choiceFilterIsChecked']:checked").val() == "no")
	{
		searchConditions.push({ "key" : "isChecked", "value" : "false" });
	}

	return searchConditions;
}

function search() {
	_viewModelSearchResultListFund.search(getSearchConditions());
}

function setLabelCount(count) {
	$("#labelCount").text("Trefferanzahl: " + count);
}

function resetLabelCount() {
	$("#labelCount").text("Trefferanzahl: ?");
}

function initButtonGoToFirstPage() {
	disableButtonGoToFirstPage();
}

function enableButtonGoToFirstPage(count) {
	if (count == 0) 
	{
		disableButtonGoToFirstPage();
		return;
	}

	$("#buttonGoToFirstPage").off("click");
	$("#buttonGoToFirstPage").click(function () { _viewModelSearchResultListFund.goToFirstPage(); });
	$("#buttonGoToFirstPage").removeClass("disabled");
	$("#buttonGoToFirstPage").prop("disabled", false);
}

function disableButtonGoToFirstPage() {
	$("#buttonGoToFirstPage").off("click");
	$("#buttonGoToFirstPage").addClass("disabled");
	$("#buttonGoToFirstPage").prop("disabled", true);
}

function initButtonGoToPreviousPage() {
	disableButtonGoToPreviousPage();
}

function enableButtonGoToPreviousPage(count) {
	if (count == 0) 
	{
		disableButtonGoToPreviousPage();
		return;
	}

	$("#buttonGoToPreviousPage").off("click");
	$("#buttonGoToPreviousPage").click(function () { _viewModelSearchResultListFund.goToPreviousPage(); });
	$("#buttonGoToPreviousPage").removeClass("disabled");
	$("#buttonGoToPreviousPage").prop("disabled", false);
}

function disableButtonGoToPreviousPage() {
	$("#buttonGoToPreviousPage").off("click");
	$("#buttonGoToPreviousPage").addClass("disabled");
	$("#buttonGoToPreviousPage").prop("disabled", true);
}

function initButtonGoToNextPage() {
	disableButtonGoToNextPage();
}

function enableButtonGoToNextPage(count) {
	if (count == 0) 
	{
		disableButtonGoToNextPage();
		return;
	}

	$("#buttonGoToNextPage").off("click");
	$("#buttonGoToNextPage").click(function () { _viewModelSearchResultListFund.goToNextPage(); });
	$("#buttonGoToNextPage").removeClass("disabled");
	$("#buttonGoToNextPage").prop("disabled", false);
}

function disableButtonGoToNextPage() {
	$("#buttonGoToNextPage").off("click");
	$("#buttonGoToNextPage").addClass("disabled");
	$("#buttonGoToNextPage").prop("disabled", true);
}

function initButtonGoToLastPage() {
	disableButtonGoToLastPage();
}

function enableButtonGoToLastPage(count) {
	if (count == 0) 
	{
		disableButtonGoToLastPage();
		return;
	}

	$("#buttonGoToLastPage").off("click");
	$("#buttonGoToLastPage").click(function () { _viewModelSearchResultListFund.goToLastPage(); });
	$("#buttonGoToLastPage").removeClass("disabled");
	$("#buttonGoToLastPage").prop("disabled", false);
}

function disableButtonGoToLastPage() {
	$("#buttonGoToLastPage").off("click");
	$("#buttonGoToLastPage").addClass("disabled");
	$("#buttonGoToLastPage").prop("disabled", true);
}
