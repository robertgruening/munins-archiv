var _selectedOrtType = null;
var _ortTypes = null;

function GetSelectedOrtType()
{
    return _selectedOrtType;
}

function SetSelectedOrtType()
{
    // ToDo
}

function GetOrtTypes()
{
    return _ortTypes;
}

function SetOrtTypes(ortTypes)
{
    _ortTypes = ortTypes;
}

function LoadOrtTypes()
{
	$.ajax(
	{
		type:"GET",
        url:"../Services/Ort/Typ/",
        dataType: "json",
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
            	SetOrtTypes(data);
				ShowOrtTypes(GetOrtTypes());
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

function CreateOrtType(ortType)
{
	SaveOrtType(ortType);
}

function UpdateOrtType(ortType)
{
	SaveOrtType(ortType);
}

function SaveOrtType(ortType)
{
	var url = "../Services/Ort/Typ/";

	if (ortType.Id != null &&
		ortType.Id != -1)
	{
		url += ortType.Id;
	}

	$.ajax(
	{
		type:"POST",
        url:url,
		dataType: "json",
		data: ortType,
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
			
			LoadOrtTypes();
		}
	});
}

function DeleteOrtType(ortType)
{
	$.ajax(
	{
		type:"DELETE",
        url:"../Services/Ort/Typ/" + ortType.Id,
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

			LoadOrtTypes();
		}
	});
}