$(document).ready(function() {
    _webServiceClientOrtParent.Register("loadAll", new GuiClient(FillTreeMoveWithRootOrte));
    _webServiceClientOrtParent.Register("load", new GuiClient(FillTreeMoveWithOrtChildren));
    _webServiceClientOrtParent.Register("load", new GuiClient(SetSelectedParentElement));

	InitTreeMove();
});   

function InitTreeMove()
{
	$("#treeMove")
	.on("open_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractOrtNode().id)
		{
			$("#treeMove").jstree(true).set_icon(data.node.id, GetIcon("Root", "open"));
		}
		else
		{
			$("#treeMove").jstree(true).set_icon(data.node.id, GetIcon("Ort", "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractOrtNode().id)
		{
			$("#treeMove").jstree(true).set_icon(data.node.id, GetIcon("Root"));
		}
		else
		{
			$("#treeMove").jstree(true).set_icon(data.node.id, GetIcon("Ort"));
		}
	})
	.on("select_node.jstree", function(event, data) {

		if ($("#treeMove").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id != undefined &&
				data.node.original.id == GetAbstractOrtNode().id)
			{
				SetSelectedParentElement(GetAbstractOrtNode());
				_webServiceClientOrtParent.LoadAll("treeMove.selected");
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

				_webServiceClientOrtParent.Load(GetSelectedElement(), "treeMove.selected");
			}
		}
		else
		{
			$("#treeMove").jstree(true).load_node(data.node, function() {
				var loadedSelectedNode = $("#treeMove").jstree(true).get_node(data.node);

				if (data.node.original.id != undefined &&
					data.node.original.id == GetAbstractOrtNode().id)
				{
					SetSelectedParentElement(GetAbstractOrtNode());
					_webServiceClientOrtParent.LoadAll("treeMove.selected");
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
		$("#treeMove").jstree(true).open_node(GetAbstractOrtNode().id, function() {
			$("#treeMove").jstree(true).select_node(GetAbstractOrtNode().id);
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
					callbackFunction(new Array(CreateAbstractOrtNode()));
				}
				else if (node.id == GetAbstractOrtNode().id)
				{
					_webServiceClientOrtParent.LoadAll("treeMove.loaded");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientOrtParent.Load(node.original, "treeMove.loaded");
					}
					else
					{
						_webServiceClientOrtParent.Load(node.original.original, "treeMove.loaded");
					}
					callbackFunction(new Array());
				}
			}
		}
	});
}

function FillTreeMoveWithRootOrte(rootOrte, sender)
{
	if (sender == undefined ||
		sender != "treeMove.loaded")
	{
		return;
	}

	var selectedElement = GetSelectedElement();

	var children = $("#treeMove").jstree(true).get_node(GetAbstractOrtNode().id).children;
	$("#treeMove").jstree(true).delete_node(children);

	for (var i = 0; i < rootOrte.length; i++)
	{
		if (selectedElement != null &&
			selectedElement.Id == rootOrte[i].Id)
		{
			continue;
		}

		var OrtNode = CreateOrtNode(rootOrte[i]);
		OrtNode.parent = GetAbstractOrtNode().id;
		$("#treeMove").jstree(true).create_node(OrtNode.parent, OrtNode, "last");
	}
	
	$("#treeMove").jstree(true).open_node(GetAbstractOrtNode().id);
}

function FillTreeMoveWithOrtChildren(ort, sender)
{
	if (sender == undefined ||
		sender != "treeMove.loaded")
	{
		return;
	}
	
	var selectedElement = GetSelectedElement();

	var node = $("#treeMove").jstree(true).get_node(ort.Id);
	$("#treeMove").jstree(true).delete_node(node.children);
	node.original = ort;

	for (var i = 0; i < ort.Children.length; i++)
	{
		if (selectedElement != null &&
			selectedElement.Id == ort.Children[i].Id)
		{
			continue;
		}

		var OrtNode = CreateOrtNode(ort.Children[i]);
		OrtNode.parent = ort.Id;
		
		$("#treeMove").jstree(true).create_node(OrtNode.parent, OrtNode, "last");
	}

	$("#treeMove").jstree(true).open_node(ort.Id);
}