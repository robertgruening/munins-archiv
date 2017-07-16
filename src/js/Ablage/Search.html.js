$(document).ready(function() {
	$("#navigation").Navigation();
	$("#breadcrumb").Breadcrumb({
		PageName : "AblageSearch"
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
						return "../Dienste/Ablage/Get/";
					}
					
					return "../Dienste/Ablage/GetWithChildren/" + node.id;
				},
				"dataType": "JSON",
				"success" : function(data, textStatus, jqXHR)
				{
					var nodes = data;
					
					for (var i = 0; i < nodes.length; i++)
					{
						nodes[i].id = nodes[i].Id;
						nodes[i].text = nodes[i].Typ.Bezeichnung + ": " + nodes[i].Bezeichnung;
						nodes[i].icon = "../images/system/Icon" + nodes[i].Typ.Bezeichnung.replace(" ", "_") + ".png";
						nodes[i].children = true;
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
