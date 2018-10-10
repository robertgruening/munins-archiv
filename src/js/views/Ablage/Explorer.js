$(document).ready(function() {
	_webServiceClientAblageType.Register("loadAll", new GuiClient(FillSelectionAblageType));
	_webServiceClientAblage.Register("delete", new GuiClient(LoadAblagen));
	_webServiceClientAblage.Register("create", new GuiClient(LoadAblagen));
	_webServiceClientAblage.Register("save", new GuiClient(LoadAblagen));
	_webServiceClientAblage.Register("save", new GuiClient(MoveTreeNode));
	_webServiceClientAblage.Register("loadAll", new GuiClient(FillTreeWithRootAblagen));
	_webServiceClientAblage.Register("loadAll", new GuiClient(FillTreeMoveWithRootAblagen));
	_webServiceClientAblage.Register("loadAll", new GuiClient(FillGridWithRootAblagen));
	_webServiceClientAblage.Register("load", new GuiClient(FillTreeWithAblageChildren));
	_webServiceClientAblage.Register("load", new GuiClient(FillTreeMoveWithAblageChildren));
	_webServiceClientAblage.Register("load", new GuiClient(FillGridWithAblageChildren));
	_webServiceClientAblage.Register("load", new GuiClient(SetSelectedElement));
	_webServiceClientAblage.Register("load", new GuiClient(SetSelectedParentElement));

	InitMessageBox();
	InitNavigation();
    InitBreadcrumb();
	InitToolbar();	
	InitTree();
	InitTreeMove();
	InitGrid();
});

function InitMessageBox()
{
    $("#messageBox").dialog({
        autoOpen: false,
        height: "auto",
        modal: true
    });
}

function InitNavigation()
{
    $("#navigation").Navigation();
}

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : "AblageExplorer"
	});
}

function InitToolbar()
{
	DisableCreateButton();
	$("#create").click(ShowFormCreate);

	DisableEditButton();
	$("#edit").click(ShowFormEdit);

	DisableMoveButton();
	$("#move").click(ShowFormMove);

	DisableDeleteButton();
	$("#delete").click(ShowDialogDelete);
}

function EnableCreateButton()
{
	$("#create").removeClass("disabled");
}

function DisableCreateButton()
{
	$("#create").addClass("disabled");
}

function EnableEditButton()
{
	$("#edit").removeClass("disabled");
}

function DisableEditButton()
{
	$("#edit").addClass("disabled");
}

function EnableMoveButton()
{
	$("#move").removeClass("disabled");
}

function DisableMoveButton()
{
	$("#move").addClass("disabled");
}

function EnableDeleteButton()
{
	$("#delete").removeClass("disabled");
}

function DisableDeleteButton()
{
	$("#delete").addClass("disabled");
}

function InitTree()
{
	$("#tree")
	.on("open_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractAblageNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Root", "open"));
		}
		else
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Ablage", "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractAblageNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Root"));
		}
		else
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Ablage"));
		}
	})
	.on("select_node.jstree", function(event, data) {
		ResetPath();

		if ($("#tree").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id != undefined &&
				data.node.original.id == GetAbstractAblageNode().id)
			{
				SetSelectedElement(GetAbstractAblageNode());
				_webServiceClientAblage.LoadAll("tree.selected");
			}
			else
			{
				if (data.node.original.original == undefined)
				{
					SetSelectedElement(data.node.original);
					SetPath(data.node.original);
				}
				else
				{
					SetSelectedElement(data.node.original.original);
					SetPath(data.node.original.original);
				}

				_webServiceClientAblage.Load(GetSelectedElement(), "tree.selected");
			}
		}
		else
		{
			$("#tree").jstree(true).load_node(data.node, function() {
				var loadedSelectedNode = $("#tree").jstree(true).get_node(data.node);

				if (data.node.original.id != undefined &&
					data.node.original.id == GetAbstractAblageNode().id)
				{
					SetSelectedElement(GetAbstractAblageNode());
					_webServiceClientAblage.LoadAll("tree.selected");
				}
				else
				{
					if (loadedSelectedNode.original.original == undefined)
					{
						SetSelectedElement(loadedSelectedNode.original);
						SetPath(oadedSelectedNode.original);
					}
					else
					{
						SetSelectedElement(loadedSelectedNode.original.original);
						SetPath(loadedSelectedNode.original.original);
					}
				}
			});
		}
	})
	.on("loaded.jstree", function(event, data) {
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
					"Create": {
						"label": "Anlegen",
						"title": "Anlegen",
						"action": function(obj) {
							ShowFormCreate();
						}
					},
					"Edit": {
						"label": "Beabeiten",
						"title": "Beabeiten",
						"action": function(obj) {
							ShowFormEdit();
						}
					},
					"Move": {
						"label": "Verschieben",
						"title": "Verschieben",
						"action": function(obj) {
							ShowFormMove();
						}
					},
					"Delete": {
						"label": "Löschen",
						"title": "Löschen",
						"action": function(obj) {
							ShowDialogDelete();
						}
					}
				};
			}
		}
    });
}

function InitGrid()
{
	_webServiceClientAblageType.LoadAll();
	jsGrid.fields.icon = IconField;
	$("#grid").jsGrid({
        width: "70%",

		selecting: true,
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
		
		fields: [
			{ 
				title: "",
				name: "Icon", 
				type: "icon"
			},
			{ 
				title: "Typ",
				name: "Type",
				type: "text"
			},
			{ 
				name: "Bezeichnung", 
				type: "text", 
				validate: "required"
			}
		],

		rowClick: function(args) {
			$("#grid tr").removeClass("selected-row");			

			if (args.item.BaseType == "Ablage")
			{
				_webServiceClientAblage.Load(args.item.Original, "grid.selected");
			}
			else
			{
				SetSelectedElement(null);
			}
			
			$selectedRow = $(args.event.target).closest("tr");
			$selectedRow.addClass("selected-row");
		},

		rowDoubleClick: function(data) {
			$("#tree").jstree(true).deselect_all();

			var selectedNode = $("#tree").jstree(true).get_node(data.item.Original.Id);

			if (selectedNode == undefined)
			{
				$("#tree").jstree(true).select_node(GetAbstractAblageNode().id);
				return;
			}

			if (data.item.Bezeichnung === "..")
			{
				$("#tree").jstree(true).select_node(selectedNode.parent);
			}
			else
			{
				$("#tree").jstree(true).open_node(data.item.Original.Id, function(){
					$("#tree").jstree(true).select_node(data.item.Original.Id);
				});
			}
		}
	});
}

function FillTreeWithRootAblagen(rootAblagen, sender)
{
	if (sender == undefined ||
		sender != "tree.loaded")
	{
		return;
	}

	var children = $("#tree").jstree(true).get_node(GetAbstractAblageNode().id).children;
	$("#tree").jstree(true).delete_node(children);

	for (var i = 0; i < rootAblagen.length; i++)
	{
		var ablageNode = CreateAblageNode(rootAblagen[i]);
		ablageNode.parent = GetAbstractAblageNode().id;
		$("#tree").jstree(true).create_node(ablageNode.parent, ablageNode, "last");
	}
	
	$("#tree").jstree(true).open_node(GetAbstractAblageNode().id);
}

function FillTreeMoveWithRootAblagen(rootAblagen, sender)
{
	if (sender == undefined ||
		sender != "treeMove.loaded")
	{
		return;
	}

	var selectedElement = GetSelectedElement();

	var children = $("#treeMove").jstree(true).get_node(GetAbstractAblageNode().id).children;
	$("#treeMove").jstree(true).delete_node(children);

	for (var i = 0; i < rootAblagen.length; i++)
	{
		if (selectedElement != null &&
			selectedElement.Id == rootAblagen[i].Id)
		{
			continue;
		}

		var ablageNode = CreateAblageNode(rootAblagen[i]);
		ablageNode.parent = GetAbstractAblageNode().id;
		$("#treeMove").jstree(true).create_node(ablageNode.parent, ablageNode, "last");
	}
	
	$("#treeMove").jstree(true).open_node(GetAbstractAblageNode().id);
}

function MoveTreeNode(ablage, sender)
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

function FillTreeWithAblageChildren(ablage, sender)
{
	if (sender == undefined ||
		sender != "tree.loaded")
	{
		return;
	}

	var node = $("#tree").jstree(true).get_node(ablage.Id);
	$("#tree").jstree(true).delete_node(node.children);
	node.original = ablage;

	for (var i = 0; i < ablage.Children.length; i++)
	{
		var ablageNode = CreateAblageNode(ablage.Children[i]);
		ablageNode.parent = ablage.Id;
		
		$("#tree").jstree(true).create_node(ablageNode.parent, ablageNode, "last");
	}

	$("#tree").jstree(true).open_node(ablage.Id);
}

function FillTreeMoveWithAblageChildren(ablage, sender)
{
	if (sender == undefined ||
		sender != "treeMove.loaded")
	{
		return;
	}
	
	var selectedElement = GetSelectedElement();

	var node = $("#treeMove").jstree(true).get_node(ablage.Id);
	$("#treeMove").jstree(true).delete_node(node.children);
	node.original = ablage;

	for (var i = 0; i < ablage.Children.length; i++)
	{
		if (selectedElement != null &&
			selectedElement.Id == ablage.Children[i].Id)
		{
			continue;
		}

		var ablageNode = CreateAblageNode(ablage.Children[i]);
		ablageNode.parent = ablage.Id;
		
		$("#treeMove").jstree(true).create_node(ablageNode.parent, ablageNode, "last");
	}

	$("#treeMove").jstree(true).open_node(ablage.Id);
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
	node.BaseType = "Root";

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
	node.BaseType = "Ablage";

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

function LoadAblagen(node, sender)
{
	if (sender == "saved" ||
		sender == "deleted")
	{
		if (GetSelectedElement().Parent == null)
		{
			$("#tree").jstree(true).refresh_node(GetAbstractAblageNode().id);
		}
		else
		{
			$("#tree").jstree(true).refresh_node(GetSelectedElement().Parent.Id);
		}
	}
	else
	{
		$("#tree").jstree(true).refresh_node(GetSelectedElement().Id);
	}
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
		entry.BaseType = "Ablage";
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
	entry.BaseType = "Ablage";
	entry.Icon = GetIcon("Ablage", "open");
	entry.Original = ablage;
	entries.push(entry);

	ablage.Children.forEach(child => {
		var entry = new Object();
		entry.Bezeichnung = child.Bezeichnung;
		entry.Type = child.Type.Bezeichnung;
		entry.BaseType = "Ablage";
		entry.Icon = GetIcon("Ablage");
		entry.Original = child;
		entries.push(entry);
	});

	ablage.Funde.forEach(fund => {
		var entry = new Object();
		entry.Bezeichnung = getFundLabelText(fund);
		entry.Type = "Fund";
		entry.BaseType = "Fund";
		entry.Icon = GetIcon("Fund");
		entry.Original = fund;
		entries.push(entry);
	});

	$("#grid").jsGrid({
		data: entries
	});
}

function GetIcon(type, state)
{
	return IconConfig.getCssClasses(type, state);
}

function ResetPath()
{
	$("#path").val("/");
}

function SetPath(node)
{
	if (node == undefined ||
		node == null ||
		node.Path == undefined ||
		node.Path == null)
	{
		ResetPath();
	}
	else
	{
		$("#path").val("/" + node.Path);
	}
}

function ShowFormCreate()
{
	var selectedNode = GetSelectedElement();

	var newNode = new Ablage();

	if (selectedNode.Id != undefined)
	{
		newNode.Parent = selectedNode;
		newNode.Path = selectedNode.Path + "/";
	}

	$("#form").dialog({
		height: "auto",
		width: 750,
		title: "Anlegen",
		modal: true,
		resizable: false,
		buttons: {
			"Speichern": function()
			{
				newNode.Bezeichnung = GetAblageBezeichnung();
				newNode.Type.Id = GetAblageTypeId();
				
				_webServiceClientAblage.Create(newNode, "saved");

				$(this).dialog("close");
			},
			"Abbrechen": function()
			{
				$(this).dialog("close");
			}
		}
	});

	$("#form").dialog("open");
	FillEditForm(newNode);
}

function ShowFormEdit()
{
	var selectedNode = GetSelectedElement();

	if (selectedNode == null)
	{
		return;
	}

	$("#form").dialog({
		height: "auto",
		width: 750,
		title: "Bearbeiten",
		modal: true,
		resizable: false,
		buttons: {
			"Speichern": function()
			{
				selectedNode.Bezeichnung = GetAblageBezeichnung();
				selectedNode.Type = new Object();
				selectedNode.Type.Id = GetAblageTypeId();
				
				_webServiceClientAblage.Save(selectedNode, "saved");

				$(this).dialog("close");
			},
			"Abbrechen": function()
			{
				$(this).dialog("close");
			}
		}
	});

	$("#form").dialog("open");
	FillEditForm(selectedNode);
}

function ShowFormMove()
{
	var selectedNode = GetSelectedElement();

	if (selectedNode == null)
	{
		return;
	}

	$("#dialogMove").dialog({
		height: "auto",
		width: 750,
		title: "Verschieben",
		modal: true,
		resizable: false,
		buttons: {
			"Speichern": function()
			{
				var selectedElement = GetSelectedElement();

				if (GetSelectedParentElement() == null)
				{	
					$(this).dialog("close");				
				}
				else if (GetSelectedParentElement().Id == GetAbstractAblageNode().Id)
				{
					selectedElement.Parent = null;
				}
				else
				{
					selectedElement.Parent = GetSelectedParentElement();
				}
				
				_webServiceClientAblage.Save(selectedNode, "saved");

				$(this).dialog("close");
				$("#tree").jstree(true).refresh();
			},
			"Abbrechen": function()
			{
				$(this).dialog("close");
			}
		}
	});

	$("#treeMove").jstree(true).refresh();

	$("#dialogMove").dialog("open");
	//FillEditForm(selectedNode);
}

function InitTreeMove()
{
	$("#treeMove")
	.on("open_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractAblageNode().id)
		{
			$("#treeMove").jstree(true).set_icon(data.node.id, GetIcon("Root", "open"));
		}
		else
		{
			$("#treeMove").jstree(true).set_icon(data.node.id, GetIcon("Ablage", "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractAblageNode().id)
		{
			$("#treeMove").jstree(true).set_icon(data.node.id, GetIcon("Root"));
		}
		else
		{
			$("#treeMove").jstree(true).set_icon(data.node.id, GetIcon("Ablage"));
		}
	})
	.on("select_node.jstree", function(event, data) {

		if ($("#treeMove").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id != undefined &&
				data.node.original.id == GetAbstractAblageNode().id)
			{
				SetSelectedParentElement(GetAbstractAblageNode());
				_webServiceClientAblage.LoadAll("treeMove.selected");
			}
			else
			{
				if (data.node.original.original == undefined)
				{
					SetSelectedParentElement(data.node.original);
				}
				else
				{
					SetSelectedParentElement(data.node.original.original);
				}

				_webServiceClientAblage.Load(GetSelectedElement(), "treeMove.selected");
			}
		}
		else
		{
			$("#treeMove").jstree(true).load_node(data.node, function() {
				var loadedSelectedNode = $("#treeMove").jstree(true).get_node(data.node);

				if (data.node.original.id != undefined &&
					data.node.original.id == GetAbstractAblageNode().id)
				{
					SetSelectedParentElement(GetAbstractAblageNode());
					_webServiceClientAblage.LoadAll("treeMove.selected");
				}
				else
				{
					if (loadedSelectedNode.original.original == undefined)
					{
						SetSelectedParentElement(loadedSelectedNode.original);
					}
					else
					{
						SetSelectedParentElement(loadedSelectedNode.original.original);
					}
				}
			});
		}
	})
	.on("loaded.jstree", function(event, data) {
		$("#treeMove").jstree(true).open_node(GetAbstractAblageNode().id, function() {
			$("#treeMove").jstree(true).select_node(GetAbstractAblageNode().id);
		});
	})
    .jstree({
        "core": {
			"multiple": false,
			"check_callback" : true,
			"data" : function (node, callbackFunction) 
			{
				if (node.id === "#")
				{
					callbackFunction(new Array(CreateAbstractAblageNode()));
				}
				else if (node.id == GetAbstractAblageNode().id)
				{
					_webServiceClientAblage.LoadAll("treeMove.loaded");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientAblage.Load(node.original, "treeMove.loaded");
					}
					else
					{
						_webServiceClientAblage.Load(node.original.original, "treeMove.loaded");
					}
					callbackFunction(new Array());
				}
			}
		}
	});
}

function ShowDialogDelete()
{
	var selectedNode = GetSelectedElement();

	$("#dialogDelete").empty();
	$("#dialogDelete").append(
		$("<p>").append("Möchten Sie \"" + selectedNode.Type.Bezeichnung + ": " + selectedNode.Bezeichnung + "\" (/" + selectedNode.Path + ") löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		width: 750,
		modal: true,
		buttons: {
			"Löschen": function()
			{
				_webServiceClientAblage.Delete(selectedNode, "deleted");

				$(this).dialog("close");
			},
			"Abbrechen": function()
			{
				$(this).dialog("close");
			}
		}
	});

	$("#DialogDelete").dialog("open");
}