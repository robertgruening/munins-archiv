$(document).ready(function() {	
	_webServiceClientOrt.Register("delete", new GuiClient(LoadOrte));
	_webServiceClientOrt.Register("create", new GuiClient(LoadOrte));
	_webServiceClientOrt.Register("save", new GuiClient(LoadOrte));
	_webServiceClientOrt.Register("loadAll", new GuiClient(FillTreeWithRootOrte));
	_webServiceClientOrt.Register("loadAll", new GuiClient(FillGridWithRootOrte));
	_webServiceClientOrt.Register("load", new GuiClient(FillTreeWithOrtChildren));
	_webServiceClientOrt.Register("load", new GuiClient(FillGridWithOrtChildren));
	_webServiceClientOrt.Register("load", new GuiClient(SetSelectedElement));

    InitBreadcrumb();
	InitToolbar();	
	InitTree();
	InitGrid();
});

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : "OrtExplorer"
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

/* BEGIN Path Textbox */

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

/* END Path Textbox */

/* BEGIN Tree */

function InitTree()
{
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
		ResetPath();

		if ($("#tree").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id != undefined &&
				data.node.original.id == GetAbstractOrtNode().id)
			{
				SetSelectedElement(GetAbstractOrtNode());
				_webServiceClientOrt.LoadAll("tree.selected");
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

				_webServiceClientOrt.Load(GetSelectedElement(), "tree.selected");
			}
		}
		else
		{
			$("#tree").jstree(true).load_node(data.node, function() {
				var loadedSelectedNode = $("#tree").jstree(true).get_node(data.node);

				if (data.node.original.id != undefined &&
					data.node.original.id == GetAbstractOrtNode().id)
				{
					SetSelectedElement(GetAbstractOrtNode());
					_webServiceClientOrt.LoadAll("tree.selected");
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
		$("#tree").jstree(true).open_node(GetAbstractOrtNode().id, function() {
			$("#tree").jstree(true).select_node(GetAbstractOrtNode().id);
		});
	})
    .jstree({
        "core": {
			"multiple": false,
			"check_callback" : true,
			"data" : function (node, callbackFunction) {
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
		}
    });
}

function FillTreeWithRootOrte(rootOrte, sender)
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
		ortNode.parent = GetAbstractOrtNode().id;
		$("#tree").jstree(true).create_node(ortNode.parent, ortNode, "last");
	}
	
	$("#tree").jstree(true).open_node(GetAbstractOrtNode().id);
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
	node.BaseType = "Root";

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
	node.BaseType = "Ort";

	return node;
}

function LoadOrte(node, sender)
{
	if (sender == "saved" ||
		sender == "deleted")
	{
		if (GetSelectedElement().Parent == null)
		{
			$("#tree").jstree(true).refresh_node(GetAbstractOrtNode().id);
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

/* END Tree */

/* BEGIN Grid */

var IconField = function(config) {
	jsGrid.Field.call(this, config);
}

IconField.prototype = new jsGrid.Field({
	itemTemplate: function(value) {
		return $("<i>").addClass(value);
	}
});

function InitGrid()
{
	_webServiceClientOrtType.LoadAll();
	jsGrid.fields.icon = IconField;
	$("#grid").jsGrid({
        width: "70%",

		selecting: true,
        inserting: false,
        editing: false,
        sorting: true,
        paging: false,
		autoload: false,
		
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
			},
			{ 
				title: "Anzahl Kontexte",
				name: "CountOfKontexte", 
				type: "text", 
				validate: "required"
			}
		],

		rowClick: function(args) {
			$("#grid tr").removeClass("selected-row");			

			if (args.item.BaseType == "Ort")
			{
				_webServiceClientOrt.Load(args.item.Original, "grid.selected");
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
				$("#tree").jstree(true).select_node(GetAbstractOrtNode().id);
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

function FillGridWithRootOrte(orte, sender)
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
		entry.CountOfKontexte = ort.CountOfKontexte;
		entry.BaseType = "Ort";
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
	entry.CountOfKontexte = ort.CountOfKontexte;
	entry.BaseType = "Ort";
	entry.Icon = GetIcon("Ort", "open");
	entry.Original = ort;
	entries.push(entry);

	ort.Children.forEach(child => {
		var entry = new Object();
		entry.Bezeichnung = child.Bezeichnung;
		entry.Type = child.Type.Bezeichnung;
		entry.CountOfKontexte = child.CountOfKontexte;
		entry.BaseType = "Ort";
		entry.Icon = GetIcon("Ort");
		entry.Original = child;
		entries.push(entry);
	});

	$("#grid").jsGrid({
		data: entries
	});
}

/* END Grid */

function GetIcon(type, state)
{
	return IconConfig.getCssClasses(type, state);
}

/* BEGIN Toolbar */

function ShowFormCreate()
{
	var selectedNode = GetSelectedElement();
	var newNode = new Ort();

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
				newNode.Bezeichnung = GetOrtBezeichnung();
				newNode.Type.Id = GetOrtTypeId();
				
				_webServiceClientOrt.Create(newNode, "saved");

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
				selectedNode.Bezeichnung = GetOrtBezeichnung();
				selectedNode.Type = new Object();
				selectedNode.Type.Id = GetOrtTypeId();
				
				_webServiceClientOrt.Save(selectedNode, "saved");

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
				else if (GetSelectedParentElement().Id == GetAbstractOrtNode().Id)
				{
					selectedElement.Parent = null;
				}
				else
				{
					selectedElement.Parent = GetSelectedParentElement();
				}
				
				_webServiceClientOrt.Save(selectedNode, "saved");

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
				_webServiceClientOrt.Delete(selectedNode, "deleted");

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

/* BEGIN Toolbar */