$(document).ready(function() {
    _webServiceClientAblageParent.Register("loadAll", new GuiClient(FillTreeMoveWithRootAblagen));
    _webServiceClientAblageParent.Register("load", new GuiClient(FillTreeMoveWithAblageChildren));
    _webServiceClientAblageParent.Register("load", new GuiClient(SetSelectedParentElement));

	InitTreeMove();
});   

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
				_webServiceClientAblageParent.LoadAll("treeMove.selected");
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

				_webServiceClientAblageParent.Load(GetSelectedElement(), "treeMove.selected");
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
					_webServiceClientAblageParent.LoadAll("treeMove.selected");
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
					_webServiceClientAblageParent.LoadAll("treeMove.loaded");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientAblageParent.Load(node.original, "treeMove.loaded");
					}
					else
					{
						_webServiceClientAblageParent.Load(node.original.original, "treeMove.loaded");
					}
					callbackFunction(new Array());
				}
			}
		}
	});
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