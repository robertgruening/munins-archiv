var _webServiceClientAblageType = null;

$(document).ready(function() {
	var webServiceClientFactory = new WebServiceClientFactory();
    _webServiceClientAblageType = webServiceClientFactory.getWebServiceClientAblageType();
    
    _webServiceClientAblageType.Register("loadAll", new GuiClient(ShowAblageTypes));
    _webServiceClientAblageType.Register("create", new GuiClient(undefined, LoadAllAblageTypes));
    _webServiceClientAblageType.Register("save", new GuiClient(undefined, LoadAllAblageTypes));
    _webServiceClientAblageType.Register("delete", new GuiClient(undefined, LoadAllAblageTypes));
    
    InitBreadcrumb();
    InitGrid();
    
    LoadAllAblageTypes();
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