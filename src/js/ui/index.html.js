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

function LoadCount(typ)
{	
	$.ajax(
	{
		type:"POST",
		url:"Dienste/" + typ + "/Count",
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
