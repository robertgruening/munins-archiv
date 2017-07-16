$(document).ready(function() {
	$("#navigation").Navigation();
	$("#breadcrumb").Breadcrumb({
		PageName : "FundSearchInAblage"
	});

	LoadTree();
});

function LoadTree()
{
	$("#tree").on("load_node.jstree", function(event, data)
	{
		if (data.node.id != "#")
		{
			LoadFunde(data.node);
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

function LoadFunde(node)
{	
	$.ajax(
	{
		type:"GET",
		url: "../Dienste/Fund/Get/Ablage/" + node.id,
		dataType: "JSON",
		success:function(data, textStatus, jqXHR)
		{	
			for (var i = 0; i < data.length; i++)
			{
				var fundNode = CreateFundNode(data[i]);
				var foundFundNode = $("#tree").jstree().get_node(fundNode);
								
				if (!foundFundNode)
				{
					$("#tree").jstree().create_node(node, fundNode);
					$("#tree").jstree().open_node(node);
				}
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			console.log("FEHLER: \"../Dienste/Fund/Get/Ablage/" + node.id + "\" konnte nicht geladen werden!");
		}
	});
}

function CreateFundNode(fund)
{
	var material = GetFundAttribut(fund, "Material");
	var gegenstand = GetFundAttribut(fund, "Gegenstand");
	var erhaltung = GetFundAttribut(fund, "Erhaltung");
	
	fund.id = fund.Id;
	fund.text = (fund.Anzahl < 0 ? ">" + (fund.Anzahl * -1) : fund.Anzahl) + "x " + 
				(material == null ? "" : material.Bezeichnung) + " " +
				(gegenstand == null ? "" : gegenstand.Bezeichnung) + " " +
				(erhaltung == null ? "" : erhaltung.Bezeichnung) + 
				 " : \"" + fund.Bezeichnung + "\"";

	return fund;
}

function GetFundAttribut(fund, attributTyp)
{
	for (var i = 0; i < fund.Attribute.length; i++)
	{
		if (fund.Attribute[i].Typ.Bezeichnung == attributTyp)
		{
			return fund.Attribute[i];
		}
	}
	
	return null;
}