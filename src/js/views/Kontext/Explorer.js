var _viewModelExplorerKontext = null;

$(document).ready(function() {
	var viewModelFactory = new ViewModelFactory();
	_viewModelExplorerKontext = viewModelFactory.getViewModelExplorerKontext();

	RegisterToViewModel();
	InitButtonNew();
	InitButtonOpen();
	InitButtonEdit();
	InitButtonDelete();
	InitButtonOpenParent();
	InitButtonOpenAbstractRoot();
	InitButtonToMap();

	InitFieldPath();
	InitGrid();

	if (getUrlParameterValue("Id")) {
		_viewModelExplorerKontext.load(getUrlParameterValue("Id"));
	}
	else {
		_viewModelExplorerKontext.load();
	}
});

function getPageName() {
	return "KontextExplorer";
}

function RegisterToViewModel() {
	_viewModelExplorerKontext.register("id", new GuiClient(EnableButtonNew, showErrorMessages));
	_viewModelExplorerKontext.register("childItemSelected", new GuiClient(EnableButtonOpen, null));
	_viewModelExplorerKontext.register("childItemSelected", new GuiClient(EnableButtonEdit, null));
	_viewModelExplorerKontext.register("childItemSelected", new GuiClient(EnableButtonDelete, null));
	_viewModelExplorerKontext.register("childSelectionCleared", new GuiClient(DisableButtonOpen, null));
	_viewModelExplorerKontext.register("childSelectionCleared", new GuiClient(DisableButtonEdit, null));
	_viewModelExplorerKontext.register("childSelectionCleared", new GuiClient(DisableButtonDelete, null));
	_viewModelExplorerKontext.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function getChildKontextTypeBezeichnung(type) {
	if (type == null) {
		return "Fundstelle";
	}

	switch (type.Bezeichnung) {
		case "Fundstelle" : {
			return "Begehungsflaeche";
		}
		case "Begehungsfläche" : {
			return "Begehung";
		}
	}
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
}

function EnableButtonNew(id) {
if (id === undefined ||
	id === null) {

		$("#buttonNew").attr("href", "/Munins Archiv/src/pages/" + getChildKontextTypeBezeichnung(_viewModelExplorerKontext.getType()) + "/Form.html");
	}
	else {
		$("#buttonNew").attr("href", "/Munins Archiv/src/pages/" + getChildKontextTypeBezeichnung(_viewModelExplorerKontext.getType()) + "/Form.html?Parent_Id=" + id);
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
		$("#buttonOpen").attr("href", "/Munins Archiv/src/pages/Kontext/Explorer.html");
	}
	else {
		$("#buttonOpen").attr("href", "/Munins Archiv/src/pages/Kontext/Explorer.html?Id=" + args.SelectedItem.Id);
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
		$("#buttonEdit").attr("href", "/Munins Archiv/src/pages/" + getChildKontextTypeBezeichnung(_viewModelExplorerKontext.getType()) + "/Form.html");
	}
	else {
		$("#buttonEdit").attr("href", "/Munins Archiv/src/pages/" + getChildKontextTypeBezeichnung(_viewModelExplorerKontext.getType()) + "/Form.html?Id=" + args.SelectedItem.Id);
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
		$("<p>").append("Möchten Sie diesen Kontext löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelExplorerKontext.delete(_viewModelExplorerKontext.getSelectedChildItem());

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
	showSuccessMessageBox("Kontext \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gelöscht");
}
//#endregion

//#region open parent
function InitButtonOpenParent() {
	DisableButtonOpenParent();
	_viewModelExplorerKontext.register("parent", new GuiClient(EnableButtonOpenParent, showErrorMessages));
}

function EnableButtonOpenParent(parent)
{
	if (parent === undefined ||
		parent === null)
	{
		DisableButtonOpenParent();
		return;
	}

	if (parent.Id === undefined) {
		$("#buttonOpenParent").attr("href", "/Munins Archiv/src/pages/Kontext/Explorer.html");
	}
	else {
		$("#buttonOpenParent").attr("href", "/Munins Archiv/src/pages/Kontext/Explorer.html?Id=" + parent.Id);
	}

	$("#buttonOpenParent").removeClass("disabled");
	$("#buttonOpenParent").prop("disabled", false);
}

function DisableButtonOpenParent()
{
	$("#buttonOpenParent").removeAttr("href");
	$("#buttonOpenParent").addClass("disabled");
	$("#buttonOpenParent").prop("disabled", true);
}
//#endregion

//#region open abstract root
function InitButtonOpenAbstractRoot()
{
	DisableButtonOpenAbstractRoot();
	_viewModelExplorerKontext.register("parent", new GuiClient(EnableButtonOpenAbstractRoot, showErrorMessages));
}

function EnableButtonOpenAbstractRoot(parent)
{
	if (parent === undefined ||
		parent === null)
	{
		DisableButtonOpenAbstractRoot();
		return;
	}

	$("#buttonOpenAbstractRoot").attr("href", "/Munins Archiv/src/pages/Kontext/Explorer.html");
	$("#buttonOpenAbstractRoot").removeClass("disabled");
	$("#buttonOpenAbstractRoot").prop("disabled", false);
}

function DisableButtonOpenAbstractRoot()
{
	$("#buttonOpenAbstractRoot").removeAttr("href");
	$("#buttonOpenAbstractRoot").addClass("disabled");
	$("#buttonOpenAbstractRoot").prop("disabled", true);
}
//#endregion

//#region open map
function InitButtonToMap() {
	$("#buttonToMap").attr("href", "/Munins Archiv/src/pages/Fundstelle/Map.html", "_self");
}
//#endregon
//#endregion

//#region fields
//#region path
function InitFieldPath()
{
	_viewModelExplorerKontext.register("path", new GuiClient(setPath, showErrorMessages));
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
var IconField = function(config)
{
	jsGrid.Field.call(this, config);
}

IconField.prototype = new jsGrid.Field({
	itemTemplate: function(value) {
		return $("<i>").addClass(value);
	}
});

function InitGrid()
{
	_viewModelExplorerKontext.register("children", new GuiClient(UpdateGridDataChildren, showErrorMessages));

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
			_viewModelExplorerKontext.selectChildItem(args.item);
        },

		rowDoubleClick: function(args) {
			console.info("row double clicked");
			console.debug("clicked item", args.item);
			markSelectedChildItem(args.itemIndex);
			console.warn("view model will not be informed about double clicked grid item");
			window.open("/Munins Archiv/src/pages/Kontext/Explorer.html?Id=" + args.item.Id, "_self");
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
		copy.Icon = IconConfig.getCssClasses(child.Type.Bezeichnung);
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
