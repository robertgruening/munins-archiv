$(document).ready(function() {	
	_webServiceClientFundAttribut.Register("delete", new GuiClient(LoadFundAttribute));
	_webServiceClientFundAttribut.Register("create", new GuiClient(LoadFundAttribute));
	_webServiceClientFundAttribut.Register("save", new GuiClient(LoadFundAttribute));
	_webServiceClientFundAttribut.Register("loadAll", new GuiClient(FillTreeWithRootFundAttribute));
	_webServiceClientFundAttribut.Register("loadAll", new GuiClient(FillGridWithRootFundAttribute));
	_webServiceClientFundAttribut.Register("load", new GuiClient(FillTreeWithFundAttributChildren));
	_webServiceClientFundAttribut.Register("load", new GuiClient(FillGridWithFundAttributChildren));
	_webServiceClientFundAttribut.Register("load", new GuiClient(SetSelectedElement));

    InitBreadcrumb();
	InitToolbar();	
	InitTree();
	InitGrid();
});

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : "FundAttributExplorer"
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
		if (data.node.id == GetAbstractFundAttributNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Root", "open"));
		}
		else
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("FundAttribut", "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractFundAttributNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Root"));
		}
		else
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("FundAttribut"));
		}
	})
	.on("select_node.jstree", function(event, data) {
		ResetPath();

		if ($("#tree").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id != undefined &&
				data.node.original.id == GetAbstractFundAttributNode().id)
			{
				SetSelectedElement(GetAbstractFundAttributNode());
				_webServiceClientFundAttribut.LoadAll("tree.selected");
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

				_webServiceClientFundAttribut.Load(GetSelectedElement(), "tree.selected");
			}
		}
		else
		{
			$("#tree").jstree(true).load_node(data.node, function() {
				var loadedSelectedNode = $("#tree").jstree(true).get_node(data.node);

				if (data.node.original.id != undefined &&
					data.node.original.id == GetAbstractFundAttributNode().id)
				{
					SetSelectedElement(GetAbstractFundAttributNode());
					_webServiceClientFundAttribut.LoadAll("tree.selected");
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
		$("#tree").jstree(true).open_node(GetAbstractFundAttributNode().id, function() {
			$("#tree").jstree(true).select_node(GetAbstractFundAttributNode().id);
		});
	})
    .jstree({
        "core": {
			"multiple": false,
			"check_callback" : true,
			"data" : function (node, callbackFunction) {
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
		}
    });
}

function FillTreeWithRootFundAttribute(rootFundAttribute, sender)
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
		fundAttributNode.parent = GetAbstractFundAttributNode().id;
		$("#tree").jstree(true).create_node(fundAttributNode.parent, fundAttributNode, "last");
	}
	
	$("#tree").jstree(true).open_node(GetAbstractFundAttributNode().id);
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

function GetAbstractFundAttributNode()
{
	return CreateAbstractFundAttributNode();
}

function CreateAbstractFundAttributNode()
{
	var node = new Object();
	node.id = -1;
	node.text = "FundAttribute";
	node.children = true;
	node.icon = GetIcon("Root");
	node.BaseType = "Root";

	return node;
}

function CreateFundAttributNode(fundAttribut)
{
	var node = new Object();
	node.id = fundAttribut.Id;
	node.text = fundAttribut.Type.Bezeichnung + ": " + fundAttribut.Bezeichnung;
	node.original = fundAttribut;
	node.children = true;
	node.icon = GetIcon("FundAttribut");
	node.BaseType = "FundAttribut";

	return node;
}

function LoadFundAttribute(node, sender)
{
	if (sender == "saved" ||
		sender == "deleted")
	{
		if (GetSelectedElement().Parent == null)
		{
			$("#tree").jstree(true).refresh_node(GetAbstractFundAttributNode().id);
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
	_webServiceClientFundAttributType.LoadAll();
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
				title: "Anzahl Funde",
				name: "CountOfFunde", 
				type: "text", 
				validate: "required"
			}
		],

		rowClick: function(args) {
			$("#grid tr").removeClass("selected-row");			

			if (args.item.BaseType == "FundAttribut")
			{
				_webServiceClientFundAttribut.Load(args.item.Original, "grid.selected");
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
				$("#tree").jstree(true).select_node(GetAbstractFundAttributNode().id);
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

function FillGridWithRootFundAttribute(fundAttribute, sender)
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
		entry.BaseType = "FundAttribut";
		entry.Icon = GetIcon("FundAttribut");
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
	entry.BaseType = "FundAttribut";
	entry.Icon = GetIcon("FundAttribut", "open");
	entry.Original = fundAttribut;
	entries.push(entry);

	fundAttribut.Children.forEach(child => {
		var entry = new Object();
		entry.Bezeichnung = child.Bezeichnung;
		entry.Type = child.Type.Bezeichnung;
		entry.CountOfFunde = child.CountOfFunde;
		entry.BaseType = "FundAttribut";
		entry.Icon = GetIcon("FundAttribut");
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
	var newNode = new FundAttribut();

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
				newNode.Bezeichnung = GetFundAttributBezeichnung();
				newNode.Type.Id = GetFundAttributTypeId();
				
				_webServiceClientFundAttribut.Create(newNode, "saved");

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
				selectedNode.Bezeichnung = GetFundAttributBezeichnung();
				selectedNode.Type = new Object();
				selectedNode.Type.Id = GetFundAttributTypeId();
				
				_webServiceClientFundAttribut.Save(selectedNode, "saved");

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
				else if (GetSelectedParentElement().Id == GetAbstractFundAttributNode().Id)
				{
					selectedElement.Parent = null;
				}
				else
				{
					selectedElement.Parent = GetSelectedParentElement();
				}
				
				_webServiceClientFundAttribut.Save(selectedNode, "saved");

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
				_webServiceClientFundAttribut.Delete(selectedNode, "deleted");

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