var _viewModelSearchResultListFund = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelSearchResultListFund = viewModelFactory.getViewModelSearchResultListFund();

    RegisterToViewModel();

	InitButtonSearch();

    InitGrid();
});

function getPageName() {
	return "FundSearch";
}

function RegisterToViewModel() {
	_viewModelSearchResultListFund.register("dataChanged", new GuiClient(UpdateGridData, UpdateGridData));
	_viewModelSearchResultListFund.register("search", new GuiClient(ShowMessageSearchResultDisplayed, showErrorMessages));
}

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
	$("#buttonSearch").click(
		function() {
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

			_viewModelSearchResultListFund.search(searchConditions);
		}
	);
}