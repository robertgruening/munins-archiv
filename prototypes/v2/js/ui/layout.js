$(function() {
	var splitter = $("#divContent").split({
		orientation: "vertical",
		limit: 10,
		position: "30%",
		onDrag: function(event) {
			console.log(splitter.position());
		}
	});
	
	$("#divContent").height(
		$("body").height() - 
		$(".topNavigation").outerHeight() -
		$("#divBreadcrumb").outerHeight()
	);
		
	$("#divForm").height(
		$("#divRight").height() -
		$("#divFormButtons").outerHeight() 
	);
	
	$(".topNavigationSubMenu").css("top", 
		$(".topNavigation").css("top") + 
		$(".topNavigation").height()
	);
		
	$("#divFormButtons").width(
		$("#divRight").width() -
		15 -
		15
	);
			
	$("#divLeftContent").tabs();
	
	$(document).tooltip();
	
	var listeKontext = [
	"25",
	"25/I",
	"25/I/1",
	"25/I/2",
	"25/I/3",
	"25/II",
	"25/II/1",
	"25/III",
	"25/III/1"
	];
	
	var listeAblage = [
	"Archiv",
	"Archiv/1",
	"Archiv/1/1",
	"Archiv/1/2",
	"Archiv/1/3",
	"Archiv/1/3/25-I-1-1",
	"Archiv/1/3/25-III-1-1"
	];
	
	var listeMaterial = [
	"Glas",
	"Knochen",
	"Lehm",
	"Metall",
	"Metall/Bronze",
	"Metall/Buntmetall",
	"Metall/Kupfer",
	"Metall/Eisen",
	"Stein",
	"Stein/Silex",
	"Stein/Silex/Plattensilex",
	"Ton",
	"Ton/Graphitton"
	];
	
	var listeGegenstand = [
	"Gefäß",
	"Waffe",
	"Waffe/Pfeil",
	"Werkzeug",
	"Werkzeug/Bohrer",
	"Werkzeug/Schaber"
	];
	
	var listeErhaltung = [
	"Fragment",
	"Fragment/Boden",
	"Fragment/Henkel",
	"Fragment/Rand",
	"Fragment/Wand",
	"Rohling"
	];
	
	
    $(".feld[name=Kontext] input[type=text]").autocomplete({
      source: listeKontext
    });	
    $(".feld[name=Ablage] input[type=text]").autocomplete({
      source: listeAblage
    });
    $(".feld[name=Material] input[type=text]").autocomplete({
      source: listeMaterial
    });
    $(".feld[name=Gegenstand] input[type=text]").autocomplete({
      source: listeGegenstand
    });
    $(".feld[name=Erhaltung] input[type=text]").autocomplete({
      source: listeErhaltung
    });
    	
	$("#divTree div").jstree(
	{
		"core" : {
			"data" : [
				{
					"text" : "Raum: Archiv",
					"state" : {
						"opened" : true,
						"disabled" : true
					},
					"children" : [
						{ 
							"text" : "Regal: 1",
							"state" : {
								"opened" : true,
								"disabled" : true
							},
							"children" : [
								{
									"text" : "Regalbrett: 1",
									"state" : {
										"opened" : true,
										"disabled" : true
									},
									"children" : [
										{
											"text" : "Karton: 1-I-1-1",
											"state" : {
												"opened" : true,
												"disabled" : true
											},
											"children" : [
												{
													"text" : ">5x Ton, Gefäß, Rand",
													"state" : {												
														"selected" : true
													}
												}
											]
										}
									]
								}
							]
						},
						{ 
							"text" : "Regal: 2",
							"state" : {
								"disabled" : true
							}
						},
						{ 
							"text" : "Regal: 3",
							"state" : {
								"disabled" : true
							}
						},
						{ 
							"text" : "Regal: 4",
							"state" : {
								"disabled" : true
							}
						},
						{ 
							"text" : "Regal: 5",
							"state" : {
								"disabled" : true
							}
						}
					]
				}
			]
		}
	});		
});

function ShowSubMenu(id) 
{
	var isHidden = $("#"+id).css("display") == "none";
	$("nav").hide();
	
	if (isHidden)	
	{
		$("#"+id).show();
	}
}

function HideSubMenu(id) 
{
	$("#"+id).hide();
}
