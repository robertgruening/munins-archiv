$(document).ready(function() {
    _webServiceClientFundAttribut.Register("loadAll", new GuiClient(FillTreeSelectWithRootFundAttribute));
    _webServiceClientFundAttribut.Register("load", new GuiClient(FillTreeSelectWithFundAttributChildren));
    _webServiceClientFundAttribut.Register("load", new GuiClient(GetSelectedFundAttribut));

	InitTreeSelectFundAttribut();
});

function GetAbstractFundAttributNode()
{
	return CreateAbstractFundAttributNode();
}

function CreateAbstractFundAttributNode()
{
	var node = new Object();
	node.id = -1;
	node.text = "Fundattribute";
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

function InitTreeSelectFundAttribut()
{
	$("#treeSelectFundAttribut")
	.on("open_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractFundAttributNode().id)
		{
			$("#treeSelectFundAttribut").jstree(true).set_icon(data.node.id, GetIcon("Root", "open"));
		}
		else
		{
			$("#treeSelectFundAttribut").jstree(true).set_icon(data.node.id, GetIcon("FundAttribut", "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractFundAttributNode().id)
		{
			$("#treeSelectFundAttribut").jstree(true).set_icon(data.node.id, GetIcon("Root"));
		}
		else
		{
			$("#treeSelectFundAttribut").jstree(true).set_icon(data.node.id, GetIcon("FundAttribut"));
		}
	})
	.on("select_node.jstree", function(event, data) {

		if ($("#treeSelectFundAttribut").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id != undefined &&
				data.node.original.id == GetAbstractFundAttributNode().id)
			{
				SetSelectedFundAttribut(null);
				_webServiceClientFundAttribut.LoadAll("treeSelect.selected");
			}
			else
			{
				if (data.node.original.original == undefined)
				{
					SetSelectedFundAttribut(data.node.original);
				}
				else
				{
					SetSelectedFundAttribut(data.node.original.original);
				}

				_webServiceClientFundAttribut.Load(GetSelectedFundAttribut(), "treeSelect.selected");
			}
		}
		else
		{
			$("#treeSelectFundAttribut").jstree(true).load_node(data.node, function() {
				var loadedSelectedNode = $("#treeSelectFundAttribut").jstree(true).get_node(data.node);

				if (data.node.original.id != undefined &&
					data.node.original.id == GetAbstractFundAttributNode().id)
				{
					SetSelectedFundAttribut(null);
					_webServiceClientFundAttribut.LoadAll("treeSelect.selected");
				}
				else
				{
					if (loadedSelectedNode.original.original == undefined)
					{
						SetSelectedFundAttribut(loadedSelectedNode.original);
					}
					else
					{
						SetSelectedFundAttribut(loadedSelectedNode.original.original);
					}
				}
			});
		}
	})
	.on("loaded.jstree", function(event, data) {
		$("#treeSelectFundAttribut").jstree(true).open_node(GetAbstractFundAttributNode().id, function() {
			$("#treeSelectFundAttribut").jstree(true).select_node(GetAbstractFundAttributNode().id);
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
					_webServiceClientFundAttribut.LoadAll("treeSelect.loaded");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientFundAttribut.Load(node.original, "treeSelect.loaded");
					}
					else
					{
						_webServiceClientFundAttribut.Load(node.original.original, "treeSelect.loaded");
					}
					callbackFunction(new Array());
				}
			}
		}
	});
}

function FillTreeSelectWithRootFundAttribute(rootFundAttribute, sender)
{
	if (sender == undefined ||
		sender != "treeSelect.loaded")
	{
		return;
	}

	var children = $("#treeSelectFundAttribut").jstree(true).get_node(GetAbstractFundAttributNode().id).children;
	$("#treeSelectFundAttribut").jstree(true).delete_node(children);

	for (var i = 0; i < rootFundAttribute.length; i++)
	{
		var fundAttributNode = CreateFundAttributNode(rootFundAttribute[i]);
		fundAttributNode.parent = GetAbstractFundAttributNode().id;
		$("#treeSelectFundAttribut").jstree(true).create_node(fundAttributNode.parent, fundAttributNode, "last");
	}
	
	$("#treeSelectFundAttribut").jstree(true).open_node(GetAbstractFundAttributNode().id);
}

function FillTreeSelectWithFundAttributChildren(fundAttribut, sender)
{
	if (sender == undefined ||
		sender != "treeSelect.loaded")
	{
		return;
	}

	var node = $("#treeSelectFundAttribut").jstree(true).get_node(fundAttribut.Id);
	$("#treeSelectFundAttribut").jstree(true).delete_node(node.children);
	node.original = fundAttribut;

	for (var i = 0; i < fundAttribut.Children.length; i++)
	{
		var fundAttributNode = CreateFundAttributNode(fundAttribut.Children[i]);
		fundAttributNode.parent = fundAttribut.Id;
		
		$("#treeSelectFundAttribut").jstree(true).create_node(fundAttributNode.parent, fundAttributNode, "last");
	}

	$("#treeSelectFundAttribut").jstree(true).open_node(fundAttribut.Id);
}