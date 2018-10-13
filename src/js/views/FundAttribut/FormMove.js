$(document).ready(function() {
    _webServiceClientFundAttributParent.Register("loadAll", new GuiClient(FillTreeMoveWithRootFundAttribute));
    _webServiceClientFundAttributParent.Register("load", new GuiClient(FillTreeMoveWithFundAttributChildren));
    _webServiceClientFundAttributParent.Register("load", new GuiClient(SetSelectedParentElement));

	InitTreeMove();
});   

function InitTreeMove()
{
	$("#treeMove")
	.on("open_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractFundAttributNode().id)
		{
			$("#treeMove").jstree(true).set_icon(data.node.id, GetIcon("Root", "open"));
		}
		else
		{
			$("#treeMove").jstree(true).set_icon(data.node.id, GetIcon("FundAttribut", "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractFundAttributNode().id)
		{
			$("#treeMove").jstree(true).set_icon(data.node.id, GetIcon("Root"));
		}
		else
		{
			$("#treeMove").jstree(true).set_icon(data.node.id, GetIcon("FundAttribut"));
		}
	})
	.on("select_node.jstree", function(event, data) {

		if ($("#treeMove").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id != undefined &&
				data.node.original.id == GetAbstractFundAttributNode().id)
			{
				SetSelectedParentElement(GetAbstractFundAttributNode());
				_webServiceClientFundAttributParent.LoadAll("treeMove.selected");
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

				_webServiceClientFundAttributParent.Load(GetSelectedElement(), "treeMove.selected");
			}
		}
		else
		{
			$("#treeMove").jstree(true).load_node(data.node, function() {
				var loadedSelectedNode = $("#treeMove").jstree(true).get_node(data.node);

				if (data.node.original.id != undefined &&
					data.node.original.id == GetAbstractFundAttributNode().id)
				{
					SetSelectedParentElement(GetAbstractFundAttributNode());
					_webServiceClientFundAttributParent.LoadAll("treeMove.selected");
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
		$("#treeMove").jstree(true).open_node(GetAbstractFundAttributNode().id, function() {
			$("#treeMove").jstree(true).select_node(GetAbstractFundAttributNode().id);
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
					callbackFunction(new Array(CreateAbstractFundAttributNode()));
				}
				else if (node.id == GetAbstractFundAttributNode().id)
				{
					_webServiceClientFundAttributParent.LoadAll("treeMove.loaded");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientFundAttributParent.Load(node.original, "treeMove.loaded");
					}
					else
					{
						_webServiceClientFundAttributParent.Load(node.original.original, "treeMove.loaded");
					}
					callbackFunction(new Array());
				}
			}
		}
	});
}

function FillTreeMoveWithRootFundAttribute(rootFundAttribute, sender)
{
	if (sender == undefined ||
		sender != "treeMove.loaded")
	{
		return;
	}

	var selectedElement = GetSelectedElement();

	var children = $("#treeMove").jstree(true).get_node(GetAbstractFundAttributNode().id).children;
	$("#treeMove").jstree(true).delete_node(children);

	for (var i = 0; i < rootFundAttribute.length; i++)
	{
		if (selectedElement != null &&
			selectedElement.Id == rootFundAttribute[i].Id)
		{
			continue;
		}

		var FundAttributeode = CreateFundAttributNode(rootFundAttribute[i]);
		FundAttributeode.parent = GetAbstractFundAttributNode().id;
		$("#treeMove").jstree(true).create_node(FundAttributeode.parent, FundAttributeode, "last");
	}
	
	$("#treeMove").jstree(true).open_node(GetAbstractFundAttributNode().id);
}

function FillTreeMoveWithFundAttributChildren(fundAttribut, sender)
{
	if (sender == undefined ||
		sender != "treeMove.loaded")
	{
		return;
	}
	
	var selectedElement = GetSelectedElement();

	var node = $("#treeMove").jstree(true).get_node(fundAttribut.Id);
	$("#treeMove").jstree(true).delete_node(node.children);
	node.original = fundAttribut;

	for (var i = 0; i < fundAttribut.Children.length; i++)
	{
		if (selectedElement != null &&
			selectedElement.Id == fundAttribut.Children[i].Id)
		{
			continue;
		}

		var FundAttributeode = CreateFundAttributNode(fundAttribut.Children[i]);
		FundAttributeode.parent = fundAttribut.Id;
		
		$("#treeMove").jstree(true).create_node(FundAttributeode.parent, FundAttributeode, "last");
	}

	$("#treeMove").jstree(true).open_node(fundAttribut.Id);
}