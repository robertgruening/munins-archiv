$(document).ready(function() {
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
                CreateOrtType(item);
            },
            updateItem: function(item) { 
                UpdateOrtType(item);
            },
            deleteItem: function(item) { 
                DeleteOrtType(item);
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
                editing: false
            },
            { 
                type: "control" 
            }
        ]
    });
}