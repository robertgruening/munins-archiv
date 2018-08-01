function UiInitGrid()
{
	this.Update = function(ablageTypes) {
		console.log("Updating Grid ...");
		ShowAblageTypes(ablageTypes);
    };
    
    this.Fail = function(messages) {
		console.log("FAILED to update grid ...");
    };
}

var _uiInitGrid = new UiInitGrid();

function UiAddAblageTypeToGrid()
{
	this.Update = function(ablageTypes) {
		console.log("Adding AblageType to grid ...");
	};
    
    this.Fail = function(messages) {
		console.log("FAILED to add AblageType to grid ...");
        _webServiceClientAblageType.LoadAll();
    };
}

var _uiAddAblageTypeToGrid = new UiAddAblageTypeToGrid();

function UiUpdateAblageTypeInGrid()
{
	this.Update = function() {
		console.log("Updating AblageType in grid ...");
	};
    
    this.Fail = function(messages) {
		console.log("FAILED to update AblageType in grid ...");
        _webServiceClientAblageType.LoadAll();
    };
}

var _uiUpdateAblageTypeInGrid = new UiUpdateAblageTypeInGrid();

function UiRemoveAblageTypeFromGrid()
{
	this.Update = function(ablageTypes) {
		console.log("Removing AblageType from grid ...");
	};
    
    this.Fail = function(messages) {
		console.log("FAILED to remove AblageType from grid ...");
        _webServiceClientAblageType.LoadAll();
    };
}

var _uiRemoveAblageTypeFromGrid = new UiRemoveAblageTypeFromGrid();

$(document).ready(function() {
    _webServiceClientAblageType.Register("loadAll", _uiInitGrid);
    _webServiceClientAblageType.Register("create", _uiAddAblageTypeToGrid);
    _webServiceClientAblageType.Register("save", _uiUpdateAblageTypeInGrid);
    _webServiceClientAblageType.Register("delete", _uiRemoveAblageTypeFromGrid);

    $("#navigation").Navigation();
    $("#messageBox").dialog({
        autoOpen: false,
        height: "auto",
        modal: true
    });
    
    $("#breadcrumb").Breadcrumb({
        PageName : "AblageTypeManagement"
    });

    jsGrid.locale("de");

    _webServiceClientAblageType.LoadAll();
});

function ShowMessages(messages)
{
    $("#messageBox").empty();
    $("#messageBox").append(messages);
    $("#messageBox").dialog("open");
}

function ShowAblageTypes(ablageTypes)
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
                _webServiceClientAblageType.Create(item);
            },
            updateItem: function(item) {
                _webServiceClientAblageType.Save(item);
            },
            deleteItem: function(item) {
                _webServiceClientAblageType.Delete(item);
            }
        },

        data: ablageTypes,

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