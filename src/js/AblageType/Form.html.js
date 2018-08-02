$(document).ready(function() {
    _webServiceClientAblageType.Register("loadAll", new GuiClient(ShowAblageTypes));
    _webServiceClientAblageType.Register("create", new GuiClient(undefined, LoadAllAblageTypen));
    _webServiceClientAblageType.Register("save", new GuiClient(undefined, LoadAllAblageTypen));
    _webServiceClientAblageType.Register("delete", new GuiClient(undefined, LoadAllAblageTypen));

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

    LoadAllAblageTypen();
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