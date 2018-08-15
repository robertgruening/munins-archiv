$(document).ready(function() {
	_webServiceClientAblageType.Register("loadAll", new GuiClient(InitGrid));
	_webServiceClientAblage.Register("delete", new GuiClient(LoadAblagen));
	_webServiceClientAblage.Register("create", new GuiClient(LoadAblagen));
	_webServiceClientAblage.Register("loadAll", new GuiClient(FillTreeWithRootAblagen));
	_webServiceClientAblage.Register("loadAll", new GuiClient(FillGridWithRootAblagen));
	_webServiceClientAblage.Register("load", new GuiClient(FillTreeWithAblageChildren));
	_webServiceClientAblage.Register("load", new GuiClient(FillGridWithAblageChildren));

    $("#navigation").Navigation();
    
    $("#breadcrumb").Breadcrumb({
        PageName : "AblageExplorer"
	});

    $("#messageBox").dialog({
        autoOpen: false,
        height: "auto",
        modal: true
    });

	jsGrid.fields.icon = IconField;
	
	_webServiceClientAblageType.LoadAll();

	$("#tree")
	.on("open_node.jstree", function(event, data) {

		if (data.node.id != GetAbstractAblageNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, "fas fa-folder-open");
		}
	})
	.on("close_node.jstree", function(event, data) {

		if (data.node.id != GetAbstractAblageNode().id)
		{
			$("#tree").jstree(true).set_icon(data.node.id, "fas fa-folder");
		}
	})
	.on("select_node.jstree", function(event, data) {
		$("#path").val("/");
		$("#grid").empty();

		if (data.node.original.id == GetAbstractAblageNode().id)
		{
			_webServiceClientAblage.LoadAll();
		}
		else
		{
			var node = data.node.original.original;
			$("#path").val("/" + node.Path);
			_webServiceClientAblage.Load(node);
		}
	})
	.on("rename_node.jstree", function(event, data) {

		var node = data.node.original.original;

		var newName = data.text;
		var typePrefix = node.Type.Bezeichnung + ": ";

		if (newName.startsWith(typePrefix))
		{
			node.Bezeichnung = newName.substr(typePrefix.length);
		}
		else
		{
			node.Bezeichnung = newName;
		}

		console.log("Input: ");
		console.log(data);
		console.log("Knoten: ");
		console.log(node);
		//_webServiceClientAblage.Save(node);
	})
	.on("loaded.jstree", function(event, data) {
		_webServiceClientAblage.LoadAll();
	})
    .jstree({
		"plugins": [
			"contextmenu"
		],
        "core": {
			"multiple": false,
			"check_callback" : true,
			"data" : function (node, callbackFunction) 
			{	
				console.log(node);
				if (node.id === "#")
				{
					callbackFunction(new Array(CreateAbstractAblageNode()));
				}
				else
				{
					console.log("core.data.else");
					callbackFunction(new Array());
				}
				/*
				else if (node.id === "-1")
				{
					$.ajax(
					{
						type:"GET",
						url: "../Services/Ablage/",
						dataType: "JSON",
						success:function(data, textStatus, jqXHR)
						{	
							var retval = new Array();

							for (var i = 0; i < data.length; i++)
							{
								var ablageNode = CreateAblageNode(data[i]);
								ablageNode.parent = "-1";

								retval.push(ablageNode);
							}

							callbackFunction(retval);
						},
						error:function(jqXHR, textStatus, errorThrown)
						{
							if (jqXHR.status == 500)
							{
								ShowMessages(jqXHR.responseJSON);
							}
							else
							{
								console.log("ERROR: " + jqXHR.responseJSON);
							}
						}
					});
				}
				else
				{
					$.ajax(
					{
						type:"GET",
						url: "../Services/Ablage/" + node.id,
						dataType: "JSON",
						success:function(data, textStatus, jqXHR)
						{
							var retval = new Array();

							for (var i = 0; i < data.Children.length; i++)
							{
								var ablageNode = CreateAblageNode(data.Children[i]);
								ablageNode.parent = data.Id;

								retval.push(ablageNode);
							}

							callbackFunction(retval);
						},
						error:function(jqXHR, textStatus, errorThrown)
						{
							if (jqXHR.status == 500)
							{
								ShowMessages(jqXHR.responseJSON);
							}
							else
							{
								console.log("ERROR: " + jqXHR.responseJSON);
							}
						}
					});
				}*/
			}
		},
		"contextmenu": {
			"items": function($node) {
				return {
					"Edit": {
						"label": "Beabeiten",
						"title": "Beabeiten",
						"action": function(obj) {
							OpenAblageFormular($node);
						}
					},
					"Rename": {
						"label": "Umbenennen",
						"title": "Umbenennen",
						"action": function (obj) { 
							$("#tree").jstree(true).edit($node);
						}
					}
				};
			}
		}
    });
});

function FillTreeWithRootAblagen(rootAblagen)
{
	console.log("FillTreeWithRootAblagen");

	for (var i = 0; i < rootAblagen.length; i++)
	{
		var ablageNode = CreateAblageNode(rootAblagen[i]);
		ablageNode.parent = "-1";
		
		$("#tree").jstree(true).create_node(ablageNode.parent, ablageNode, "last", function(){
			$("#tree").jstree(true).get_node(ablageNode.parent).state.loaded = true;
			console.log($("#tree").jstree(true).get_node(ablageNode.parent));
		}, true);
	}
}

function FillTreeWithAblageChildren(ablage)
{
	console.log("FillTreeWithAblageChildren");

	for (var i = 0; i < ablage.Children.length; i++)
	{
		var ablageNode = CreateAblageNode(ablage.Children[i]);
		ablageNode.parent = ablage.Id;
		
		$("#tree").jstree(true).create_node(ablageNode.parent, ablageNode, "last", function(){
			$("#tree").jstree(true).get_node(ablageNode.parent).state.loaded = true;
			console.log($("#tree").jstree(true).get_node(ablageNode.parent));
		}, true);
	}
}

function InitGrid(ablageTypes)
{
	$("#grid").jsGrid({
        width: "70%",

        inserting: true,
        editing: true,
        sorting: true,
        paging: false,
		autoload: false,
		
		controller: {
			insertItem: function(item) { 
				_webServiceClientAblage.Create(ConvertToJson(item));
			},
			updateItem: function(item) {
				_webServiceClientAblage.Save(ConvertToJson(item));
			},
			deleteItem: function(item) {
				_webServiceClientAblage.Delete(item);
			}
		},
		
		fields: [
			{ 
				title: "",
				name: "Icon", 
				type: "icon"
			},
			{ 
				name: "Bezeichnung", 
				type: "text", 
				validate: "required"
			},
			{ 
				title: "Typ",
				name: "Type.Id",
				type: "select",
				items: ablageTypes,
				valueField: "Id",
				textField: "Bezeichnung",
				valueType: "number",
				align: "left"
			},
			{ 
				type: "control"
			}
		],

		rowDoubleClick: function(data) {
			$("#tree").jstree(true).deselect_all();

			var selectedNode = $("#tree").jstree(true).get_node(data.item.Id);

			if (selectedNode == undefined)
			{
				return;
			}

			if (data.item.Bezeichnung === "..")
			{
				$("#tree").jstree(true).select_node(selectedNode.parent);
			}
			else
			{
				$("#tree").jstree(true).open_node(data.item.Id);
				$("#tree").jstree(true).select_node(data.item.Id);
			}
		}
	});
}

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
	node.icon = "fas fa-hdd";
	node.state = new Object();
	node.state.opened = false;

	return node;
}

function CreateAblageNode(ablage)
{
	var node = new Object();
	node.id = ablage.Id;
	node.text = ablage.Type.Bezeichnung + ": " + ablage.Bezeichnung;
	node.original = ablage;
	node.children = true;
	node.icon = "fas fa-folder";

	return node;
}

var IconField = function(config) {
	jsGrid.Field.call(this, config);
}

IconField.prototype = new jsGrid.Field({
	itemTemplate: function(value) {
		return $("<i>").addClass(value);
	}
});

function LoadAblagen()
{
	var selectedNodeId = $("#tree").jstree(true).get_selected();
	$("#tree").jstree(true).deselect_all();
	$("#tree").jstree(true).select_node(selectedNodeId);
}

function ShowMessages(messages)
{
    $("#messageBox").empty();
    $("#messageBox").append(messages);
    $("#messageBox").dialog("open");
}

function ConvertToJson(item)
{
	item.Parent = new Object();
	item.Parent.Id = $("#tree").jstree(true).get_selected()[0];

	return item;
}

function FillGridWithRootAblagen(ablagen)
{
	for (var i = 0; i < ablagen.length; i++)
	{
		ablagen[i].Icon = "fas fa-folder";
	}

	$("#grid").jsGrid({
		data: ablagen
	});
}

function FillGridWithAblageChildren(ablage)
{
	for (var i = 0; i < ablage.Children.length; i++)
	{
		ablage.Children[i].Icon = "fas fa-folder";
	}

	ablage.Children.unshift({
		"Id": ablage.Id,
		"Icon": "fas fa-folder-open",
		"Bezeichnung": "..", 
		"Type": ""
	});

	$("#grid").jsGrid({
		data: ablage.Children
	});
}