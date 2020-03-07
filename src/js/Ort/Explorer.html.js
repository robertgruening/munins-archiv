$(document).ready(function() {
	_webServiceClientOrt.Register("delete", new GuiClient(LoadOrte));
	_webServiceClientOrt.Register("create", new GuiClient(LoadOrte));
	_webServiceClientOrt.Register("save", new GuiClient(RenameTreeNode));
	_webServiceClientOrt.Register("save", new GuiClient(MoveTreeNode));
	_webServiceClientOrt.Register("loadAll", new GuiClient(FillTreeWithRootOrten));
	_webServiceClientOrt.Register("loadAll", new GuiClient(FillGridWithRootOrten));
	_webServiceClientOrt.Register("load", new GuiClient(FillTreeWithOrtChildren));
	_webServiceClientOrt.Register("load", new GuiClient(FillGridWithOrtChildren));

    $("#navigation").Navigation();

    $("#breadcrumb").Breadcrumb({
        PageName : "OrtExplorer"
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
		if (data.node.id == GetAbstractOrtNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Root", "open"));
		}
		else
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Ort", "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractOrtNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Root"));
		}
		else
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Ort"));
		}
	})
	.on("select_node.jstree", function(event, data) {
		if ($("#tree").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id == GetAbstractOrtNode().id)
			{
				_webServiceClientOrt.LoadAll("tree.selected");
			}
			else
			{
				_webServiceClientOrt.Load(data.node.original, "tree.selected");
			}
		}
		else
		{
			$("#tree").jstree(true).load_node(data.node, function(){ console.log($("#tree").jstree(true).get_node(data.node)); });
		}
		// $("#grid").jsGrid("cancelEdit");
		// $("#grid").jsGrid("clearInsert");

		// $("#path").val("/");

		// if (data.node.original.id == GetAbstractOrtNode().id)
		// {
		// 	_webServiceClientOrt.LoadAll("tree.selected");
		// }
		// else
		// {
		// 	var node = data.node.original.original;
		// 	$("#path").val("/" + node.Path);
		// 	_webServiceClientOrt.Load(node, "tree.selected");
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

		_webServiceClientOrt.Save(node, "tree.renamed");
	})
	.on("loaded.jstree", function(event, data) {
		$("#tree").jstree(true).open_node(GetAbstractOrtNode().id, function() {
			$("#tree").jstree(true).select_node(GetAbstractOrtNode().id);
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

			_webServiceClientOrt.Save(node, "tree.moved");
			// TODO
			//_webServiceClientOrt.Load(node.original, "tree.selected");
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
					callbackFunction(new Array(CreateAbstractOrtNode()));
				}
				else if (node.id == GetAbstractOrtNode().id)
				{
					_webServiceClientOrt.LoadAll("tree.loaded");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientOrt.Load(node.original, "tree.loaded");
					}
					else
					{
						_webServiceClientOrt.Load(node.original.original, "tree.loaded");
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
							OpenOrtFormular($node);
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

function FillTreeWithRootOrten(rootOrte, sender)
{
	if (sender == undefined ||
		sender != "tree.loaded")
	{
		return;
	}

	var children = $("#tree").jstree(true).get_node(GetAbstractOrtNode().id).children;
	$("#tree").jstree(true).delete_node(children);

	for (var i = 0; i < rootOrte.length; i++)
	{
		var ortNode = CreateOrtNode(rootOrte[i]);
		ortNode.parent = "-1";
		$("#tree").jstree(true).create_node(ortNode.parent, ortNode, "last");
	}

	$("#tree").jstree(true).open_node(GetAbstractOrtNode().id);
}

function RenameTreeNode(ort, sender)
{
	if (sender != undefined &&
		sender != "tree.renamed")
	{
		return;
	}

	if (ort.Parent == null)
	{
		$("#tree").jstree(true).refresh_node(GetAbstractOrtNode().id);
	}
	else
	{
		$("#tree").jstree(true).refresh_node(ort.Parent.Id);
	}
}

function MoveTreeNode(ort, sender)
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

function FillTreeWithOrtChildren(ort, sender)
{
	if (sender == undefined ||
		sender != "tree.loaded")
	{
		return;
	}

	var node = $("#tree").jstree(true).get_node(ort.Id);
	$("#tree").jstree(true).delete_node(node.children);
	node.original = ort;

	for (var i = 0; i < ort.Children.length; i++)
	{
		var ortNode = CreateOrtNode(ort.Children[i]);
		ortNode.parent = ort.Id;

		$("#tree").jstree(true).create_node(ortNode.parent, ortNode, "last");
	}

	$("#tree").jstree(true).open_node(ort.Id);
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
				_webServiceClientOrt.Create(ConvertToJson(item), "grid.created");
			},
			updateItem: function(item) {
				_webServiceClientOrt.Save(ConvertToJson(item), "grid.updated");
			},
			deleteItem: function(item) {
				_webServiceClientOrt.Delete(item, "grid.deleted");
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
				type: "icon",
				width: 16
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

function GetAbstractOrtNode()
{
	return CreateAbstractOrtNode();
}

function CreateAbstractOrtNode()
{
	var node = new Object();
	node.id = -1;
	node.text = "Orte";
	node.children = true;
	node.icon = GetIcon("Root");
	node.state = new Object();

	return node;
}

function CreateOrtNode(ort)
{
	var node = new Object();
	node.id = ort.Id;
	node.text = ort.Type.Bezeichnung + ": " + ort.Bezeichnung;
	node.original = ort;
	node.children = true;
	node.icon = GetIcon("Ort");

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

function LoadOrte()
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

function FillGridWithRootOrten(orte, sender)
{
	if (sender == undefined ||
		(sender != "tree.loaded" &&
		 sender != "tree.selected"))
	{
		return;
	}

	$("#grid").empty();

	var entries = new Array();

	orte.forEach(ort => {
		var entry = new Object();
		entry.Bezeichnung = ort.Bezeichnung;
		entry.Type = ort.Type.Bezeichnung;
		entry.Icon = GetIcon("Ort");
		entry.Original = ort;
		entries.push(entry);
	});

	$("#grid").jsGrid({
		data: entries
	});
}

function FillGridWithOrtChildren(ort, sender)
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
	entry.Type = ort.Type.Bezeichnung;
	entry.Icon = GetIcon("Ort", "open");
	entry.Original = ort;
	entries.push(entry);

	ort.Children.forEach(child => {
		var entry = new Object();
		entry.Bezeichnung = child.Bezeichnung;
		entry.Type = child.Type.Bezeichnung;
		entry.Icon = GetIcon("Ort");
		entry.Original = child;
		entries.push(entry);
	});

	if (ort.Kontexte != undefined)
	{
		ort.Kontexte.forEach(kontext => {
			var entry = new Object();
			entry.Bezeichnung = kontext.Path;
			entry.Type = kontext.Type.Bezeichnung;
			entry.Icon = GetIcon(kontext.Type.Bezeichnung);
			entry.Original = kontext;
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
		return "fas fa-map-marker leaf";
	}

	if (type == "Ort")
	{
		return "fas fa-map-marker leaf";
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

	return "";
}
