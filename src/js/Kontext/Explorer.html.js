$(document).ready(function() {
	_webServiceClientKontext.Register("delete", new GuiClient(LoadKontexte));
	_webServiceClientKontext.Register("create", new GuiClient(LoadKontexte));
	_webServiceClientKontext.Register("save", new GuiClient(RenameTreeNode));
	_webServiceClientKontext.Register("save", new GuiClient(MoveTreeNode));
	_webServiceClientKontext.Register("loadAll", new GuiClient(FillTreeWithRootKontexten));
	_webServiceClientKontext.Register("loadAll", new GuiClient(FillGridWithRootKontexten));
	_webServiceClientKontext.Register("load", new GuiClient(FillTreeWithKontextChildren));
	_webServiceClientKontext.Register("load", new GuiClient(FillGridWithKontextChildren));

    $("#navigation").Navigation();
    
    $("#breadcrumb").Breadcrumb({
        PageName : "KontextExplorer"
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
		if (data.node.id == GetAbstractKontextNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Root", "open"));
		}
		else
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon(data.node.original.Type.Bezeichnung, "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractKontextNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Root"));
		}
		else
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon(data.node.original.Type.Bezeichnung));
		}
	})
	.on("select_node.jstree", function(event, data) {
		if ($("#tree").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id == GetAbstractKontextNode().id)
			{
				_webServiceClientKontext.LoadAll("tree.selected");
			}
			else
			{
				_webServiceClientKontext.Load(data.node.original, "tree.selected");
			}
		}
		else
		{
			$("#tree").jstree(true).load_node(data.node, function(){ console.log($("#tree").jstree(true).get_node(data.node)); });
		}
		// $("#grid").jsGrid("cancelEdit");
		// $("#grid").jsGrid("clearInsert");

		// $("#path").val("/");

		// if (data.node.original.id == GetAbstractKontextNode().id)
		// {
		// 	_webServiceClientKontext.LoadAll("tree.selected");
		// }
		// else
		// {
		// 	var node = data.node.original.original;
		// 	$("#path").val("/" + node.Path);
		// 	_webServiceClientKontext.Load(node, "tree.selected");
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
		
		_webServiceClientKontext.Save(node, "tree.renamed");
	})
	.on("loaded.jstree", function(event, data) {
		$("#tree").jstree(true).open_node(GetAbstractKontextNode().id, function() {
			$("#tree").jstree(true).select_node(GetAbstractKontextNode().id);
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

			_webServiceClientKontext.Save(node, "tree.moved");
			// TODO
			//_webServiceClientKontext.Load(node.original, "tree.selected");
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
					callbackFunction(new Array(CreateAbstractKontextNode()));
				}
				else if (node.id == GetAbstractKontextNode().id)
				{
					_webServiceClientKontext.LoadAll("tree.loaded");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientKontext.Load(node.original, "tree.loaded");
					}
					else
					{
						_webServiceClientKontext.Load(node.original.original, "tree.loaded");
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
							OpenKontextFormular($node);
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

function FillTreeWithRootKontexten(rootKontexte, sender)
{
	if (sender == undefined ||
		sender != "tree.loaded")
	{
		return;
	}

	var children = $("#tree").jstree(true).get_node(GetAbstractKontextNode().id).children;
	$("#tree").jstree(true).delete_node(children);

	for (var i = 0; i < rootKontexte.length; i++)
	{
		var kontextNode = CreateKontextNode(rootKontexte[i]);
		kontextNode.parent = "-1";
		$("#tree").jstree(true).create_node(kontextNode.parent, kontextNode, "last");
	}
	
	$("#tree").jstree(true).open_node(GetAbstractKontextNode().id);
}

function RenameTreeNode(kontext, sender)
{
	if (sender != undefined &&
		sender != "tree.renamed")
	{
		return;
	}

	if (kontext.Parent == null)
	{
		$("#tree").jstree(true).refresh_node(GetAbstractKontextNode().id);
	}
	else
	{
		$("#tree").jstree(true).refresh_node(kontext.Parent.Id);
	}
}

function MoveTreeNode(kontext, sender)
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

function FillTreeWithKontextChildren(kontext, sender)
{
	if (sender == undefined ||
		sender != "tree.loaded")
	{
		return;
	}

	var node = $("#tree").jstree(true).get_node(kontext.Id);
	$("#tree").jstree(true).delete_node(node.children);
	node.original = kontext;

	for (var i = 0; i < kontext.Children.length; i++)
	{
		var kontextNode = CreateKontextNode(kontext.Children[i]);
		kontextNode.parent = kontext.Id;
		
		$("#tree").jstree(true).create_node(kontextNode.parent, kontextNode, "last");
	}

	$("#tree").jstree(true).open_node(kontext.Id);
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
				_webServiceClientKontext.Create(ConvertToJson(item), "grid.created");
			},
			updateItem: function(item) {
				_webServiceClientKontext.Save(ConvertToJson(item), "grid.updated");
			},
			deleteItem: function(item) {
				_webServiceClientKontext.Delete(item, "grid.deleted");
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

function GetAbstractKontextNode()
{
	return CreateAbstractKontextNode();
}

function CreateAbstractKontextNode()
{
	var node = new Object();
	node.id = -1;
	node.text = "Kontexte";
	node.children = true;
	node.icon = GetIcon("Root");
	node.state = new Object();

	return node;
}

function CreateKontextNode(kontext)
{
	var node = new Object();
	node.id = kontext.Id;
	node.text = kontext.Type.Bezeichnung + ": " + kontext.Bezeichnung;
	node.original = kontext;
	node.children = true;
	node.icon = GetIcon(kontext.Type.Bezeichnung);

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

function LoadKontexte()
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

function FillGridWithRootKontexten(kontexte, sender)
{
	if (sender == undefined || 
		(sender != "tree.loaded" &&
		 sender != "tree.selected"))
	{
		return;
	}

	$("#grid").empty();

	var entries = new Array();

	kontexte.forEach(kontext => {
		var entry = new Object();
		entry.Bezeichnung = kontext.Bezeichnung;
		entry.Type = kontext.Type.Bezeichnung;
		entry.Icon = GetIcon(kontext.Type.Bezeichnung);
		entry.Original = kontext;
		entries.push(entry);
	});

	$("#grid").jsGrid({
		data: entries
	});
}

function FillGridWithKontextChildren(kontext, sender)
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
	entry.Type = kontext.Type.Bezeichnung;
	entry.Icon = GetIcon(kontext.Type.Bezeichnung, "open");
	entry.Original = kontext;
	entries.push(entry);

	kontext.Children.forEach(child => {
		var entry = new Object();
		entry.Bezeichnung = child.Bezeichnung;
		entry.Type = child.Type.Bezeichnung;
		entry.Icon = GetIcon(child.Type.Bezeichnung);
		entry.Original = child;
		entries.push(entry);
	});

	if (kontext.Funde != undefined)
	{
		kontext.Funde.forEach(fund => {
			var entry = new Object();
			entry.Bezeichnung = GetFundLabelText(fund);
			entry.Type = "Fund";
			entry.Icon = GetIcon("Fund");
			entry.Original = fund;
			entries.push(entry);
		});
	}

	if (kontext.Orte != undefined)
	{
		kontext.Orte.forEach(ort => {
			var entry = new Object();
			entry.Bezeichnung = ort.Path;
			entry.Type = "Ort";
			entry.Icon = GetIcon("Ort");
			entry.Original = ort;
			entries.push(entry);
		});
	}

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
		if (state != undefined &&
			state == "open")
		{
			return "fas fa-globe root";
		}

		return "fas fa-globe root";
	}

	if (type == "Fundstelle")
	{
		return "fas fa-flag node";
	}

	if (type == "Begehungsfläche")
	{
		return "fas fa-map node";
	}

	if (type == "Begehung")
	{
		return "fas fa-calendar-alt node";
	}

	if (type == "Fund")
	{
		return "fas fa-puzzle-piece leaf";
	}

	if (type == "Ort")
	{
		return "fas fa-map-marker leaf";
	}

	return "";
}