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
	_viewModelListLfdNummer.register("itemSelected", new GuiClient(markSelectedItem, showErrorMessages));
    _viewModelListLfdNummer.register("itemSelected", new GuiClient(EnableButtonEdit, null));
    _viewModelListLfdNummer.register("itemSelected", new GuiClient(EnableButtonDelete, null));
    _viewModelListLfdNummer.register("selectionCleared", new GuiClient(clearSelectedItemHighlighting, null));
    _viewModelListLfdNummer.register("selectionCleared", new GuiClient(DisableButtonEdit, null));
    _viewModelListLfdNummer.register("selectionCleared", new GuiClient(DisableButtonDelete, null));
}

function clearSelectedItemHighlighting() {
    $(".jsgrid-row, .jsgrid-alt-row").each(function(index){
        console.log("DEBUG: Removing css class from:")
        console.log($(this));
        $(this).removeClass("selectedRow");
    });
}

function markSelectedItem(selectedItemArgs) {
    clearSelectedItemHighlighting();

    if (selectedItemArgs == undefined ||
        selectedItemArgs == null ||
        selectedItemArgs.Index == undefined)
    {
        console.log("ERROR: Setting selected item index is not set!")
        return;
    }

    console.log("DEBUG: Setting selected item:")
    console.log(selectedItemArgs);

    var row = $(".jsgrid-row, .jsgrid-alt-row").eq(selectedItemArgs.Index)

    console.log("DEBUG: Selected row:");
    console.log(row);

    row.addClass("selectedRow");
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
        sorting: false,
        paging: false,
        autoload: false,

        fields: [
			{
				title: "Icon",
				name: "Icon",
				type: "icon"
			},
            {
                name: "Bezeichnung",
                type: "text",
                validate: "required"
            },
            {
                title: "Anzahl von Kontexten",
                name: "CountOfKontexte",
                type: "number",
                inserting: false,
                editing: false
            }
        ],

        rowClick: function(args) {
            console.log("DEBUG: Selected element:");
            console.log(args.item);
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
}

function setIdToEditLink(id) {
    $("#buttonEdit").attr("href", "/Munins Archiv/src/pages/LfdNummer/Form.html?Id=" + id);
}

function showMessageAllLoaded(elements) {
    $.toast({
        heading: "Information",
        text: elements.length + " LfD-Nummern geladen",
        icon: "info"
    });
}

function showMessageCreated(element) {
    $.toast({
        heading: "Information",
        text: "LfD-Nummer \"" + element.Bezeichnung + "\" erzeugt",
        icon: "success"
    });
}

function showMessageSaved(element) {
    $.toast({
        heading: "Information",
        text: "LfD-Nummern \"" + element.Bezeichnung + "\" gespeichert",
        icon: "success"
    });
}

function showMessageDeleted(element) {
    $.toast({
        heading: "Information",
        text: "LfD-Nummern \"" + element.Bezeichnung + "\" gelöscht",
        icon: "success"
    });
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
