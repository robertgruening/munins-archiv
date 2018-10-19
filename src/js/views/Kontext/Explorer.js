$(document).ready(function() {	
	_webServiceClientKontext.Register("delete", new GuiClient(LoadKontexte));
	_webServiceClientKontext.Register("create", new GuiClient(LoadKontexte));
	_webServiceClientKontext.Register("save", new GuiClient(LoadKontexte));
	_webServiceClientKontext.Register("loadAll", new GuiClient(FillTreeWithRootKontexte));
	_webServiceClientKontext.Register("loadAll", new GuiClient(FillGridWithRootKontexte));
	_webServiceClientKontext.Register("load", new GuiClient(FillTreeWithKontextChildren));
	_webServiceClientKontext.Register("load", new GuiClient(FillGridWithKontextChildren));
	_webServiceClientKontext.Register("load", new GuiClient(SetSelectedElement));

    InitBreadcrumb();
	InitToolbar();	
	InitTree();
	InitGrid();
});

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : "KontextExplorer"
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
		if (data.node.id == GetAbstractKontextNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Root", "open"));
		}
		else
		{
			if (data.node.original.original == undefined)
			{
				$("#tree").jstree(true).set_icon(data.node.id, GetIcon(data.node.original.Type.Bezeichnung, "open"));
			}
			else
			{
				$("#tree").jstree(true).set_icon(data.node.id, GetIcon(data.node.original.original.Type.Bezeichnung, "open"));
			}
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractKontextNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, GetIcon("Root"));
		}
		else
		{
			if (data.node.original.original == undefined)
			{
				$("#tree").jstree(true).set_icon(data.node.id, GetIcon(data.node.original.Type.Bezeichnung));
			}
			else
			{
				$("#tree").jstree(true).set_icon(data.node.id, GetIcon(data.node.original.original.Type.Bezeichnung));
			}
		}
	})
	.on("select_node.jstree", function(event, data) {
		ResetPath();

		if ($("#tree").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id != undefined &&
				data.node.original.id == GetAbstractKontextNode().id)
			{
				SetSelectedElement(GetAbstractKontextNode());
				_webServiceClientKontext.LoadAll("tree.selected");
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

				_webServiceClientKontext.Load(GetSelectedElement(), "tree.selected");
			}
		}
		else
		{
			$("#tree").jstree(true).load_node(data.node, function() {
				var loadedSelectedNode = $("#tree").jstree(true).get_node(data.node);

				if (data.node.original.id != undefined &&
					data.node.original.id == GetAbstractKontextNode().id)
				{
					SetSelectedElement(GetAbstractKontextNode());
					_webServiceClientKontext.LoadAll("tree.selected");
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
		$("#tree").jstree(true).open_node(GetAbstractKontextNode().id, function() {
			$("#tree").jstree(true).select_node(GetAbstractKontextNode().id);
		});
	})
    .jstree({
        "core": {
			"multiple": false,
			"check_callback" : true,
			"data" : function (node, callbackFunction) {
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
		}
    });
}

function FillTreeWithRootKontexte(rootKontexte, sender)
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
		kontextNode.parent = GetAbstractKontextNode().id;
		$("#tree").jstree(true).create_node(kontextNode.parent, kontextNode, "last");
	}
	
	$("#tree").jstree(true).open_node(GetAbstractKontextNode().id);
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
	node.BaseType = "Root";

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
	node.BaseType = "Kontext";

	return node;
}

function LoadKontexte(node, sender)
{
	if (sender == "saved" ||
		sender == "deleted")
	{
		if (GetSelectedElement().Parent == null)
		{
			$("#tree").jstree(true).refresh_node(GetAbstractKontextNode().id);
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
	_webServiceClientKontextType.LoadAll();
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
			}
		],

		rowClick: function(args) {
			$("#grid tr").removeClass("selected-row");			

			if (args.item.BaseType == "Kontext")
			{
				_webServiceClientKontext.Load(args.item.Original, "grid.selected");
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
				$("#tree").jstree(true).select_node(GetAbstractKontextNode().id);
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

function FillGridWithRootKontexte(kontexte, sender)
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
		entry.BaseType = "Kontext";
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
	entry.BaseType = "Kontext";
	entry.Icon = GetIcon(kontext.Type.Bezeichnung, "open");
	entry.Original = kontext;
	entries.push(entry);

	kontext.Children.forEach(child => {
		var entry = new Object();
		entry.Bezeichnung = child.Bezeichnung;
		entry.Type = child.Type.Bezeichnung;
		entry.BaseType = "Kontext";
		entry.Icon = GetIcon(child.Type.Bezeichnung);
		entry.Original = child;
		entries.push(entry);
	});

	if (kontext.Funde != undefined)
	{
		kontext.Funde.forEach(fund => {
			var entry = new Object();
			entry.Bezeichnung = getFundLabelText(fund);
			entry.Type = "Fund";
			entry.BaseType = "Fund";
			entry.Icon = GetIcon("Fund");
			entry.Original = fund;
			entries.push(entry);
		});
	}

	if (kontext.Orte != undefined)
	{
		kontext.Orte.forEach(ort => {
			var entry = new Object();
			entry.Bezeichnung = ort.Bezeichnung;
			entry.Type = ort.Type.Bezeichnung;
			entry.BaseType = "Ort";
			entry.Icon = GetIcon("Ort");
			entry.Original = ort;
			entries.push(entry);
		});
	}

	if (kontext.LfdNummern != undefined)
	{
		kontext.LfdNummern.forEach(lfdNummer => {
			var entry = new Object();
			entry.Bezeichnung = lfdNummer.Bezeichnung;
			entry.Type = "LfD-Nummer";
			entry.BaseType = "LfD-Nummer";
			entry.Icon = GetIcon("LfD-Nummer");
			entry.Original = lfdNummer;
			entries.push(entry);
		});
	}

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
	var newNode = new Kontext();

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
				newNode.Bezeichnung = GetKontextBezeichnung();
				newNode.Type.Id = GetKontextTypeId();
				
				_webServiceClientKontext.Create(newNode, "saved");

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
				selectedNode.Bezeichnung = GetKontextBezeichnung();
				selectedNode.Type = new Object();
				selectedNode.Type.Id = GetKontextTypeId();
				
				_webServiceClientKontext.Save(selectedNode, "saved");

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
				else if (GetSelectedParentElement().Id == GetAbstractKontextNode().Id)
				{
					selectedElement.Parent = null;
				}
				else
				{
					selectedElement.Parent = GetSelectedParentElement();
				}
				
				_webServiceClientKontext.Save(selectedNode, "saved");

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
				_webServiceClientKontext.Delete(selectedNode, "deleted");

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