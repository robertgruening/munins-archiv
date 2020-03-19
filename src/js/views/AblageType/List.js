var _viewModelListAblageType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelListAblageType = viewModelFactory.getViewModelListAblageType();

    RegisterToViewModel();
    InitBreadcrumb();
    InitButtonNew();
    InitButtonEdit();
    InitButtonDelete();
    InitButtonReload();

    InitGrid();

    _viewModelListAblageType.loadAll();
});

function getPageName() {
	return "AblageTypeList";
}

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : getPageName()
	});
}

function RegisterToViewModel() {
	_viewModelListAblageType.register("dataChanged", new GuiClient(UpdateGridData, UpdateGridData));
	_viewModelListAblageType.register("loadAll", new GuiClient(showMessageAllLoaded, showErrorMessages));
	_viewModelListAblageType.register("create", new GuiClient(showMessageCreated, showErrorMessages));
	_viewModelListAblageType.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
    _viewModelListAblageType.register("itemSelected", new GuiClient(EnableButtonEdit, null));
    _viewModelListAblageType.register("itemSelected", new GuiClient(EnableButtonDelete, null));
    _viewModelListAblageType.register("selectionCleared", new GuiClient(DisableButtonEdit, null));
    _viewModelListAblageType.register("selectionCleared", new GuiClient(DisableButtonDelete, null));
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
                title: "Anzahl von Ablagen",
                name: "CountOfAblagen",
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
			_viewModelListAblageType.selectItem(args.item);
        }
    });

    UpdateGridData(new Array());
}

function UpdateGridData(ablageTypes) {
    $("#grid").empty();

    var entries = new Array();

	ablageTypes.forEach(ablageType => {
		var copy = JSON.parse(JSON.stringify(ablageType));
		copy.Icon = IconConfig.getCssClasses("Ablage");
		entries.push(copy);
	});

	$("#gridContainer").jsGrid({
		data: entries
	});

	$("#grid").jsGrid("sort", "Bezeichnung");
}

function setIdToEditLink(id) {
    $("#buttonEdit").attr("href", "/Munins Archiv/src/pages/AblageType/Form.html?Id=" + id);
}

function showMessageAllLoaded(elements) {
	showInformationMessageBox(elements.length + " Ablagetypen geladen");
}

function showMessageCreated(element) {
	showSuccessMessageBox("Ablagetyp \"" + element.Bezeichnung + "\" erzeugt");
}

function showMessageSaved(element) {
	showSuccessMessageBox("Ablagetyp \"" + element.Bezeichnung + "\" gespeichert");
}

function showMessageDeleted(element) {
	showSuccessMessageBox("Ablagetyp \"" + element.Bezeichnung + "\" gelöscht");
}

//#region form actions
//#region new
function InitButtonNew() {
	EnableButtonNew();
}

function EnableButtonNew() {
	$("#buttonNew").click(function () {
		console.log("button 'new' clicked");
		window.open("/Munins Archiv/src/pages/AblageType/Form.html", "_self");
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
	$("#buttonEdit").click(function () {
		console.log("button 'edit' clicked");
		window.open("/Munins Archiv/src/pages/AblageType/Form.html?Id=" + _viewModelListAblageType.getSelectedItem().Id, "_self");
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
		$("<p>").append("Möchten Sie den Ablagetyp \"" + _viewModelListAblageType.getSelectedItem().Bezeichnung + "\" löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		width: 750,
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelListAblageType.delete(_viewModelListAblageType.getSelectedItem());

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
}

function EnableButtonReload() {
	$("#buttonReload").click(function () {
		console.log("button 'reload' clicked");
		_viewModelListAblageType.loadAll();
	});
	$("#buttonReload").removeClass("disabled");
	$("#buttonReload").prop("disabled", false);
}

function DisableButtonReload() {
	$("#buttonReload").off("click");
	$("#buttonReload").addClass("disabled");
	$("#buttonReload").prop("disabled", true);
}
//#endregion
//#endregion
