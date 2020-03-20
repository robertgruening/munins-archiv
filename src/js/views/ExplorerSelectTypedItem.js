var _htmlContainerElement = null;
var _viewModelExplorer = null;
var _iconCssClasses = null;
var _selectedItem = null;

function esti_initExplorerSelectTypedItem(htmlContainerElement, viewModelExplorer, iconCssClasses) {
	_htmlContainerElement = htmlContainerElement;
	_viewModelExplorer = viewModelExplorer;
	_iconCssClasses = iconCssClasses;
	_selectedItem = null;

    esti_registerToViewModel();
	esti_initButtonOpen();
	esti_initButtonOpenParent();
	esti_initButtonOpenAbstractRoot();

	esti_initFieldPath();
	esti_initGrid();

    _viewModelExplorer.load();
}

function esti_registerToViewModel() {
	_viewModelExplorer.register("childItemSelected", new GuiClient(esti_setSelectedItem, showErrorMessages));
	_viewModelExplorer.register("childItemSelected", new GuiClient(esti_enableButtonOpen, null));
	_viewModelExplorer.register("childSelectionCleared", new GuiClient(esti_disableButtonOpen, null));
}

function esti_resetSelectedItem() {
	_selectedItem = null;
}

function esti_setSelectedItem(selectedItemArgs) {
    if (selectedItemArgs == undefined ||
        selectedItemArgs == null ||
        selectedItemArgs.SelectedItem == undefined ||
        selectedItemArgs.SelectedItem == null)
    {
        esti_resetSelectedItem();
        return;
    }

    _selectedItem = selectedItemArgs.SelectedItem;
}

function esti_getSelectedItem() {
	return _selectedItem;
}

function esti_clearSelectedItemHighlighting() {
    $(".jsgrid-row, .jsgrid-alt-row", _htmlContainerElement).each(function(index){
        $(this).removeClass("selected-row");
    });
}

function esti_markSelectedChildItem(selectedItemIndex) {
    if (selectedItemIndex == undefined ||
        selectedItemIndex == null)
    {
        console.error("Selected child item index is not set!")
        return;
    }

	console.debug("Selected child item index", selectedItemIndex);

    var row = $(".jsgrid-row, .jsgrid-alt-row", _htmlContainerElement).eq(selectedItemIndex)

	if (row.hasClass("selected-row"))
	{
		console.debug("Deselect row");
	    row.removeClass("selected-row");
	}
	else
	{
		esti_clearSelectedItemHighlighting();

		console.debug("Select row");
	    row.addClass("selected-row");
	}
}

//#region form actions
//#region open
function esti_initButtonOpen() {
	esti_disableButtonOpen();
}

function esti_enableButtonOpen(args) {
	if (args.SelectedItem.Id === undefined) {
		$("#buttonOpen", _htmlContainerElement).attr("href", "javascript:_viewModelExplorer.load()");
	}
	else {
		$("#buttonOpen", _htmlContainerElement).attr("href", "javascript:_viewModelExplorer.load(" + args.SelectedItem.Id + ")");
	}

	$("#buttonOpen", _htmlContainerElement).removeClass("disabled");
	$("#buttonOpen", _htmlContainerElement).prop("disabled", false);
}

function esti_disableButtonOpen() {
	$("#buttonOpen", _htmlContainerElement).removeAttr("href");
	$("#buttonOpen", _htmlContainerElement).addClass("disabled");
	$("#buttonOpen", _htmlContainerElement).prop("disabled", true);
}
//#endregion

//#region open parent
function esti_initButtonOpenParent() {
	esti_disableButtonOpenParent();
	_viewModelExplorer.register("parent", new GuiClient(esti_enableButtonOpenParent, showErrorMessages));
}

function esti_enableButtonOpenParent(parent) {
	if (parent === undefined ||
		parent === null)
	{
		esti_disableButtonOpenParent();
		return;
	}

	if (parent.Id === undefined) {
		$("#buttonOpenParent", _htmlContainerElement).attr("href", "javascript:_viewModelExplorer.load()");
	}
	else {
		$("#buttonOpenParent", _htmlContainerElement).attr("href", "javascript:_viewModelExplorer.load(" + parent.Id + ")");
	}

	$("#buttonOpenParent", _htmlContainerElement).removeClass("disabled");
	$("#buttonOpenParent", _htmlContainerElement).prop("disabled", false);
}

function esti_disableButtonOpenParent() {
	$("#buttonOpenParent", _htmlContainerElement).removeAttr("href");
	$("#buttonOpenParent", _htmlContainerElement).addClass("disabled");
	$("#buttonOpenParent", _htmlContainerElement).prop("disabled", true);
}
//#endregion

//#region open abstract root
function esti_initButtonOpenAbstractRoot() {
	esti_disableButtonOpenAbstractRoot();
	_viewModelExplorer.register("parent", new GuiClient(esti_enableButtonOpenAbstractRoot, showErrorMessages));
}

function esti_enableButtonOpenAbstractRoot(parent) {
	if (parent === undefined ||
		parent === null)
	{
		esti_disableButtonOpenAbstractRoot();
		return;
	}

	$("#buttonOpenAbstractRoot", _htmlContainerElement).attr("href", "javascript:_viewModelExplorer.load()");
	$("#buttonOpenAbstractRoot", _htmlContainerElement).removeClass("disabled");
	$("#buttonOpenAbstractRoot", _htmlContainerElement).prop("disabled", false);
}

function esti_disableButtonOpenAbstractRoot() {
	$("#buttonOpenAbstractRoot", _htmlContainerElement).removeAttr("href");
	$("#buttonOpenAbstractRoot", _htmlContainerElement).addClass("disabled");
	$("#buttonOpenAbstractRoot", _htmlContainerElement).prop("disabled", true);
}
//#endregion
//#endregion

//#region fields
//#region path
function esti_initFieldPath() {
	_viewModelExplorer.register("path", new GuiClient(esti_setPath, showErrorMessages));
}

function esti_setPath(path) {
	console.info("setting value of 'Path'");
	console.debug("'Path' is", path);

	if (!path.startsWith("/")) {
		console.warn("added '/' to path");
		path = "/" + path;
	}

	$("#path", _htmlContainerElement).val(path);
}
//#endregion
//#endregion

//#region grid
var IconField = function(config) {
	jsGrid.Field.call(this, config);
}

IconField.prototype = new jsGrid.Field({
	itemTemplate: function(value) {
		return $("<i>", _htmlContainerElement).addClass(value);
	}
});

function esti_initGrid()
{
	_viewModelExplorer.register("children", new GuiClient(esti_updateGridDataChildren, showErrorMessages));

    jsGrid.fields.icon = IconField;

    $("#explorerSelect", _htmlContainerElement).jsGrid({
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
			esti_markSelectedChildItem(args.itemIndex);
			_viewModelExplorer.selectChildItem(args.item);
        },

		rowDoubleClick: function(args) {
			console.info("row double clicked");
			console.debug("clicked item", args.item);
			esti_markSelectedChildItem(args.itemIndex);
			console.warn("view model will not be informed about double clicked grid item");
			_viewModelExplorer.load(args.item.Id);
		}
    });
}

function esti_updateGridDataChildren(children) {
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

	$("#explorerSelect", _htmlContainerElement).jsGrid({
		data: entries
	});

	$("#explorerSelect", _htmlContainerElement).jsGrid("sort", "Bezeichnung");
	$("#explorerSelect", _htmlContainerElement).jsGrid("sort", "TypeBezeichnung");
}
//#endregion
