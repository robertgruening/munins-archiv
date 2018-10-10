$(document).ready(function() {
    _webServiceClientAblageType.Register("loadAll", new GuiClient(ShowAblageTypes));
    _webServiceClientAblageType.Register("create", new GuiClient(undefined, LoadAllAblageTypen));
    _webServiceClientAblageType.Register("save", new GuiClient(undefined, LoadAllAblageTypen));
    _webServiceClientAblageType.Register("delete", new GuiClient(undefined, LoadAllAblageTypen));
    
    InitBreadcrumb();
    InitGrid();
    
    LoadAllAblageTypen();
});

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : "AblageTypeManagement"
	});
}

function InitGrid()
{
    jsGrid.locale("de");
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