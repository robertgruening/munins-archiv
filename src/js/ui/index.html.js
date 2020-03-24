$(document).ready(function() {
	LoadCounts();
});

function LoadCounts()
{
	LoadCount("Ablage");
	LoadCount("Fund");
	LoadCount("FundAttribut");
	LoadCount("Kontext");
	LoadCount("Ort");
}

function LoadCount(type)
{	
	$.ajax(
	{
		type:"POST",
		url:"Dienste/" + type + "/Count",
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
				$("#labelCount"+type).text(data);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});
}
