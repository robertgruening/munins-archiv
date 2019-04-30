var _viewModelListFundAttributType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelListFundAttributType = viewModelFactory.getViewModelListFundAttributType();

    RegisterToViewModel();
    InitBreadcrumb();
    InitGrid();

    _viewModelListFundAttributType.loadAll();
});

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : "FundAttributTypeManagement"
	});
}

function RegisterToViewModel() {
	_viewModelListFundAttributType.register("dataChanged", new GuiClient(UpdateGridData, UpdateGridData));
	_viewModelListFundAttributType.register("loadAll", new GuiClient(showMessageAllLoaded, showErrorMessages));
	_viewModelListFundAttributType.register("create", new GuiClient(showMessageCreated, showErrorMessages));
	_viewModelListFundAttributType.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelListFundAttributType.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function InitGrid()
{
	jsGrid.locale("de");
    ShowFundAttributTypes();
    UpdateGridData(new Array());
}

function UpdateGridData(ortTypes) {
	$("#gridContainer").jsGrid({
		data: JSON.parse(JSON.stringify(ortTypes))
	});
}

function ShowFundAttributTypes()
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
                _viewModelListFundAttributType.create(item);
            },
            insertModeButtonTooltip: "Neu",
            updateItem: function(item) {
                _viewModelListFundAttributType.save(item);
            },
            editButtonTooltip: "Bearbeiten",
            deleteItem: function(item) {
                _viewModelListFundAttributType.delete(item);
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
                title: "Anzahl von Fundattributen",
                name: "CountOfFundAttributen", 
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
        text: elements.length + " Fundattributtypen geladen",
        icon: "info"
    });
}

function showMessageCreated(element) {
    $.toast({
        heading: "Information",
        text: "Fundattributtyp \"" + element.Bezeichnung + "\" erzeugt",
        icon: "success"
    });
}

function showMessageSaved(element) {
    $.toast({
        heading: "Information",
        text: "Fundattributtyp \"" + element.Bezeichnung + "\" gespeichert",
        icon: "success"
    });
}

function showMessageDeleted(element) {
    $.toast({
        heading: "Information",
        text: "Fundattributtyp \"" + element.Bezeichnung + "\" gelöscht",
        icon: "success"
    });
}