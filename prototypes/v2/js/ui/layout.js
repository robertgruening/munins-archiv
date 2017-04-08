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
		$("#divButtons").outerHeight() 
	);
	
	$(".topNavigationSubMenu").css("top", 
		$(".topNavigation").css("top") + 
		$(".topNavigation").height()
	);
		
	$("#divButtons").width(
		$("#divRight").width() -
		15 -
		15
	);
	
	$(document).tooltip();
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
