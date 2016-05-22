$(document).ready(function() {
	LoadCounts();
	/*LoadKontexte();
	LoadAblagen();
	LoadCounts();
	*/
	/*
	$("#divAblagenX").MultiDropdown(
	{
		UrlGetParents : "Dienste/GetAblageMitParents.php",
		UrlGetChildren : "Dienste/GetAblageChildren.php",
		SelectedElementId : 2,
		SetOptionText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		SetSelectedElementId : function(elementId)
		{
			//$("#textboxAblageId").val(elementId);
			alert(elementId);
		}
	});
	*/
});

function LoadKontexte()
{	
	$("#divKontextTree").remove();
	$("#divKontexte").append("<div id=divKontextTree></div>");
		
	$.ajax(
	{
		type:"POST",
		url:"Dienste/GetKontext.php",
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
				var kontexte = $.parseJSON(data);
				var treeKontext =  new TreeKontext(kontexte);
				
				$("#divKontextTree").jstree({
					"core" : {
						"themes" : {
							"variant" : "large"
						},
							"data" : treeKontext.Transformiere()
					}
				});
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});
}

function LoadAblagen()
{	
	$("#divAblagenTree").remove();
	$("#divAblagen").append("<div id=divAblagenTree></div>");
	
	$.ajax(
	{
		type:"POST",
		url:"Dienste/GetAblage.php",
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
				var ablagen = $.parseJSON(data);
				var treeAblage =  new TreeAblage(ablagen);
					
				$("#divAblagenTree").jstree({
					"core" : {
						"themes" : {
							"variant" : "large"
						},
							"data" : treeAblage.Transformiere()
					}
				});
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});
}

function LoadCounts()
{
	LoadCount("Ablage");
	LoadCount("Kontext");
	LoadCount("Fund");
}

function LoadCount(typ)
{	
	$.ajax(
	{
		type:"POST",
		url:"Dienste/Count.php",
		data:{
			Typ : typ
		},
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
				$("#labelCount"+typ).text(data);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});
}
