var _viewModelListOrtType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelListOrtType = viewModelFactory.getViewModelListOrtType();

    RegisterToViewModel();
    InitBreadcrumb();
    InitGrid();

    _viewModelListOrtType.loadAll();
});

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : "OrtTypeManagement"
	});
}

function RegisterToViewModel() {
	_viewModelListOrtType.register("dataChanged", new GuiClient(UpdateGridData, UpdateGridData));
	_viewModelListOrtType.register("loadAll", new GuiClient(showMessageAllLoaded, showErrorMessages));
	_viewModelListOrtType.register("create", new GuiClient(showMessageCreated, showErrorMessages));
	_viewModelListOrtType.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelListOrtType.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function InitGrid()
{
	jsGrid.locale("de");
    ShowOrtTypes();
    UpdateGridData(new Array());
}

function UpdateGridData(ortTypes) {
	$("#gridContainer").jsGrid({
		data: JSON.parse(JSON.stringify(ortTypes))
	});
}

function ShowOrtTypes()
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
                _viewModelListOrtType.create(item);
            },
            insertModeButtonTooltip: "Neu",
            updateItem: function(item) {
                _viewModelListOrtType.save(item);
            },
            editButtonTooltip: "Bearbeiten",
            deleteItem: function(item) {
                _viewModelListOrtType.delete(item);
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
                title: "Anzahl von Orten",
                name: "CountOfOrten", 
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