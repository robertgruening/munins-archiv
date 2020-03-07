var _viewModelListOrtType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelListOrtType = viewModelFactory.getViewModelListOrtType();

    RegisterToViewModel();
    InitBreadcrumb();
    InitButtonNew();
    InitButtonEdit();
    InitButtonDelete();
    InitButtonReload();

    InitGrid();

    _viewModelListOrtType.loadAll();
});

function getPageName() {
	return "OrtTypeList";
}

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : getPageName()
	});
}

function RegisterToViewModel() {
	_viewModelListOrtType.register("dataChanged", new GuiClient(UpdateGridData, UpdateGridData));
	_viewModelListOrtType.register("loadAll", new GuiClient(showMessageAllLoaded, showErrorMessages));
	_viewModelListOrtType.register("create", new GuiClient(showMessageCreated, showErrorMessages));
	_viewModelListOrtType.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
	_viewModelListOrtType.register("itemSelected", new GuiClient(markSelectedItem, showErrorMessages));
    _viewModelListOrtType.register("itemSelected", new GuiClient(EnableButtonEdit, null));
    _viewModelListOrtType.register("itemSelected", new GuiClient(EnableButtonDelete, null));
    _viewModelListOrtType.register("selectionCleared", new GuiClient(clearSelectedItemHighlighting, null));
    _viewModelListOrtType.register("selectionCleared", new GuiClient(DisableButtonEdit, null));
    _viewModelListOrtType.register("selectionCleared", new GuiClient(DisableButtonDelete, null));
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
				title: "",
				name: "Icon",
				type: "icon",
				width: 16
			},
            {
                name: "Bezeichnung",
                type: "text",
                validate: "required"
            },
            {
                title: "Anzahl von Orten",
                name: "CountOfOrten",
                type: "number",
                inserting: false,
                editing: false
            }
        ],

        rowClick: function(args) {
            console.log("DEBUG: Selected element:");
            console.log(args.item);
            _viewModelListOrtType.selectItem(args.item);
        }
    });

    UpdateGridData(new Array());
}

function UpdateGridData(ortTypes) {
    $("#grid").empty();

    var entries = new Array();

	ortTypes.forEach(ortType => {
		var copy = JSON.parse(JSON.stringify(ortType));
		copy.Icon = IconConfig.getCssClasses("Ort");
		entries.push(copy);
	});

	$("#gridContainer").jsGrid({
		data: entries
	});
}

function setIdToEditLink(id) {
    $("#buttonEdit").attr("href", "/Munins Archiv/src/pages/OrtType/Form.html?Id=" + id);
}

function showMessageAllLoaded(elements) {
    $.toast({
        heading: "Information",
        text: elements.length + " Ortstypen geladen",
        icon: "info"
    });
}

function showMessageCreated(element) {
    $.toast({
        heading: "Information",
        text: "Ortstyp \"" + element.Bezeichnung + "\" erzeugt",
        icon: "success"
    });
}

function showMessageSaved(element) {
    $.toast({
        heading: "Information",
        text: "Ortstyp \"" + element.Bezeichnung + "\" gespeichert",
        icon: "success"
    });
}

function showMessageDeleted(element) {
    $.toast({
        heading: "Information",
        text: "Ortstyp \"" + element.Bezeichnung + "\" gelöscht",
        icon: "success"
    });
}

//#region form actions
//#region new
function InitButtonNew() {
	EnableButtonNew();
    $("#buttonNew").click(function () {
        console.log("button 'new' clicked");
        window.open("/Munins Archiv/src/pages/OrtType/Form.html", "_self");
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
        window.open("/Munins Archiv/src/pages/OrtType/Form.html?Id=" + _viewModelListOrtType.getSelectedItem().Id, "_self");
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
		$("<p>").append("Möchten Sie den Orttyp \"" + _viewModelListOrtType.getSelectedItem().Bezeichnung + "\" löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		width: 750,
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelListOrtType.delete(_viewModelListOrtType.getSelectedItem());

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
        _viewModelListOrtType.loadAll();
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
