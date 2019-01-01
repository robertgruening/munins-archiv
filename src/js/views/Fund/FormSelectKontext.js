$(document).ready(function() {
    _webServiceClientKontext.Register("loadAll", new GuiClient(FillTreeSelectWithRootKontexte));
    _webServiceClientKontext.Register("load", new GuiClient(FillTreeSelectWithKontextChildren));
    _webServiceClientKontext.Register("load", new GuiClient(SetSelectedKontext));

	InitTreeSelectKontext();
});

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

function InitTreeSelectKontext()
{
	$("#treeSelectKontext")
	.on("open_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractKontextNode().id)
		{
			$("#treeSelectKontext").jstree(true).set_icon(data.node.id, GetIcon("Root", "open"));
		}
		else
		{
			$("#treeSelectKontext").jstree(true).set_icon(data.node.id, GetIcon(data.node.Type.Bezeichnung, "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractKontextNode().id)
		{
			$("#treeSelectKontext").jstree(true).set_icon(data.node.id, GetIcon("Root"));
		}
		else
		{
			$("#treeSelectKontext").jstree(true).set_icon(data.node.id, GetIcon(data.node.Type.Bezeichnung));
		}
	})
	.on("select_node.jstree", function(event, data) {

		if ($("#treeSelectKontext").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id != undefined &&
				data.node.original.id == GetAbstractKontextNode().id)
			{
				SetSelectedKontext(null);
				_webServiceClientKontext.LoadAll("treeSelect.selected");
			}
			else
			{
				if (data.node.original.original == undefined)
				{
					SetSelectedKontext(data.node.original);
				}
				else
				{
					SetSelectedKontext(data.node.original.original);
				}

				_webServiceClientKontext.Load(GetSelectedKontext(), "treeSelect.selected");
			}
		}
		else
		{
			$("#treeSelectKontext").jstree(true).load_node(data.node, function() {
				var loadedSelectedNode = $("#treeSelectKontext").jstree(true).get_node(data.node);

				if (data.node.original.id != undefined &&
					data.node.original.id == GetAbstractKontextNode().id)
				{
					SetSelectedKontext(null);
					_webServiceClientKontext.LoadAll("treeSelect.selected");
				}
				else
				{
					if (loadedSelectedNode.original.original == undefined)
					{
						SetSelectedKontext(loadedSelectedNode.original);
					}
					else
					{
						SetSelectedKontext(loadedSelectedNode.original.original);
					}
				}
			});
		}
	})
	.on("loaded.jstree", function(event, data) {
		$("#treeSelectKontext").jstree(true).open_node(GetAbstractKontextNode().id, function() {
			$("#treeSelectKontext").jstree(true).select_node(GetAbstractKontextNode().id);
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
					callbackFunction(new Array(CreateAbstractKontextNode()));
				}
				else if (node.id == GetAbstractKontextNode().id)
				{
					_webServiceClientKontext.LoadAll("treeSelect.loaded");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientKontext.Load(node.original, "treeSelect.loaded");
					}
					else
					{
						_webServiceClientKontext.Load(node.original.original, "treeSelect.loaded");
					}
					callbackFunction(new Array());
				}
			}
		}
	});
}

function FillTreeSelectWithRootKontexte(rootKontexte, sender)
{
	if (sender == undefined ||
		sender != "treeSelect.loaded")
	{
		return;
	}

	var children = $("#treeSelectKontext").jstree(true).get_node(GetAbstractKontextNode().id).children;
	$("#treeSelectKontext").jstree(true).delete_node(children);

	for (var i = 0; i < rootKontexte.length; i++)
	{
		var kontextNode = CreateKontextNode(rootKontexte[i]);
		kontextNode.parent = GetAbstractKontextNode().id;
		$("#treeSelectKontext").jstree(true).create_node(kontextNode.parent, kontextNode, "last");
	}
	
	$("#treeSelectKontext").jstree(true).open_node(GetAbstractKontextNode().id);
}

function FillTreeSelectWithKontextChildren(kontext, sender)
{
	if (sender == undefined ||
		sender != "treeSelect.loaded")
	{
		return;
	}

	var node = $("#treeSelectKontext").jstree(true).get_node(kontext.Id);
	$("#treeSelectKontext").jstree(true).delete_node(node.children);
	node.original = kontext;

	for (var i = 0; i < kontext.Children.length; i++)
	{
		var kontextNode = CreateKontextNode(kontext.Children[i]);
		kontextNode.parent = kontext.Id;
		
		$("#treeSelectKontext").jstree(true).create_node(kontextNode.parent, kontextNode, "last");
	}

	$("#treeSelectKontext").jstree(true).open_node(kontext.Id);
}