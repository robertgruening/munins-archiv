$(document).ready(function() {
	$("#navigation").Navigation();
	$("#breadcrumb").Breadcrumb({
		PageName : "KontextSearchInOrt"
	});

	LoadTree();
});

function LoadTree()
{
	$("#tree").on("load_node.jstree", function(event, data)
	{
		if (data.node.id != "#")
		{
			LoadKontexte(data.node);
		}
	}).jstree({
		"plugins" : ["contextmenu"],
		"core" : 
		{
			"check_callback" : true,
			"data" : 
			{
				"url" : function (node)
				{
					if (node.id === "#")
					{
						return "../Dienste/Ort/Get/";
					}
					
					return "../Dienste/Ort/GetWithChildren/" + node.id;
				},
				"dataType": "JSON",
				"success" : function(data, textStatus, jqXHR)
				{
					var nodes = data;
					
					for (var i = 0; i < nodes.length; i++)
					{
						nodes[i].id = nodes[i].Id;
						nodes[i].text = nodes[i].Typ.Bezeichnung + ": " + nodes[i].Bezeichnung;
						nodes[i].children = true;
						nodes[i].state = 
						{
							disabled : true
						};
					}
					
					return nodes;
				}
			}
		},
		"contextmenu" :
		{
			"items" : function(node)
			{
				var items = 
				{
					"openInFormular" : 
					{
						"label" : "in Formular öffnen",
						"action" : function(node)
						{
							var node = $("#tree").jstree().get_node(node.reference);
							window.location.href = "Formular.html?Id=" + node.original.Id;
						}
					}
				};
				
				return items;
			}
		}
	});
}

function LoadKontexte(node)
{	
	$.ajax(
	{
		type:"GET",
		url: "../Dienste/Kontext/Get/Ort/" + node.id,
		dataType: "JSON",
		success:function(data, textStatus, jqXHR)
		{	
			for (var i = 0; i < data.length; i++)
			{
				var kontextNode = CreateKontextNode(data[i]);
				var foundKontextNode = $("#tree").jstree().get_node(kontextNode);
								
				if (!foundKontextNode)
				{
					$("#tree").jstree().create_node(node, kontextNode);
					$("#tree").jstree().open_node(node);
				}
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			console.log("FEHLER: \"../Dienste/Kontext/Get/Ort/" + node.id + "\" konnte nicht geladen werden!");
		}
	});
}

function CreateKontextNode(kontext)
{	
	kontext.id = kontext.Id;
	kontext.text = kontext.FullBezeichnung;

	return kontext;
}
