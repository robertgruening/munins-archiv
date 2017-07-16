$(document).ready(function() {
	$("#navigation").Navigation();
	$("#breadcrumb").Breadcrumb({
		PageName : "OrtSearch"
	});

	LoadTree();
});

function LoadTree()
{
	$("#tree").jstree({
		"plugins" : ["contextmenu"],
		"core" : 
		{
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
						nodes[i].icon = false;
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
