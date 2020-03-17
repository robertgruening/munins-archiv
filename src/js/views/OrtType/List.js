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
    _viewModelListOrtType.register("itemSelected", new GuiClient(EnableButtonEdit, null));
    _viewModelListOrtType.register("itemSelected", new GuiClient(EnableButtonDelete, null));
    _viewModelListOrtType.register("selectionCleared", new GuiClient(DisableButtonEdit, null));
    _viewModelListOrtType.register("selectionCleared", new GuiClient(DisableButtonDelete, null));
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
                title: "Anzahl von Orten",
                name: "CountOfOrten",
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

	$("#grid").jsGrid("sort", "Bezeichnung");
}

function setIdToEditLink(id) {
    $("#buttonEdit").attr("href", "/Munins Archiv/src/pages/OrtType/Form.html?Id=" + id);
}

function showMessageAllLoaded(elements) {
    showInformationMessageBox(elements.length + " Ortstypen geladen");
}

function showMessageCreated(element) {
    showSuccessMessageBox("Ortstyp \"" + element.Bezeichnung + "\" erzeugt");
}

function showMessageSaved(element) {
    showSuccessMessageBox("Ortstyp \"" + element.Bezeichnung + "\" gespeichert");
}

function showMessageDeleted(element) {
    showSuccessMessageBox("Ortstyp \"" + element.Bezeichnung + "\" gelöscht");
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
