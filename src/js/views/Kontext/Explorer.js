var _viewModelExplorerKontext = null;

$(document).ready(function() {
	var viewModelFactory = new ViewModelFactory();
	_viewModelExplorerKontext = viewModelFactory.getViewModelExplorerKontext();

	RegisterToViewModel();
	InitBreadcrumb();
	InitButtonNew();
	InitButtonOpen();
	InitButtonEdit();
	InitButtonDelete();
	InitButtonOpenParent();
	InitButtonOpenAbstractRoot();

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
	_viewModelExplorerKontext.register("childItemSelected", new GuiClient(markSelectedChildItem, showErrorMessages));
	_viewModelExplorerKontext.register("childItemSelected", new GuiClient(EnableButtonOpen, null));
	_viewModelExplorerKontext.register("childItemSelected", new GuiClient(EnableButtonEdit, null));
	_viewModelExplorerKontext.register("childItemSelected", new GuiClient(EnableButtonDelete, null));
	_viewModelExplorerKontext.register("childSelectionCleared", new GuiClient(clearSelectedItemHighlighting, null));
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
		$(this).removeClass("selectedRow");
	});
}

function markSelectedParentItem(selectedItemArgs)
{
	clearSelectedItemHighlighting();

	if (selectedItemArgs == undefined ||
		selectedItemArgs == null ||
		selectedItemArgs.Index == undefined)
	{
		console.error("Setting selected parent item index is not set!")
		return;
	}

	console.debug("Setting selected parent item:", selectedItemArgs);

	var row = $(".jsgrid-row, .jsgrid-alt-row").eq(selectedItemArgs.Index)

	console.debug("Selected row:", row);

	row.addClass("selectedRow");
}

function markSelectedChildItem(selectedItemArgs)
{
	clearSelectedItemHighlighting();

	if (selectedItemArgs == undefined ||
		selectedItemArgs == null ||
		selectedItemArgs.Index == undefined)
	{
		console.error("Setting selected child item index is not set!")
		return;
	}

	console.debug("Setting selected child item:", selectedItemArgs);

	var row = $(".jsgrid-row, .jsgrid-alt-row").eq(selectedItemArgs.Index)

	console.debug("Selected row:", row);

	row.addClass("selectedRow");
}

function InitBreadcrumb()
{
	$("#breadcrumb").Breadcrumb({
		PageName : getPageName()
	});
}
//#region form actions
//#region new
function InitButtonNew() {
EnableButtonNew();
$("#buttonNew").attr("href", "/Munins Archiv/src/pages/" + getChildKontextTypeBezeichnung(null) + "/Form.html");
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
	$("#buttonNew").addClass("disabled");
	$("#buttonNew").prop("disabled", true);
}
//#endregion

//#region open
function InitButtonOpen() {
	DisableButtonOpen();
	$("#buttonOpen").click();
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
	$("#buttonOpen").addClass("disabled");
	$("#buttonOpen").prop("disabled", true);
}
//#endregion

//#region edit
function InitButtonEdit() {
	DisableButtonEdit();
	$("#buttonEdit").click();
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
		$("<p>").append("Möchten Sie diesen Kontext löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		width: 750,
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
	$.toast({
		heading: "Information",
		text: "Kontext \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gelöscht",
		icon: "success"
	});
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
	$("#buttonOpenParent").addClass("disabled");
	$("#buttonOpenParent").prop("disabled", true);
}
//#endregion

//#region open abstract root
function InitButtonOpenAbstractRoot()
{
	DisableButtonOpenAbstractRoot();
	_viewModelExplorerKontext.register("parent", new GuiClient(EnableButtonOpenAbstractRoot, showErrorMessages));
	$("#buttonOpenAbstractRoot").attr("href", "/Munins Archiv/src/pages/Kontext/Explorer.html");
}

function EnableButtonOpenAbstractRoot(parent)
{
	if (parent === undefined ||
		parent === null)
	{
		DisableButtonOpenAbstractRoot();
		return;
	}

	$("#buttonOpenAbstractRoot").removeClass("disabled");
	$("#buttonOpenAbstractRoot").prop("disabled", false);
}

function DisableButtonOpenAbstractRoot()
{
	$("#buttonOpenAbstractRoot").addClass("disabled");
	$("#buttonOpenAbstractRoot").prop("disabled", true);
}
//#endregion
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
				title: "Typ",
				name: "Type.Bezeichnung",
				type: "text"
			},
			{
				name: "Bezeichnung",
				type: "text",
				validate: "required"
			}
		],

		rowClick: function(args) {
			console.info("row clicked");
			console.debug("selected grid item", args.item);

			_viewModelExplorerKontext.selectChildItem(args.item);
		},

		rowDoubleClick: function(args) {
			console.info("row double clicked");
			console.debug("selected grid item", args.item);

			console.warn("view model will not be informed about double clicked grid item");

			if (args.item.Id === undefined) {
				console.debug("selected grid item is abstract root");
				window.open("/Munins Archiv/src/pages/Kontext/Explorer.html", "_self");
			}
			else if (args.item.Parent === undefined) {
				console.debug("selected grid item is root");
				window.open("/Munins Archiv/src/pages/Kontext/Explorer.html", "_self");
			}
			else {
				console.debug("selected grid item is standard node");
				window.open("/Munins Archiv/src/pages/Kontext/Explorer.html?Id=" + args.item.Id, "_self");
			}

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
		entries.push(copy);
	});

	$("#grid").jsGrid({
		data: entries
	});
}
//#endregion
