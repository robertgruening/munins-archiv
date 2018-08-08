$(document).ready(function() {
    _webServiceClientOrtType.Register("loadAll", new GuiClient(ShowOrtTypes));
    _webServiceClientOrtType.Register("create", new GuiClient(undefined, LoadAllOrtTypen));
    _webServiceClientOrtType.Register("save", new GuiClient(undefined, LoadAllOrtTypen));
    _webServiceClientOrtType.Register("delete", new GuiClient(undefined, LoadAllOrtTypen));

    $("#navigation").Navigation();
    $("#messageBox").dialog({
        autoOpen: false,
        height: "auto",
        modal: true
    });
    
    $("#breadcrumb").Breadcrumb({
        PageName : "OrtTypeManagement"
    });

    jsGrid.locale("de");

    LoadOrtTypes();
});

function ShowMessages(messages)
{
    $("#messageBox").empty();
    $("#messageBox").append(messages);
    $("#messageBox").dialog("open");
}

function ShowOrtTypes(ortTypes)
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
                _webServiceClientOrtType.Create(item);
            },
            updateItem: function(item) { 
                _webServiceClientOrtType.Save(item);
            },
            deleteItem: function(item) { 
                _webServiceClientOrtType.Delete(item);
            }
        },

        data: ortTypes,

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