$(document).ready(function() {
    $("#navigation").Navigation();
    $("#messageBox").dialog({
        autoOpen: false,
        height: "auto",
        modal: true
    });
    
    $("#breadcrumb").Breadcrumb({
        PageName : "FundAttributTypeManagement"
    });

    jsGrid.locale("de");

    LoadFundAttributTypes();
});

function ShowMessages(messages)
{
    $("#messageBox").empty();
    $("#messageBox").append(messages);
    $("#messageBox").dialog("open");
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
                CreateFundAttributType(item);
            },
            updateItem: function(item) { 
                UpdateFundAttributType(item);
            },
            deleteItem: function(item) { 
                DeleteFundAttributType(item);
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
                editing: false
            },
            { 
                type: "control" 
            }
        ]
    });
}