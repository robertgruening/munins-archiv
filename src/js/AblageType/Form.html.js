$(document).ready(function() {
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

    LoadAblageTypes();
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
                CreateAblageType(item);
            },
            updateItem: function(item) { 
                UpdateAblageType(item);
            },
            deleteItem: function(item) { 
                DeleteAblageType(item);
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