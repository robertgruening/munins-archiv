$(document).ready(function() {
	_webServiceClientAblageType.Register("loadAll", new GuiClient(InitGrid));
	_webServiceClientAblage.Register("delete", new GuiClient(LoadAblagen));

    $("#navigation").Navigation();
    
    $("#breadcrumb").Breadcrumb({
        PageName : "AblageExplorer"
	});

    $("#messageBox").dialog({
        autoOpen: false,
        height: "auto",
        modal: true
    });

	jsGrid.fields.icon = IconField;
	
	_webServiceClientAblageType.LoadAll();

	$("#tree")
	.on("open_node.jstree", function(event, data) {
		console.log("open_node");
		// console.log($("a#" + data.node.a_attr.id).get());
		// if ($("a#" + data.node.a_attr.id).get()[0].childNodes.length > 2)
		// {
		// 	var icon = $("a#" + data.node.a_attr.id).get()[0].childNodes[1].data;
		// 	$("a#" + data.node.a_attr.id).get()[0].childNodes[0].remove();
		// 	$("a#" + data.node.a_attr.id).get()[0].childNodes[0].remove();
		// 	$("a#" + data.node.a_attr.id).prepend($(icon));
			$("#tree").jstree(true).set_icon(data.node.id, "fas fa-folder-open");
		// }
	})
	.on("close_node.jstree", function(event, data) {
		console.log("close_node");
		// console.log($("a#" + data.node.a_attr.id).get());
		// var icon = $("a#" + data.node.a_attr.id).get()[0].childNodes[1].data;
		// $("a#" + data.node.a_attr.id).get()[0].childNodes[0].remove();
		// $("a#" + data.node.a_attr.id).get()[0].childNodes[0].remove();
		// $("a#" + data.node.a_attr.id).prepend($(icon));
		$("#tree").jstree(true).set_icon(data.node.id, "fas fa-folder");
	})
	.on("select_node.jstree", function(event, data) {
		var node = data.node.original.original;

		$("#path").val(node.Path);

		$("#grid").empty();

		$.ajax(
		{
			type:"GET",
			url: "../Services/Ablage/" + node.Id,
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				for (var i = 0; i < data.Children.length; i++)
				{
					data.Children[i].Icon = "fas fa-folder";
				}

				if (data.Parent != null)
				{
					data.Children.unshift({
						"Id": data.Id,
						"Icon": "fas fa-folder-open",
						"Bezeichnung": "..", 
						"Type": ""
					});
				}

				$("#grid").jsGrid({
					data: data.Children
				});
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					ShowMessages(jqXHR.responseJSON);
				}
				else
				{
					console.log("ERROR: " + jqXHR.responseJSON);
				}
			}
		});
	})
    .jstree({
		"plugins": [
			"contextmenu"
		],
        "core": {
			"multiple": false,
			"check_callback" : true,
			"data" : function (node, callbackFunction) 
			{				
				if (node.id === "#")
				{
					$.ajax(
					{
						type:"GET",
						url: "../Services/Ablage/",
						dataType: "JSON",
						success:function(data, textStatus, jqXHR)
						{	
							var retval = new Array();

							for (var i = 0; i < data.length; i++)
							{
								var ablageNode = CreateAblageNode(data[i]);
								ablageNode.parent = "#";

								retval.push(ablageNode);
							}

							callbackFunction(retval);
						},
						error:function(jqXHR, textStatus, errorThrown)
						{
							if (jqXHR.status == 500)
							{
								ShowMessages(jqXHR.responseJSON);
							}
							else
							{
								console.log("ERROR: " + jqXHR.responseJSON);
							}
						}
					});
				}
				else
				{
					$.ajax(
					{
						type:"GET",
						url: "../Services/Ablage/" + node.id,
						dataType: "JSON",
						success:function(data, textStatus, jqXHR)
						{
							var retval = new Array();

							for (var i = 0; i < data.Children.length; i++)
							{
								var ablageNode = CreateAblageNode(data.Children[i]);
								ablageNode.parent = data.Id;

								retval.push(ablageNode);
							}

							callbackFunction(retval);
						},
						error:function(jqXHR, textStatus, errorThrown)
						{
							if (jqXHR.status == 500)
							{
								ShowMessages(jqXHR.responseJSON);
							}
							else
							{
								console.log("ERROR: " + jqXHR.responseJSON);
							}
						}
					});
				}
			}
		},
		"contextmenu": {
			"items": function($node) {
				return {
					"Beabeiten": {
						"label": "Beabeiten",
						"title": "Beabeiten",
						"action": function(obj) {
							window.open("Form.html?Id=" + $node.id, "_self");
						}
					}
				};
			}
		}
    });
});

function InitGrid(ablageTypes)
{
	$("#grid").jsGrid({
        width: "70%",

        inserting: true,
        editing: true,
        sorting: true,
        paging: false,
		autoload: false,
		
		controller: {
			// insertItem: function(item) { 
			// 	CreateAblageType(item);
			// },
			// updateItem: function(item) { 
			// 	UpdateAblageType(item);
			// },
			deleteItem: function(item) {
				_webServiceClientAblage.Delete(item);
			}
		},
		
		fields: [
			{ 
				title: "",
				name: "Icon", 
				type: "icon"
			},
			{ 
				name: "Bezeichnung", 
				type: "text", 
				validate: "required"
			},
			{ 
				title: "Typ",
				name: "Type.Id",
				type: "select",
				items: ablageTypes,
				valueField: "Id",
				textField: "Bezeichnung",
				valueType: "number",
				align: "left"
			},
			{ 
				type: "control"
			}
		],

		rowDoubleClick: function(data) {
			$("#tree").jstree(false).deselect_all();

			var selectedNode = $("#tree").jstree(false).get_node(data.item.Id);

			if (selectedNode == undefined)
			{
				return;
			}

			if (data.item.Bezeichnung === "..")
			{
				$("#tree").jstree(true).select_node(selectedNode.parent);
			}
			else
			{
				$("#tree").jstree(true).open_node(data.item.Id);
				$("#tree").jstree(true).select_node(data.item.Id);
			}
		}
	});
}

function CreateAblageNode(ablage)
{
	var node = new Object();
	node.id = ablage.Id;
	node.text = ablage.Type.Bezeichnung + ": " + ablage.Bezeichnung;
	node.original = ablage;
	node.children = true;
	node.icon = "fas fa-folder";

	return node;
}

var IconField = function(config) {
	jsGrid.Field.call(this, config);
}

IconField.prototype = new jsGrid.Field({
	itemTemplate: function(value) {
		return $("<i>").addClass(value);
	}
});

function LoadAblagen()
{
	var selectedNodeId = $("#tree").jstree(false).get_selected();
	$("#tree").jstree(false).deselect_all();
	$("#tree").jstree(true).select_node(selectedNodeId);
}

function ShowMessages(messages)
{
    $("#messageBox").empty();
    $("#messageBox").append(messages);
    $("#messageBox").dialog("open");
}