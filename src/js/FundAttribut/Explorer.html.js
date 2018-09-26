$(document).ready(function() {
	_webServiceClientFundAttribut.Register("delete", new GuiClient(LoadFundAttribute));
	_webServiceClientFundAttribut.Register("create", new GuiClient(LoadFundAttribute));
	_webServiceClientFundAttribut.Register("save", new GuiClient(RenameTreeNode));
	_webServiceClientFundAttribut.Register("save", new GuiClient(MoveTreeNode));
	_webServiceClientFundAttribut.Register("loadAll", new GuiClient(FillTreeWithRootFundAttributen));
	_webServiceClientFundAttribut.Register("loadAll", new GuiClient(FillGridWithRootFundAttributen));
	_webServiceClientFundAttribut.Register("load", new GuiClient(FillTreeWithFundAttributChildren));
	_webServiceClientFundAttribut.Register("load", new GuiClient(FillGridWithFundAttributChildren));

    $("#navigation").Navigation();
    
    $("#breadcrumb").Breadcrumb({
        PageName : "FundAttributExplorer"
	});

    $("#messageBox").dialog({
        autoOpen: false,
        height: "auto",
        modal: true
    });

	jsGrid.fields.icon = IconField;
	
	InitGrid();

	$("#tree")
	.on("open_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractFundAttributNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Root", "open"));
		}
		else
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Fundattribut", "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractFundAttributNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Root"));
		}
		else
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Fundattribut"));
		}
	})
	.on("select_node.jstree", function(event, data) {
		if ($("#tree").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id == GetAbstractFundAttributNode().id)
			{
				_webServiceClientFundAttribut.LoadAll("tree.selected");
			}
			else
			{
				_webServiceClientFundAttribut.Load(data.node.original, "tree.selected");
			}
		}
		else
		{
			$("#tree").jstree(true).load_node(data.node, function(){ console.log($("#tree").jstree(true).get_node(data.node)); });
		}
		// $("#grid").jsGrid("cancelEdit");
		// $("#grid").jsGrid("clearInsert");

		// $("#path").val("/");

		// if (data.node.original.id == GetAbstractFundAttributNode().id)
		// {
		// 	_webServiceClientFundAttribut.LoadAll("tree.selected");
		// }
		// else
		// {
		// 	var node = data.node.original.original;
		// 	$("#path").val("/" + node.Path);
		// 	_webServiceClientFundAttribut.Load(node, "tree.selected");
		// }
	})
	.on("rename_node.jstree", function(event, data) {
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
		
		_webServiceClientFundAttribut.Save(node, "tree.renamed");
	})
	.on("loaded.jstree", function(event, data) {
		$("#tree").jstree(true).open_node(GetAbstractFundAttributNode().id, function() {
			$("#tree").jstree(true).select_node(GetAbstractFundAttributNode().id);
		});
	})
	.on("move_node.jstree", function(event, data) {
		var node = null;

		if (data.node.original.original == undefined)
		{
			node = data.node.original;
		}
		else
		{
			node = data.node.original.original;
		}

		// old parent
		_elementsToBeRefreshed.push({
			Id : node.Parent
		});

		// new parent
		_elementsToBeRefreshed.push({
			Id : data.parent
		});

		$("#tree").jstree(true).load_node(node.Id, function(){
			node.Parent = new Object();
			node.Parent.Id = data.parent;

			if (node.Parent.Id == -1)
			{
				node.Parent.Id = null;
			}

			_webServiceClientFundAttribut.Save(node, "tree.moved");
			// TODO
			//_webServiceClientFundAttribut.Load(node.original, "tree.selected");
		});

		var oldParent = node.Parent;

		if (!$("#tree").jstree(true).is_loaded(data.parent))
		{
			$("#tree").jstree(true).load_node(data.parent, function(){
				if (!$("#tree").jstree(true).is_loaded(data.parent))
				{
					console.log("Elternknoten ist nachgeladen");
				}
			});
		}

	})
    .jstree({
		"plugins": [
			"contextmenu",
			"dnd"
		],
        "core": {
			"multiple": false,
			"check_callback" : true,
			"data" : function (node, callbackFunction) 
			{
				if (node.id === "#")
				{
					callbackFunction(new Array(CreateAbstractFundAttributNode()));
				}
				else if (node.id == GetAbstractFundAttributNode().id)
				{
					_webServiceClientFundAttribut.LoadAll("tree.loaded");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientFundAttribut.Load(node.original, "tree.loaded");
					}
					else
					{
						_webServiceClientFundAttribut.Load(node.original.original, "tree.loaded");
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
							OpenFundAttributFormular($node);
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

function FillTreeWithRootFundAttributen(rootFundAttribute, sender)
{
	if (sender == undefined ||
		sender != "tree.loaded")
	{
		return;
	}

	var children = $("#tree").jstree(true).get_node(GetAbstractFundAttributNode().id).children;
	$("#tree").jstree(true).delete_node(children);

	for (var i = 0; i < rootFundAttribute.length; i++)
	{
		var fundAttributNode = CreateFundAttributNode(rootFundAttribute[i]);
		fundAttributNode.parent = "-1";
		$("#tree").jstree(true).create_node(fundAttributNode.parent, fundAttributNode, "last");
	}
	
	$("#tree").jstree(true).open_node(GetAbstractFundAttributNode().id);
}

function RenameTreeNode(fundAttribut, sender)
{
	if (sender != undefined &&
		sender != "tree.renamed")
	{
		return;
	}

	if (fundAttribut.Parent == null)
	{
		$("#tree").jstree(true).refresh_node(GetAbstractFundAttributNode().id);
	}
	else
	{
		$("#tree").jstree(true).refresh_node(fundAttribut.Parent.Id);
	}
}

function MoveTreeNode(fundAttribut, sender)
{
	if (sender != undefined &&
		sender != "tree.moved")
	{
		return;
	}

	while (_elementsToBeRefreshed.length > 0)
	{
		$("#tree").jstree(true).refresh_node(_elementsToBeRefreshed[0].Id);
		_elementsToBeRefreshed.shift();
	}
}

function FillTreeWithFundAttributChildren(fundAttribut, sender)
{
	if (sender == undefined ||
		sender != "tree.loaded")
	{
		return;
	}

	var node = $("#tree").jstree(true).get_node(fundAttribut.Id);
	$("#tree").jstree(true).delete_node(node.children);
	node.original = fundAttribut;

	for (var i = 0; i < fundAttribut.Children.length; i++)
	{
		var fundAttributNode = CreateFundAttributNode(fundAttribut.Children[i]);
		fundAttributNode.parent = fundAttribut.Id;
		
		$("#tree").jstree(true).create_node(fundAttributNode.parent, fundAttributNode, "last");
	}

	$("#tree").jstree(true).open_node(fundAttribut.Id);
}

function InitGrid()
{
	$("#grid").jsGrid({
        width: "70%",

        inserting: false,
        editing: false,
        sorting: true,
        paging: false,
		autoload: false,
		
		controller: {
			insertItem: function(item) { 
				_webServiceClientFundAttribut.Create(ConvertToJson(item), "grid.created");
			},
			updateItem: function(item) {
				_webServiceClientFundAttribut.Save(ConvertToJson(item), "grid.updated");
			},
			deleteItem: function(item) {
				_webServiceClientFundAttribut.Delete(item, "grid.deleted");
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
				name: "Type",
				type: "text"
			},
			{ 
				title: "Anzahl von Funden",
				name: "CountOfFunde",
				type: "number"
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
				$("#tree").jstree(true).open_node(data.item.Id, function(){
					$("#tree").jstree(true).select_node(data.item.Id);
				});
			}
		}
	});
}

function GetAbstractFundAttributNode()
{
	return CreateAbstractFundAttributNode();
}

function CreateAbstractFundAttributNode()
{
	var node = new Object();
	node.id = -1;
	node.text = "Fundattribute";
	node.children = true;
	node.icon = GetIcon("Root");
	node.state = new Object();

	return node;
}

function CreateFundAttributNode(fundAttribut)
{
	var node = new Object();
	node.id = fundAttribut.Id;
	node.text = fundAttribut.Type.Bezeichnung + ": " + fundAttribut.Bezeichnung;
	node.original = fundAttribut;
	node.children = true;
	node.icon = GetIcon("Fundattribut");

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

function LoadFundAttribute()
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

function FillGridWithRootFundAttributen(fundAttribute, sender)
{
	if (sender == undefined || 
		(sender != "tree.loaded" &&
		 sender != "tree.selected"))
	{
		return;
	}

	$("#grid").empty();

	var entries = new Array();

	fundAttribute.forEach(fundAttribut => {
		var entry = new Object();
		entry.Bezeichnung = fundAttribut.Bezeichnung;
		entry.Type = fundAttribut.Type.Bezeichnung;
		entry.CountOfFunde = fundAttribut.CountOfFunde;
		entry.Icon = GetIcon("Fundattribut");
		entry.Original = fundAttribut;
		entries.push(entry);
	});

	$("#grid").jsGrid({
		data: entries
	});
}

function FillGridWithFundAttributChildren(fundAttribut, sender)
{
	if (sender == undefined || 
		(sender != "tree.loaded" &&
		 sender != "tree.selected"))
	{
		return;
	}

	$("#grid").empty();

	var entries = new Array();

	var entry = new Object();
	entry.Bezeichnung = "..";
	entry.Type = fundAttribut.Type.Bezeichnung;
	entry.CountOfFunde = fundAttribut.CountOfFunde;
	entry.Icon = GetIcon("Fundattribut", "open");
	entry.Original = fundAttribut;
	entries.push(entry);

	fundAttribut.Children.forEach(child => {
		var entry = new Object();
		entry.Bezeichnung = child.Bezeichnung;
		entry.CountOfFunde = child.CountOfFunde;
		entry.Type = child.Type.Bezeichnung;
		entry.Icon = GetIcon("Fundattribut");
		entry.Original = child;
		entries.push(entry);
	});

	$("#grid").jsGrid({
		data: entries
	});
}

function GetIcon(type, state)
{
	if (type == undefined)
	{
		return "";
	}

	if (type == "Root")
	{
		return "fas fa-tags root";
	}

	if (type == "Fundattribut")
	{
		return "fas fa-tag node";
	}

	if (type == "Fund")
	{
		return "fas fa-puzzle-piece leaf";
	}

	return "";
}