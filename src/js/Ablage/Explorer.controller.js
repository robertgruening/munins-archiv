function DeleteAblage(ablage)
{
	$.ajax(
	{
		type:"DELETE",
        url:"../Services/Ablage/" + ablage.Id,
        dataType: "json",
		success:function(data, textStatus, jqXHR)
		{
			LoadAblagen();
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			if (jqXHR.status == 500)
			{
				ShowMessages(jqXHR.responseJSON);
			}
			else
			{
				console.log("ERROR: " + jqXHR.responseJSON);
			}
		}
	});
}