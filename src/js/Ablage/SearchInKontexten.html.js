$(document).ready(function() {
	$("#navigation").Navigation();
	$("#breadcrumb").Breadcrumb({
		PageName : "FundSearchInKontext"
	});

	LoadTree();
});

function LoadTree()
{
	$("#tree").on("load_node.jstree", function(event, data)
	{
		if (data.node.id != "#")
		{
			LoadAblagen(data.node);
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
						return "../Dienste/Kontext/Get/";
					}
					
					return "../Dienste/Kontext/GetWithChildren/" + node.id;
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
						nodes[i].state = 
						{
							disabled : true
						};
					}
					
					/*var parentNode = $("#tree").jstree().get_selected()[0];
					
					if (parentNode &&
						parentNode.node.id != "#")
					{
						LoadFunde(parentNode.node);
					}*/
					
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

function LoadAblagen(node)
{	
	$.ajax(
	{
		type:"GET",
		url: "../Dienste/Ablage/Get/Kontext/" + node.id,
		dataType: "JSON",
		success:function(data, textStatus, jqXHR)
		{	
			for (var i = 0; i < data.length; i++)
			{
				var ablageNode = CreateAblageNode(data[i]);
				var foundAblageNode = $("#tree").jstree().get_node(ablageNode);
								
				if (!foundAblageNode)
				{
					$("#tree").jstree().create_node(node, ablageNode);
					$("#tree").jstree().open_node(node);
				}
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			console.log("FEHLER: \"../Dienste/Ablage/Get/Kontext/" + node.id + "\" konnte nicht geladen werden!");
		}
	});
}

function CreateAblageNode(ablage)
{
	ablage.id = ablage.Id;
	
	if (ablage.Typ.Bezeichnung == "Karton")
	{
		ablage.text = ablage.Typ.Bezeichnung + ": " + ablage.FullBezeichnung;
	}	
	else
	{
		ablage.text = ablage.Typ.Bezeichnung + ": " + ablage.Bezeichnung;
	}

	return ablage;
}
