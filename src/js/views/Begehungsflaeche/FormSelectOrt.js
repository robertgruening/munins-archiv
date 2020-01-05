$(document).ready(function() {
    _webServiceClientOrt.Register("loadAll", new GuiClient(FillTreeSelectWithRootOrte));
    _webServiceClientOrt.Register("load", new GuiClient(FillTreeSelectWithOrtChildren));
    _webServiceClientOrt.Register("load", new GuiClient(GetSelectedOrt));

	InitTreeSelectOrt();
});

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
	node.icon = IconConfig.getCssClasses("Root");
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
	node.icon = IconConfig.getCssClasses("Ort");
	node.BaseType = "Ort";

	return node;
}

function InitTreeSelectOrt()
{
	$("#treeSelectOrt")
	.on("open_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractOrtNode().id)
		{
			$("#treeSelectOrt").jstree(true).set_icon(data.node.id, IconConfig.getCssClasses("Root", "open"));
		}
		else
		{
			$("#treeSelectOrt").jstree(true).set_icon(data.node.id, IconConfig.getCssClasses("Ort", "open"));
		}
	})
	.on("close_node.jstree", function(event, data) {
		if (data.node.id == GetAbstractOrtNode().id)
		{
			$("#treeSelectOrt").jstree(true).set_icon(data.node.id, IconConfig.getCssClasses("Root"));
		}
		else
		{
			$("#treeSelectOrt").jstree(true).set_icon(data.node.id, IconConfig.getCssClasses("Ort"));
		}
	})
	.on("select_node.jstree", function(event, data) {

		if ($("#treeSelectOrt").jstree(true).is_loaded(data.node))
		{
			if (data.node.original.id != undefined &&
				data.node.original.id == GetAbstractOrtNode().id)
			{
				SetSelectedOrt(null);
				_webServiceClientOrt.LoadAll("treeSelect.selected");
			}
			else
			{
				if (data.node.original.original == undefined)
				{
					SetSelectedOrt(data.node.original);
				}
				else
				{
					SetSelectedOrt(data.node.original.original);
				}

				_webServiceClientOrt.Load(GetSelectedOrt(), "treeSelect.selected");
			}
		}
		else
		{
			$("#treeSelectOrt").jstree(true).load_node(data.node, function() {
				var loadedSelectedNode = $("#treeSelectOrt").jstree(true).get_node(data.node);

				if (data.node.original.id != undefined &&
					data.node.original.id == GetAbstractOrtNode().id)
				{
					SetSelectedOrt(null);
					_webServiceClientOrt.LoadAll("treeSelect.selected");
				}
				else
				{
					if (loadedSelectedNode.original.original == undefined)
					{
						SetSelectedOrt(loadedSelectedNode.original);
					}
					else
					{
						SetSelectedOrt(loadedSelectedNode.original.original);
					}
				}
			});
		}
	})
	.on("loaded.jstree", function(event, data) {
		$("#treeSelectOrt").jstree(true).open_node(GetAbstractOrtNode().id, function() {
			$("#treeSelectOrt").jstree(true).select_node(GetAbstractOrtNode().id);
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
					_webServiceClientOrt.LoadAll("treeSelect.loaded");
					callbackFunction(new Array());
				}
				else
				{
					if (node.original.original == undefined)
					{
						_webServiceClientOrt.Load(node.original, "treeSelect.loaded");
					}
					else
					{
						_webServiceClientOrt.Load(node.original.original, "treeSelect.loaded");
					}
					callbackFunction(new Array());
				}
			}
		}
	});
}

function FillTreeSelectWithRootOrte(rootOrte, sender)
{
	if (sender == undefined ||
		sender != "treeSelect.loaded")
	{
		return;
	}

	var children = $("#treeSelectOrt").jstree(true).get_node(GetAbstractOrtNode().id).children;
	$("#treeSelectOrt").jstree(true).delete_node(children);

	for (var i = 0; i < rootOrte.length; i++)
	{
		var ortNode = CreateOrtNode(rootOrte[i]);
		ortNode.parent = GetAbstractOrtNode().id;
		$("#treeSelectOrt").jstree(true).create_node(ortNode.parent, ortNode, "last");
	}
	
	$("#treeSelectOrt").jstree(true).open_node(GetAbstractOrtNode().id);
}

function FillTreeSelectWithOrtChildren(ort, sender)
{
	if (sender == undefined ||
		sender != "treeSelect.loaded")
	{
		return;
	}

	var node = $("#treeSelectOrt").jstree(true).get_node(ort.Id);
	$("#treeSelectOrt").jstree(true).delete_node(node.children);
	node.original = ort;

	for (var i = 0; i < ort.Children.length; i++)
	{
		var ortNode = CreateOrtNode(ort.Children[i]);
		ortNode.parent = ort.Id;
		
		$("#treeSelectOrt").jstree(true).create_node(ortNode.parent, ortNode, "last");
	}

	$("#treeSelectOrt").jstree(true).open_node(ort.Id);
}