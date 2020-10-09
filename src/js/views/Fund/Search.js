var _viewModelSearchResultListFund = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelSearchResultListFund = viewModelFactory.getViewModelSearchResultListFund();

    RegisterToViewModel();
	InitButtonNew();

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
	$("#buttonNew").attr("href", "/Munins Archiv/src/pages/Fund/Form.html");
}

function EnableButtonNew() {
	$("#buttonNew").attr("href", "/Munins Archiv/src/pages/Fund/Form.html");
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
var IconField = function(config) {
	jsGrid.Field.call(this, config);
}

IconField.prototype = new jsGrid.Field({
	itemTemplate: function(value) {
		return $("<i>").addClass(value);
	}
});

var LinkToFundFormField = function(config) {
	jsGrid.Field.call(this, config);
}

LinkToFundFormField.prototype = new jsGrid.Field({
	itemTemplate: function(value) {
		var icon = $("<i>").addClass("fas fa-external-link-alt");
		var link = $("<a>").append(icon);
		$(link).attr("href", "/Munins Archiv/src/pages/Fund/Form.html?Id=" + value);
		$(link).attr("target", "_blank");
		$(link).attr("title", "Fundformular öffnen");
		return link;
	}
});

function InitGrid()
{
    jsGrid.locale("de");
    jsGrid.fields.icon = IconField;
	jsGrid.fields.linkToFundFormField = LinkToFundFormField;

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
				name: "Icon",
				type: "icon",
				width: 27
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

			window.open("/Munins Archiv/src/pages/Fund/Form.html?Id=" + args.item.Id, "_self");
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
		copy.Icon = IconConfig.getCssClasses("Fund");
		copy.Anzahl = fund.Anzahl.replace("-", ">");
		copy.FundAttributAnzeigeTexte = "<ul>"

		fund.FundAttribute.forEach(fundAttribut => {
			copy.FundAttributAnzeigeTexte += "<li>" + fundAttribut.Type.Bezeichnung + ": " + fundAttribut.Bezeichnung + "</li>"
		});

		copy.FundAttributAnzeigeTexte += "</ul>"

		if (copy.Ablage != null)
		{
			copy.AblageLinkedPath = "<a href='/Munins Archiv/src/pages/Ablage/Form.html?Id=" + copy.Ablage.Id + "' target='_self'>/" + copy.Ablage.Path + "</a>";
		}

		if (copy.Kontext != null)
		{
			copy.KontextLinkedPath = "<a href='/Munins Archiv/src/pages/" + copy.Kontext.Type.Bezeichnung + "/Form.html?Id=" + copy.Kontext.Id + "' target='_self'>/" + copy.Kontext.Path + "</a>";
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

	if ($("[name='choiceFilterHasAblage']:checked").val() == "yes")
	{
		searchConditions.push({ "key" : "hasAblage", "value" : "true" });
	}
	else if ($("[name='choiceFilterHasAblage']:checked").val() == "no")
	{
		searchConditions.push({ "key" : "hasAblage", "value" : "false" });
	}

	if ($("[name='choiceFilterHasKontext']:checked").val() == "yes")
	{
		searchConditions.push({ "key" : "hasKontext", "value" : "true" });
	}
	else if ($("[name='choiceFilterHasKontext']:checked").val() == "no")
	{
		searchConditions.push({ "key" : "hasKontext", "value" : "false" });
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