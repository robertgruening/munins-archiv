$(document).ready(function() {
	_webServiceClientAblageType.Register("loadAll", new GuiClient(InitGrid));
	_webServiceClientAblage.Register("delete", new GuiClient(LoadAblagen));
	_webServiceClientAblage.Register("create", new GuiClient(LoadAblagen));
	_webServiceClientAblage.Register("save", new GuiClient(RenameTreeNode));
	_webServiceClientAblage.Register("save", new GuiClient(MoveTreeNode));
	_webServiceClientAblage.Register("loadAll", new GuiClient(FillTreeWithRootAblagen));
	_webServiceClientAblage.Register("loadAll", new GuiClient(FillGridWithRootAblagen));
	_webServiceClientAblage.Register("load", new GuiClient(FillTreeWithAblageChildren));
	_webServiceClientAblage.Register("load", new GuiClient(FillGridWithAblageChildren));

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
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Ablage", "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {

		console.log("close_node");
		if (data.node.id != GetAbstractAblageNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Ablage"));
		}
	})
	.on("select_node.jstree", function(event, data) {

		console.log("select_node");
		console.log(data);
		if ($("#tree").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id == GetAbstractAblageNode().id)
			{
				_webServiceClientAblage.LoadAll("tree.selected");
			}
			else
			{
				_webServiceClientAblage.Load(data.node.original, "tree.selected");
			}
		}
		else
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
	.on("move_node.jstree", function(event, data) {
		console.log("move_node.jstree");
		console.log(data.node.original);
		console.log(data.parent);

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

			_webServiceClientAblage.Save(node, "tree.moved");
			// TODO
			//_webServiceClientAblage.Load(node.original, "tree.selected");
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
				console.log("data");
				console.log(node);
				if (node.id === "#")
				{
					callbackFunction(new Array(CreateAbstractAblageNode()));
				}
				else if (node.id == GetAbstractAblageNode().id)
				{
					_webServiceClientAblage.LoadAll("tree.loaded");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientAblage.Load(node.original, "tree.loaded");
					}
					else
					{
						_webServiceClientAblage.Load(node.original.original, "tree.loaded");
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
	if (sender == undefined ||
		sender != "tree.loaded")
	{
		return;
	}

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
	if (sender != undefined &&
		sender != "tree.renamed")
	{
		return;
	}

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

function MoveTreeNode(ablage, sender)
{
	if (sender != undefined &&
		sender != "tree.moved")
	{
		return;
	}

	console.log("MoveTreeNode");
	console.log(ablage);
	console.log(_elementsToBeRefreshed);

	while (_elementsToBeRefreshed.length > 0)
	{
		$("#tree").jstree(true).refresh_node(_elementsToBeRefreshed[0].Id);
		_elementsToBeRefreshed.shift();
	}
}

function FillTreeWithAblageChildren(ablage, sender)
{
	if (sender == undefined ||
		sender != "tree.loaded")
	{
		return;
	}

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

        inserting: false,
        editing: false,
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
				name: "Type",
				type: "text"
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
				console.log(selectedNode.parent);
				$("#tree").jstree(true).select_node(selectedNode.parent);
				//$("#tree").jstree(true).load_node(selectedNode.parent);
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
	node.icon = GetIcon("Root");
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
	node.icon = GetIcon("Ablage");

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
		(sender != "tree.loaded" &&
		 sender != "tree.selected"))
	{
		return;
	}

	$("#grid").empty();

	var entries = new Array();

	ablagen.forEach(ablage => {
		var entry = new Object();
		entry.Bezeichnung = ablage.Bezeichnung;
		entry.Type = ablage.Type.Bezeichnung;
		entry.Icon = GetIcon("Ablage");
		entry.Original = ablage;
		entries.push(entry);
	});

	$("#grid").jsGrid({
		data: entries
	});
}

function FillGridWithAblageChildren(ablage, sender)
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
	entry.Type = ablage.Type.Bezeichnung;
	entry.Icon = GetIcon("Ablage", "open");
	entry.Original = ablage;
	entries.push(entry);

	ablage.Children.forEach(child => {
		var entry = new Object();
		entry.Bezeichnung = child.Bezeichnung;
		entry.Type = child.Type.Bezeichnung;
		entry.Icon = GetIcon("Ablage");
		entry.Original = child;
		entries.push(entry);
	});

	ablage.Funde.forEach(fund => {
		var entry = new Object();
		entry.Bezeichnung = GetFundLabelText(fund);
		entry.Type = "Fund";
		entry.Icon = GetIcon("Fund");
		entry.Original = fund;
		entries.push(entry);
	});

	$("#grid").jsGrid({
		data: entries
	});
}

function GetFundLabelText(fund)
{
	var labelText = "";
	labelText += fund.Anzahl.toString().replace("-", ">")+"x ";
	
	if (fund.FundAttribute != undefined &&
		fund.FundAttribute != null &&
		fund.FundAttribute.length > 0)
	{
		var material = null;
		var gegenstand = null;
		var erhaltung = null;
		
		for (var j = 0; j < fund.FundAttribute.length; j++)
		{
			if (fund.FundAttribute[j].Type.Bezeichnung == "Material")
			{
				material = fund.FundAttribute[j];
			}
			else if (fund.FundAttribute[j].Type.Bezeichnung == "Gegenstand")
			{
				gegenstand = fund.FundAttribute[j];
			}
			else if (fund.FundAttribute[j].Type.Bezeichnung == "Erhaltung")
			{
				erhaltung = fund.FundAttribute[j];
			}
				
			if (material != null &&
				gegenstand != null &&
				erhaltung != null)
			{
				break;
			}
		}

		if (material != null)
		{
			labelText += material.Bezeichnung + " ";
		}
			
		if (gegenstand != null)
		{
			labelText += gegenstand.Bezeichnung + " ";
		}
			
		if (erhaltung != null)
		{
			labelText += erhaltung.Bezeichnung + " ";
		}
	}
	
	if (fund.Bezeichnung != null &&
		fund.Bezeichnung != "")
	{
		labelText += ": \"" + fund.Bezeichnung + "\"";
	}

	labelText = labelText.trim();

	return labelText;
}

function GetIcon(type, state)
{
	if (type == undefined)
	{
		return "";
	}

	if (type == "Root")
	{
		return "fas fa-hdd root";
	}

	if (type == "Ablage")
	{
		if (state != undefined &&
			state == "open")
		{
			return "fas fa-folder-open node";
		}

		return "fas fa-folder node";
	}

	if (type == "Fund")
	{
		return "fas fa-file leaf";
	}

	return "";
}