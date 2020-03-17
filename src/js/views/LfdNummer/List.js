var _viewModelListLfdNummer = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelListLfdNummer = viewModelFactory.getViewModelListLfdNummer();

    RegisterToViewModel();
    InitBreadcrumb();
    InitButtonNew();
    InitButtonEdit();
    InitButtonDelete();
    InitButtonReload();

    InitGrid();

    _viewModelListLfdNummer.loadAll();
});

function getPageName() {
	return "LfdNummerList";
}

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : getPageName()
	});
}

function RegisterToViewModel() {
	_viewModelListLfdNummer.register("dataChanged", new GuiClient(UpdateGridData, UpdateGridData));
	_viewModelListLfdNummer.register("loadAll", new GuiClient(showMessageAllLoaded, showErrorMessages));
	_viewModelListLfdNummer.register("create", new GuiClient(showMessageCreated, showErrorMessages));
	_viewModelListLfdNummer.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
    _viewModelListLfdNummer.register("itemSelected", new GuiClient(EnableButtonEdit, null));
    _viewModelListLfdNummer.register("itemSelected", new GuiClient(EnableButtonDelete, null));
    _viewModelListLfdNummer.register("selectionCleared", new GuiClient(DisableButtonEdit, null));
    _viewModelListLfdNummer.register("selectionCleared", new GuiClient(DisableButtonDelete, null));
}

function clearSelectedItemHighlighting() {
    $(".jsgrid-row, .jsgrid-alt-row").each(function(index){
        $(this).removeClass("selectedRow");
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

	if (row.hasClass("selectedRow"))
	{
		console.debug("Deselect row");
	    row.removeClass("selectedRow");
	}
	else
	{
		clearSelectedItemHighlighting();

		console.debug("Select row");
	    row.addClass("selectedRow");
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

function InitGrid()
{
    jsGrid.locale("de");
    jsGrid.fields.icon = IconField;

    $("#gridContainer").jsGrid({
        width: "100%",

        inserting: false,
        editing: false,
        sorting: true,
        paging: false,
        autoload: false,

        fields: [
			{
				title: "",
				name: "Icon",
				type: "icon",
				width: 16,
				sorting: false
			},
            {
				title: "Bezeichnung",
                name: "Bezeichnung",
                type: "text",
                validate: "required",
				sorting: true
            },
            {
                title: "Anzahl von Kontexten",
                name: "CountOfKontexte",
                type: "number",
                inserting: false,
                editing: false,
				sorting: true
            }
        ],

        rowClick: function(args) {
			console.info("row clicked");
			console.debug("clicked item", args.item);
			markSelectedItem(args.itemIndex);
			_viewModelListLfdNummer.selectItem(args.item);
        }
    });

    UpdateGridData(new Array());
}

function UpdateGridData(lfdNummern) {
    $("#grid").empty();

    var entries = new Array();

	lfdNummern.forEach(lfdNummer => {
		var copy = JSON.parse(JSON.stringify(lfdNummer));
		copy.Icon = IconConfig.getCssClasses("LfD-Nummer");
		entries.push(copy);
	});

	$("#gridContainer").jsGrid({
		data: entries
	});

	$("#grid").jsGrid("sort", "Bezeichnung");
}

function setIdToEditLink(id) {
    $("#buttonEdit").attr("href", "/Munins Archiv/src/pages/LfdNummer/Form.html?Id=" + id);
}

function showMessageAllLoaded(elements) {
    showInformationMessageBox(elements.length + " LfD-Nummern geladen");
}

function showMessageCreated(element) {
    showSuccessMessageBox("LfD-Nummer \"" + element.Bezeichnung + "\" erzeugt");
}

function showMessageSaved(element) {
    showSuccessMessageBox("LfD-Nummern \"" + element.Bezeichnung + "\" gespeichert");
}

function showMessageDeleted(element) {
    showSuccessMessageBox("LfD-Nummern \"" + element.Bezeichnung + "\" gelöscht");
}

//#region form actions
//#region new
function InitButtonNew() {
	EnableButtonNew();
    $("#buttonNew").click(function () {
        console.log("button 'new' clicked");
        window.open("/Munins Archiv/src/pages/LfdNummer/Form.html", "_self");
    });
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

//#region edit
function InitButtonEdit() {
	DisableButtonEdit();
	$("#buttonEdit").click(function () {
        console.log("button 'edit' clicked");
        window.open("/Munins Archiv/src/pages/LfdNummer/Form.html?Id=" + _viewModelListLfdNummer.getSelectedItem().Id, "_self");
    });
}

function EnableButtonEdit() {
	$("#buttonEdit").removeClass("disabled");
	$("#buttonEdit").prop("disabled", false);
}

function DisableButtonEdit() {
	$("#buttonEdit").addClass("disabled");
	$("#buttonEdit").prop("disabled", true);
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
		$("<p>").append("Möchten Sie die LfD-Nummer \"" + _viewModelListLfdNummer.getSelectedItem().Bezeichnung + "\" löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		width: 750,
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelListLfdNummer.delete(_viewModelListLfdNummer.getSelectedItem());

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

//#region reload
function InitButtonReload() {
	EnableButtonReload();
    $("#buttonReload").click(function () {
        console.log("button 'reload' clicked");
        _viewModelListLfdNummer.loadAll();
    });
}

function EnableButtonReload() {
	$("#buttonReload").removeClass("disabled");
	$("#buttonReload").prop("disabled", false);
}

function DisableButtonReload() {
	$("#buttonReload").addClass("disabled");
	$("#buttonReload").prop("disabled", true);
}
//#endregion
//#endregion
