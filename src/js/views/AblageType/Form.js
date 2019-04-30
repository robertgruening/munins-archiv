var _viewModelListAblageType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelListAblageType = viewModelFactory.getViewModelListAblageType();

    RegisterToViewModel();
    InitBreadcrumb();
    InitGrid();

    _viewModelListAblageType.loadAll();
});

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : "AblageTypeManagement"
	});
}

function RegisterToViewModel() {
	_viewModelListAblageType.register("dataChanged", new GuiClient(UpdateGridData, UpdateGridData));
	_viewModelListAblageType.register("loadAll", new GuiClient(showMessageAllLoaded, showErrorMessages));
	_viewModelListAblageType.register("create", new GuiClient(showMessageCreated, showErrorMessages));
	_viewModelListAblageType.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelListAblageType.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function InitGrid()
{
	jsGrid.locale("de");
    ShowAblageTypes();
    UpdateGridData(new Array());
}

function UpdateGridData(ablageTypes) {
	$("#gridContainer").jsGrid({
		data: JSON.parse(JSON.stringify(ablageTypes))
	});
}

function ShowAblageTypes()
{
    $("#gridContainer").jsGrid({
        width: "100%",

        inserting: true,
        editing: true,
        sorting: false,
        paging: false,
        autoload: false,

        controller: {
            insertItem: function(item) {
                _viewModelListAblageType.create(item);
            },
            insertModeButtonTooltip: "Neu",
            updateItem: function(item) {
                _viewModelListAblageType.save(item);
            },
            editButtonTooltip: "Bearbeiten",
            deleteItem: function(item) {
                _viewModelListAblageType.delete(item);
            },
            deleteButtonTooltip: "Löschen"
        },

        fields: [
            { 
                name: "Bezeichnung", 
                type: "text", 
                validate: "required"
            },
            { 
                title: "Anzahl von Ablagen",
                name: "CountOfAblagen", 
                type: "number",
                inserting: false,
                editing: false
            },
            { 
                type: "control"
            }
        ]
    });
}

function showMessageAllLoaded(elements) {
    $.toast({
        heading: "Information",
        text: elements.length + " Ablagetypen geladen",
        icon: "info"
    });
}

function showMessageCreated(element) {
    $.toast({
        heading: "Information",
        text: "Ablagetyp \"" + element.Bezeichnung + "\" erzeugt",
        icon: "success"
    });
}

function showMessageSaved(element) {
    $.toast({
        heading: "Information",
        text: "Ablagetyp \"" + element.Bezeichnung + "\" gespeichert",
        icon: "success"
    });
}

function showMessageDeleted(element) {
    $.toast({
        heading: "Information",
        text: "Ablagetyp \"" + element.Bezeichnung + "\" gelöscht",
        icon: "success"
    });
}