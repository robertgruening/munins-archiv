$(function() {
	$("#divTree").jstree(
	{
		"core" : {
			"data" : [
			{ 
				"text" : "Fundstelle: 23",
				"state" : {
					"disabled" : true
				}
			},
			{ 
				"text" : "Fundstelle: 24",
				"state" : {
					"disabled" : true
				}
			},
			{ 
				"text" : "Fundstelle: 25",
				"state" : {
					"opened" : true,
					"disabled" : true
				},
				"children" : [
					{
						"text" : "Begehunsfläche: I",
						"state" : {
							"opened" : true,
							"disabled" : true
						},
						"children" : [
							{
								"text" : "Begehung: 1",
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
				"text" : "Fundstelle: 26",
				"state" : {
					"disabled" : true
				}
			},
			{ 
				"text" : "Fundstelle: 27",
				"state" : {
					"disabled" : true
				}
			},
			{ 
				"text" : "Fundstelle: 28",
				"state" : {
					"disabled" : true
				}
			},
			{ 
				"text" : "Fundstelle: 29",
				"state" : {
					"disabled" : true
				}
			}
		]
		}
	});
});
