$(function() {
	$("#divTree").jstree(
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
									}
								},
								{
									"text" : "Regalbrett: 2",
									"state" : {
										"opened" : true,
										"disabled" : true
									}
								},
								{
									"text" : "Regalbrett: 3",
									"state" : {
										"opened" : true,
										"disabled" : true
									},
									"children" : [
										{
											"text" : "Karton: 25-I-1-1",
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
