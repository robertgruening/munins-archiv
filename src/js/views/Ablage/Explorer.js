var _viewModelExplorerAblage = null;

$(document).ready(function() {
	var viewModelFactory = new ViewModelFactory();
	_viewModelExplorerAblage = viewModelFactory.getViewModelExplorerAblage();

    RegisterToViewModel();
	InitButtonNew();
	InitButtonOpen();
    InitButtonEdit();
    InitButtonDelete();
	InitButtonOpenParent();
	InitButtonOpenAbstractRoot();
	InitButtonScan();
	InitButtonPrintLabels();

	InitFieldPath();
	InitGrid();

	if (getUrlParameterValue("Id")) {
		_viewModelExplorerAblage.load(getUrlParameterValue("Id"));
	}
	else {
		_viewModelExplorerAblage.load();
	}
});

function getPageName() {
	return "AblageExplorer";
}

function RegisterToViewModel() {
	_viewModelExplorerAblage.register("id", new GuiClient(EnableButtonNew, showErrorMessages));
	_viewModelExplorerAblage.register("childItemSelected", new GuiClient(EnableButtonOpen, null));
	_viewModelExplorerAblage.register("childItemSelected", new GuiClient(EnableButtonEdit, null));
	_viewModelExplorerAblage.register("childItemSelected", new GuiClient(EnableButtonDelete, null));
	_viewModelExplorerAblage.register("childSelectionCleared", new GuiClient(DisableButtonOpen, null));
	_viewModelExplorerAblage.register("childSelectionCleared", new GuiClient(DisableButtonEdit, null));
	_viewModelExplorerAblage.register("childSelectionCleared", new GuiClient(DisableButtonDelete, null));
	_viewModelExplorerAblage.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function clearSelectedItemHighlighting() {
    $(".jsgrid-row, .jsgrid-alt-row").each(function(index){
        $(this).removeClass("selected-row");
    });
}

function markSelectedChildItem(selectedItemIndex) {
    if (selectedItemIndex == undefined ||
        selectedItemIndex == null)
    {
        console.error("Selected child item index is not set!")
        return;
    }

	console.debug("Selected child item index", selectedItemIndex);

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
//#region form actions
//#region new
function InitButtonNew() {
	EnableButtonNew();
	$("#buttonNew").attr("href", "/Munins Archiv/src/pages/Ablage/Form.html");
}

function EnableButtonNew(id) {
	if (id === undefined ||
		id === null) {

		$("#buttonNew").attr("href", "/Munins Archiv/src/pages/Ablage/Form.html");
	}
	else {
		$("#buttonNew").attr("href", "/Munins Archiv/src/pages/Ablage/Form.html?Parent_Id=" + id);
	}

	$("#buttonNew").removeClass("disabled");
	$("#buttonNew").prop("disabled", false);
}

function DisableButtonNew() {
	$("#buttonNew").removeAttr("href");
	$("#buttonNew").addClass("disabled");
	$("#buttonNew").prop("disabled", true);
}
//#endregion

//#region open
function InitButtonOpen() {
	DisableButtonOpen();
}

function EnableButtonOpen(args) {
	if (args.SelectedItem.Id === undefined) {
		$("#buttonOpen").attr("href", "/Munins Archiv/src/pages/Ablage/Explorer.html");
	}
	else {
		$("#buttonOpen").attr("href", "/Munins Archiv/src/pages/Ablage/Explorer.html?Id=" + args.SelectedItem.Id);
	}

	$("#buttonOpen").removeClass("disabled");
	$("#buttonOpen").prop("disabled", false);
}

function DisableButtonOpen() {
	$("#buttonOpen").removeAttr("href");
	$("#buttonOpen").addClass("disabled");
	$("#buttonOpen").prop("disabled", true);
}
//#endregion

//#region edit
function InitButtonEdit() {
	DisableButtonEdit();
}

function EnableButtonEdit(args) {
	if (args.SelectedItem.Id === undefined) {
		$("#buttonEdit").attr("href", "/Munins Archiv/src/pages/Ablage/Form.html");
	}
	else {
		$("#buttonEdit").attr("href", "/Munins Archiv/src/pages/Ablage/Form.html?Id=" + args.SelectedItem.Id);
	}

	$("#buttonEdit").removeClass("disabled");
	$("#buttonEdit").prop("disabled", false);
}

function DisableButtonEdit() {
	$("#buttonEdit").removeAttr("href");
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
		$("<p>").append("Möchten Sie diese Ablage löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelExplorerAblage.delete(_viewModelExplorerAblage.getSelectedChildItem());

				$(this).dialog("close");
			},
			"Abbrechen": function () {
				$(this).dialog("close");
			}
		}
	});

	$("#DialogDelete").dialog("open");
}

function showMessageDeleted(element) {
	showSuccessMessageBox("Ablage \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gelöscht");
}
//#endregion

//#region open parent
function InitButtonOpenParent() {
	DisableButtonOpenParent();
	_viewModelExplorerAblage.register("parent", new GuiClient(EnableButtonOpenParent, showErrorMessages));
}

function EnableButtonOpenParent(parent) {
	if (parent === undefined ||
		parent === null)
	{
		DisableButtonOpenParent();
		return;
	}

	if (parent.Id === undefined) {
		$("#buttonOpenParent").attr("href", "/Munins Archiv/src/pages/Ablage/Explorer.html");
	}
	else {
		$("#buttonOpenParent").attr("href", "/Munins Archiv/src/pages/Ablage/Explorer.html?Id=" + parent.Id);
	}

	$("#buttonOpenParent").removeClass("disabled");
	$("#buttonOpenParent").prop("disabled", false);
}

function DisableButtonOpenParent() {
	$("#buttonOpenParent").removeAttr("href");
	$("#buttonOpenParent").addClass("disabled");
	$("#buttonOpenParent").prop("disabled", true);
}
//#endregion

//#region open abstract root
function InitButtonOpenAbstractRoot() {
	DisableButtonOpenAbstractRoot();
	_viewModelExplorerAblage.register("parent", new GuiClient(EnableButtonOpenAbstractRoot, showErrorMessages));
}

function EnableButtonOpenAbstractRoot(parent) {
	if (parent === undefined ||
		parent === null)
	{
		DisableButtonOpenAbstractRoot();
		return;
	}

	$("#buttonOpenAbstractRoot").attr("href", "/Munins Archiv/src/pages/Ablage/Explorer.html");
	$("#buttonOpenAbstractRoot").removeClass("disabled");
	$("#buttonOpenAbstractRoot").prop("disabled", false);
}

function DisableButtonOpenAbstractRoot() {
	$("#buttonOpenAbstractRoot").removeAttr("href");
	$("#buttonOpenAbstractRoot").addClass("disabled");
	$("#buttonOpenAbstractRoot").prop("disabled", true);
}
//#endregion

//#region scan
function InitButtonScan() {
	$("#buttonScan").attr("href", "/Munins Archiv/src/pages/Ablage/Scan.html");
}
//#endregion

//#region print labels
function InitButtonPrintLabels() {
	$("#buttonPrintLabels").attr("href", "/Munins Archiv/src/pages/Ablage/PrintLabels.html");
}
//#endregion
//#endregion

//#region fields
//#region path
function InitFieldPath() {
	_viewModelExplorerAblage.register("path", new GuiClient(setPath, showErrorMessages));
}

function setPath(path) {
	console.info("setting value of 'Path'");
	console.debug("'Path' is", path);

	if (!path.startsWith("/")) {
		console.warn("added '/' to path");
		path = "/" + path;
	}

	$("#path").val(path);
}
//#endregion
//#endre

//#region grid
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
	_viewModelExplorerAblage.register("children", new GuiClient(UpdateGridDataChildren, showErrorMessages));

    jsGrid.fields.icon = IconField;

    $("#grid").jsGrid({
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
				title: "Typ",
				name: "TypeBezeichnung",
				type: "text",
				sorting: true
			},
			{
				name: "Bezeichnung",
				type: "text",
				validate: "required",
				sorting: true
			}
		],

        rowClick: function(args) {
			console.info("row clicked");
			console.debug("clicked item", args.item);
			markSelectedChildItem(args.itemIndex);
			_viewModelExplorerAblage.selectChildItem(args.item);
        },

		rowDoubleClick: function(args) {
			console.info("row double clicked");
			console.debug("clicked item", args.item);
			markSelectedChildItem(args.itemIndex);
			console.warn("view model will not be informed about double clicked grid item");
			window.open("/Munins Archiv/src/pages/Ablage/Explorer.html?Id=" + args.item.Id, "_self");
		}
    });
}

function UpdateGridDataChildren(children) {
	console.info("updating children in grid");
	console.debug("children", children);

	var entries = new Array();

	console.info("adding " + children.length + " children to the grid");

	children.forEach(child => {
		var copy = JSON.parse(JSON.stringify(child));
		copy.Icon = IconConfig.getCssClasses("Ablage");
		copy.TypeBezeichnung = child.Type.Bezeichnung;
		entries.push(copy);
	});

	$("#grid").jsGrid({
		data: entries
	});

	$("#grid").jsGrid("sort", "Bezeichnung");
	$("#grid").jsGrid("sort", "TypeBezeichnung");
}
//#endregion
