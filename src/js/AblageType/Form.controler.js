var _selectedAblageType = null;
var _ablageTypes = null;

function GetSelectedAblageType()
{
    return _selectedAblageType;
}

function SetSelectedAblageType()
{
    // ToDo
}

function GetAblageTypes()
{
    return _ablageTypes;
}

function SetAblageTypes(ablageTypes)
{
    _ablageTypes = ablageTypes;
}

function LoadAblageTypes()
{
	$.ajax(
	{
		type:"GET",
        url:"../Services/Ablage/Typ/",
        dataType: "json",
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
            	SetAblageTypes(data);
				ShowAblageTypes(GetAblageTypes());
			}
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

function CreateAblageType(ablageType)
{
	SaveAblageType(ablageType);
}

function UpdateAblageType(ablageType)
{
	SaveAblageType(ablageType);
}

function SaveAblageType(ablageType)
{
	var url = "../Services/Ablage/Typ/";

	if (ablageType.Id != null &&
		ablageType.Id != -1)
	{
		url += ablageType.Id;
	}

	$.ajax(
	{
		type:"POST",
        url:url,
		dataType: "json",
		data: ablageType,
		success:function(data, textStatus, jqXHR)
		{
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
			
			LoadAblageTypes();
		}
	});
}

function DeleteAblageType(ablageType)
{
	$.ajax(
	{
		type:"DELETE",
        url:"../Services/Ablage/Typ/" + ablageType.Id,
        dataType: "json",
		success:function(data, textStatus, jqXHR)
		{
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

			LoadAblageTypes();
		}
	});
}