$(document).ready(function() {
    _webServiceClientFundAttributType.Register("loadAll", new GuiClient(ShowFundAttributTypes));
    _webServiceClientFundAttributType.Register("create", new GuiClient(undefined, LoadAllFundAttributTypen));
    _webServiceClientFundAttributType.Register("save", new GuiClient(undefined, LoadAllFundAttributTypen));
    _webServiceClientFundAttributType.Register("delete", new GuiClient(undefined, LoadAllFundAttributTypen));

    InitBreadcrumb();
    InitGrid();

    LoadAllFundAttributTypen();
});

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : "FundAttributTypeManagement"
	});
}

function InitGrid()
{
    jsGrid.locale("de");
}

function ShowFundAttributTypes(fundAttributTypes)
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

        data: fundAttributTypes,

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