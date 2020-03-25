var _viewModelListOrtType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelListOrtType = viewModelFactory.getViewModelListOrtType();

    RegisterToViewModel();
    InitButtonNew();
    InitButtonEdit();
    InitButtonDelete();

    InitGrid();

    _viewModelListOrtType.loadAll();
});

function getPageName() {
	return "OrtTypeList";
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
				width: 27,
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
}

function EnableButtonNew() {
	$("#buttonNew").off("click");
    $("#buttonNew").click(function () {
        console.log("button 'new' clicked");
        window.open("/Munins Archiv/src/pages/OrtType/Form.html", "_self");
    });
	$("#buttonNew").removeClass("disabled");
	$("#buttonNew").prop("disabled", false);
}

function DisableButtonNew() {
	$("#buttonNew").off("click");
	$("#buttonNew").addClass("disabled");
	$("#buttonNew").prop("disabled", true);
}
//#endregion

//#region edit
function InitButtonEdit() {
	DisableButtonEdit();
}

function EnableButtonEdit() {
	$("#buttonEdit").off("click");
	$("#buttonEdit").click(function () {
		console.log("button 'edit' clicked");
		window.open("/Munins Archiv/src/pages/OrtType/Form.html?Id=" + _viewModelListOrtType.getSelectedItem().Id, "_self");
	});
	$("#buttonEdit").removeClass("disabled");
	$("#buttonEdit").prop("disabled", false);
}

function DisableButtonEdit() {
	$("#buttonEdit").off("click");
	$("#buttonEdit").addClass("disabled");
	$("#buttonEdit").prop("disabled", true);
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
		$("<p>").append("Möchten Sie den Orttyp \"" + _viewModelListOrtType.getSelectedItem().Bezeichnung + "\" löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
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
//#endregion
