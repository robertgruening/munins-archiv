var _viewModelExplorer = null;
var _iconCssClasses = null;
var _selectedItem = null;

function initExplorerSelectTypedItem(viewModelExplorer, iconCssClasses) {
	_viewModelExplorer = viewModelExplorer;
	_iconCssClasses = iconCssClasses;
	_selectedItem = null;

    registerToViewModel();
	initButtonOpen();
	initButtonOpenParent();
	initButtonOpenAbstractRoot();

	initFieldPath();
	initGrid();

    _viewModelExplorer.load();
}

function registerToViewModel() {
	_viewModelExplorer.register("childItemSelected", new GuiClient(setSelectedItem, showErrorMessages));
	_viewModelExplorer.register("childItemSelected", new GuiClient(enableButtonOpen, null));
	_viewModelExplorer.register("childSelectionCleared", new GuiClient(disableButtonOpen, null));
}

function resetSelectedItem() {
	_selectedItem = null;
}

function setSelectedItem(selectedItemArgs) {
    if (selectedItemArgs == undefined ||
        selectedItemArgs == null ||
        selectedItemArgs.SelectedItem == undefined ||
        selectedItemArgs.SelectedItem == null)
    {
        resetSelectedItem();
        return;
    }

    _selectedItem = selectedItemArgs.SelectedItem;
}

function getSelectedItem() {
	return _selectedItem;
}

function clearSelectedItemHighlighting() {
    $(".jsgrid-row, .jsgrid-alt-row").each(function(index){
        $(this).removeClass("selectedRow");
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

//#region form actions
//#region open
function initButtonOpen() {
	disableButtonOpen();
}

function enableButtonOpen(args) {
	if (args.SelectedItem.Id === undefined) {
		$("#buttonOpen").attr("href", "javascript:_viewModelExplorer.load()");
	}
	else {
		$("#buttonOpen").attr("href", "javascript:_viewModelExplorer.load(" + args.SelectedItem.Id + ")");
	}

	$("#buttonOpen").removeClass("disabled");
	$("#buttonOpen").prop("disabled", false);
}

function disableButtonOpen() {
	$("#buttonOpen").addClass("disabled");
	$("#buttonOpen").prop("disabled", true);
}
//#endregion

//#region open parent
function initButtonOpenParent() {
	disableButtonOpenParent();
	_viewModelExplorer.register("parent", new GuiClient(enableButtonOpenParent, showErrorMessages));
}

function enableButtonOpenParent(parent) {
	if (parent === undefined ||
		parent === null)
	{
		disableButtonOpenParent();
		return;
	}

	if (parent.Id === undefined) {
		$("#buttonOpenParent").attr("href", "javascript:_viewModelExplorer.load()");
	}
	else {
		$("#buttonOpenParent").attr("href", "javascript:_viewModelExplorer.load(" + parent.Id + ")");
	}

	$("#buttonOpenParent").removeClass("disabled");
	$("#buttonOpenParent").prop("disabled", false);
}

function disableButtonOpenParent() {
	$("#buttonOpenParent").addClass("disabled");
	$("#buttonOpenParent").prop("disabled", true);
}
//#endregion

//#region open abstract root
function initButtonOpenAbstractRoot() {
	disableButtonOpenAbstractRoot();
	_viewModelExplorer.register("parent", new GuiClient(enableButtonOpenAbstractRoot, showErrorMessages));
	$("#buttonOpenAbstractRoot").attr("href", "javascript:_viewModelExplorer.load()");
}

function enableButtonOpenAbstractRoot(parent) {
	if (parent === undefined ||
		parent === null)
	{
		disableButtonOpenAbstractRoot();
		return;
	}

	$("#buttonOpenAbstractRoot").removeClass("disabled");
	$("#buttonOpenAbstractRoot").prop("disabled", false);
}

function disableButtonOpenAbstractRoot() {
	$("#buttonOpenAbstractRoot").addClass("disabled");
	$("#buttonOpenAbstractRoot").prop("disabled", true);
}
//#endregion
//#endregion

//#region fields
//#region path
function initFieldPath() {
	_viewModelExplorer.register("path", new GuiClient(setPath, showErrorMessages));
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
//#endregion

//#region grid
var IconField = function(config) {
	jsGrid.Field.call(this, config);
}

IconField.prototype = new jsGrid.Field({
	itemTemplate: function(value) {
		return $("<i>").addClass(value);
	}
});

function initGrid()
{
	_viewModelExplorer.register("children", new GuiClient(updateGridDataChildren, showErrorMessages));

    jsGrid.fields.icon = IconField;

    $("#explorerSelect").jsGrid({
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
			_viewModelExplorer.selectChildItem(args.item);
        },

		rowDoubleClick: function(args) {
			console.info("row double clicked");
			console.debug("clicked item", args.item);
			markSelectedChildItem(args.itemIndex);
			console.warn("view model will not be informed about double clicked grid item");
			_viewModelExplorer.load(args.item.Id);
		}
    });
}

function updateGridDataChildren(children) {
	console.info("updating children in grid");
	console.debug("children", children);

	var entries = new Array();

	console.info("adding " + children.length + " children to the grid");

	children.forEach(child => {
		var copy = JSON.parse(JSON.stringify(child));
		copy.Icon = _iconCssClasses == null ? IconConfig.getCssClasses(child.Type.Bezeichnung) : _iconCssClasses;
		copy.TypeBezeichnung = child.Type.Bezeichnung;
		entries.push(copy);
	});

	$("#explorerSelect").jsGrid({
		data: entries
	});

	$("#explorerSelect").jsGrid("sort", "Bezeichnung");
	$("#explorerSelect").jsGrid("sort", "TypeBezeichnung");
}
//#endregion
