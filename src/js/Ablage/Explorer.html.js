$(document).ready(function() {
	// _webServiceClientAblageType.Register("loadAll", new GuiClient(InitGrid));
	_webServiceClientAblage.Register("delete", new GuiClient(LoadAblagen));
	_webServiceClientAblage.Register("create", new GuiClient(LoadAblagen));
	_webServiceClientAblage.Register("save", new GuiClient(RenameTreeNode));
	_webServiceClientAblage.Register("loadAll", new GuiClient(FillTreeWithRootAblagen));
	// _webServiceClientAblage.Register("loadAll", new GuiClient(FillGridWithRootAblagen));
	_webServiceClientAblage.Register("load", new GuiClient(FillTreeWithAblageChildren));
	// _webServiceClientAblage.Register("load", new GuiClient(FillGridWithAblageChildren));

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
		if (data.node.id != GetAbstractAblageNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, "fas fa-folder-open");
		}
	})
	.on("close_node.jstree", function(event, data) {

		console.log("close_node");
		if (data.node.id != GetAbstractAblageNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, "fas fa-folder");
		}
	})
	.on("select_node.jstree", function(event, data) {

		console.log("select_node");
		console.log(data);
		if (!$("#tree").jstree(true).is_loaded(data.node))
		{
			$("#tree").jstree(true).load_node(data.node, function(){ console.log($("#tree").jstree(true).get_node(data.node)); });
		}
		// $("#grid").jsGrid("cancelEdit");
		// $("#grid").jsGrid("clearInsert");

		// $("#path").val("/");

		// if (data.node.original.id == GetAbstractAblageNode().id)
		// {
		// 	_webServiceClientAblage.LoadAll("tree.selected");
		// }
		// else
		// {
		// 	var node = data.node.original.original;
		// 	$("#path").val("/" + node.Path);
		// 	_webServiceClientAblage.Load(node, "tree.selected");
		// }
	})
	.on("rename_node.jstree", function(event, data) {

		console.log("rename_node");
		var node = data.node.original;

		// Refactoring: clean up!
		// Removes the self reference added for the grid

		if (node.Children != undefined &&
			node.Children.length > 0 &&
			node.Children[0].Id == node.Id)
		{
			node.Children.shift();
		}

		var newName = data.text;
		var typePrefix = node.Type.Bezeichnung + ": ";

		if (newName.startsWith(typePrefix))
		{
			node.Bezeichnung = newName.substr(typePrefix.length);
		}
		else
		{
			node.Bezeichnung = newName;
		}
		
		_webServiceClientAblage.Save(node, "tree.renamed");
	})
	.on("loaded.jstree", function(event, data) {

		console.log("loaded");
		$("#tree").jstree(true).open_node(GetAbstractAblageNode().id, function() {
			$("#tree").jstree(true).select_node(GetAbstractAblageNode().id);
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
				console.log("data");
				console.log(node);
				if (node.id === "#")
				{
					callbackFunction(new Array(CreateAbstractAblageNode()));
				}
				else if (node.id == GetAbstractAblageNode().id)
				{
					_webServiceClientAblage.LoadAll("tree.selected");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientAblage.Load(node.original, "tree.selected");
					}
					else
					{
						_webServiceClientAblage.Load(node.original.original, "tree.selected");
					}
					callbackFunction(new Array());
				}
			}
		},
		"contextmenu": {
			"items": function($node) {
				return {
					"Edit": {
						"label": "Beabeiten",
						"title": "Beabeiten",
						"action": function(obj) {
							OpenAblageFormular($node);
						}
					},
					"Rename": {
						"label": "Umbenennen",
						"title": "Umbenennen",
						"action": function (obj) { 
							$("#tree").jstree(true).edit($node);
						}
					}
				};
			}
		}
    });
});

function FillTreeWithRootAblagen(rootAblagen, sender)
{
	console.log("FillTreeWithRootAblagen");
	var children = $("#tree").jstree(true).get_node(GetAbstractAblageNode().id).children;
	$("#tree").jstree(true).delete_node(children);

	for (var i = 0; i < rootAblagen.length; i++)
	{
		var ablageNode = CreateAblageNode(rootAblagen[i]);
		ablageNode.parent = "-1";
		
		$("#tree").jstree(true).create_node(ablageNode.parent, ablageNode, "last", function(){
			//$("#tree").jstree(true).get_node(ablageNode.parent).state.loaded = true;
		});
	}
	
	$("#tree").jstree(true).open_node(GetAbstractAblageNode().id);
}

function RenameTreeNode(ablage, sender)
{
	console.log("RenameTreeNode");
	console.log(ablage);
	if (ablage.Parent == null)
	{
		$("#tree").jstree(true).refresh_node(GetAbstractAblageNode().id);
	}
	else
	{
		$("#tree").jstree(true).refresh_node(ablage.Parent.Id);
	}
}

function FillTreeWithAblageChildren(ablage, sender)
{
	console.log("FillTreeWithAblageChildren");
	var node = $("#tree").jstree(true).get_node(ablage.Id);
	$("#tree").jstree(true).delete_node(node.children);
	node.original = ablage;

	for (var i = 0; i < ablage.Children.length; i++)
	{
		var ablageNode = CreateAblageNode(ablage.Children[i]);
		ablageNode.parent = ablage.Id;
		
		$("#tree").jstree(true).create_node(ablageNode.parent, ablageNode, "last", function(){
			//$("#tree").jstree(true).get_node(ablageNode.parent).state.loaded = true;
		});
	}

	$("#tree").jstree(true).open_node(ablage.Id);
}

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
			insertItem: function(item) { 
				_webServiceClientAblage.Create(ConvertToJson(item), "grid.created");
			},
			updateItem: function(item) {
				_webServiceClientAblage.Save(ConvertToJson(item), "grid.updated");
			},
			deleteItem: function(item) {
				_webServiceClientAblage.Delete(item, "grid.deleted");
			}
		},

		// Rewritten to avoid quick edit mode. Double click 
		// should open the parent node or the child node.
		rowClick: function() {
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
			$("#tree").jstree(true).deselect_all();

			var selectedNode = $("#tree").jstree(true).get_node(data.item.Id);

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

function GetAbstractAblageNode()
{
	return CreateAbstractAblageNode();
}

function CreateAbstractAblageNode()
{
	var node = new Object();
	node.id = -1;
	node.text = "Ablagen";
	node.children = true;
	node.icon = "fas fa-hdd";
	node.state = new Object();

	return node;
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
	var selectedNodeId = $("#tree").jstree(true).get_selected();
	$("#tree").jstree(true).deselect_all();
	$("#tree").jstree(true).select_node(selectedNodeId);
}

function ShowMessages(messages)
{
    $("#messageBox").empty();
    $("#messageBox").append(messages);
    $("#messageBox").dialog("open");
}

function ConvertToJson(item)
{
	item.Parent = new Object();
	item.Parent.Id = $("#tree").jstree(true).get_selected()[0];

	return item;
}

function FillGridWithRootAblagen(ablagen, sender)
{
	if (sender == undefined ||
		sender != "tree.selected")
	{
		return;
	}

	$("#grid").empty();

	for (var i = 0; i < ablagen.length; i++)
	{
		ablagen[i].Icon = "fas fa-folder";
	}

	$("#grid").jsGrid({
		data: ablagen
	});
}

function FillGridWithAblageChildren(ablage, sender)
{
	if (sender == undefined ||
		sender != "tree.selected")
	{
		return;
	}

	$("#grid").empty();

	for (var i = 0; i < ablage.Children.length; i++)
	{
		ablage.Children[i].Icon = "fas fa-folder";
	}

	ablage.Children.unshift({
		"Id": ablage.Id,
		"Icon": "fas fa-folder-open",
		"Bezeichnung": "..", 
		"Type": ""
	});

	$("#grid").jsGrid({
		data: ablage.Children
	});
}