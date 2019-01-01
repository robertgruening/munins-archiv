$(document).ready(function() {
    _webServiceClientAblage.Register("loadAll", new GuiClient(FillTreeSelectWithRootAblagen));
    _webServiceClientAblage.Register("load", new GuiClient(FillTreeSelectWithAblageChildren));
    _webServiceClientAblage.Register("load", new GuiClient(GetSelectedAblage));

	InitTreeSelectAblage();
});

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

function InitTreeSelectAblage()
{
	$("#treeSelectAblage")
	.on("open_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractAblageNode().id)
		{
			$("#treeSelectAblage").jstree(true).set_icon(data.node.id, GetIcon("Root", "open"));
		}
		else
		{
			$("#treeSelectAblage").jstree(true).set_icon(data.node.id, GetIcon("Ablage", "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractAblageNode().id)
		{
			$("#treeSelectAblage").jstree(true).set_icon(data.node.id, GetIcon("Root"));
		}
		else
		{
			$("#treeSelectAblage").jstree(true).set_icon(data.node.id, GetIcon("Ablage"));
		}
	})
	.on("select_node.jstree", function(event, data) {

		if ($("#treeSelectAblage").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id != undefined &&
				data.node.original.id == GetAbstractAblageNode().id)
			{
				SetSelectedAblage(null);
				_webServiceClientAblage.LoadAll("treeSelect.selected");
			}
			else
			{
				if (data.node.original.original == undefined)
				{
					SetSelectedAblage(data.node.original);
				}
				else
				{
					SetSelectedAblage(data.node.original.original);
				}

				_webServiceClientAblage.Load(GetSelectedAblage(), "treeSelect.selected");
			}
		}
		else
		{
			$("#treeSelectAblage").jstree(true).load_node(data.node, function() {
				var loadedSelectedNode = $("#treeSelectAblage").jstree(true).get_node(data.node);

				if (data.node.original.id != undefined &&
					data.node.original.id == GetAbstractAblageNode().id)
				{
					SetSelectedAblage(null);
					_webServiceClientAblage.LoadAll("treeSelect.selected");
				}
				else
				{
					if (loadedSelectedNode.original.original == undefined)
					{
						SetSelectedAblage(loadedSelectedNode.original);
					}
					else
					{
						SetSelectedAblage(loadedSelectedNode.original.original);
					}
				}
			});
		}
	})
	.on("loaded.jstree", function(event, data) {
		$("#treeSelectAblage").jstree(true).open_node(GetAbstractAblageNode().id, function() {
			$("#treeSelectAblage").jstree(true).select_node(GetAbstractAblageNode().id);
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
					_webServiceClientAblage.LoadAll("treeSelect.loaded");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientAblage.Load(node.original, "treeSelect.loaded");
					}
					else
					{
						_webServiceClientAblage.Load(node.original.original, "treeSelect.loaded");
					}
					callbackFunction(new Array());
				}
			}
		}
	});
}

function FillTreeSelectWithRootAblagen(rootAblagen, sender)
{
	if (sender == undefined ||
		sender != "treeSelect.loaded")
	{
		return;
	}

	var children = $("#treeSelectAblage").jstree(true).get_node(GetAbstractAblageNode().id).children;
	$("#treeSelectAblage").jstree(true).delete_node(children);

	for (var i = 0; i < rootAblagen.length; i++)
	{
		var ablageNode = CreateAblageNode(rootAblagen[i]);
		ablageNode.parent = GetAbstractAblageNode().id;
		$("#treeSelectAblage").jstree(true).create_node(ablageNode.parent, ablageNode, "last");
	}
	
	$("#treeSelectAblage").jstree(true).open_node(GetAbstractAblageNode().id);
}

function FillTreeSelectWithAblageChildren(ablage, sender)
{
	if (sender == undefined ||
		sender != "treeSelect.loaded")
	{
		return;
	}

	var node = $("#treeSelectAblage").jstree(true).get_node(ablage.Id);
	$("#treeSelectAblage").jstree(true).delete_node(node.children);
	node.original = ablage;

	for (var i = 0; i < ablage.Children.length; i++)
	{
		var ablageNode = CreateAblageNode(ablage.Children[i]);
		ablageNode.parent = ablage.Id;
		
		$("#treeSelectAblage").jstree(true).create_node(ablageNode.parent, ablageNode, "last");
	}

	$("#treeSelectAblage").jstree(true).open_node(ablage.Id);
}