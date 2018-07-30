var _selectedFundAttributType = null;
var _fundAttributTypes = null;

function GetSelectedFundAttributType()
{
    return _selectedFundAttributType;
}

function SetSelectedFundAttributType()
{
    // ToDo
}

function GetFundAttributTypes()
{
    return _fundAttributTypes;
}

function SetFundAttributTypes(fundAttributTypes)
{
    _fundAttributTypes = fundAttributTypes;
}

function LoadFundAttributTypes()
{
	$.ajax(
	{
		type:"GET",
        url:"../Services/FundAttribut/Typ/",
        dataType: "json",
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
            	SetFundAttributTypes(data);
				ShowFundAttributTypes(GetFundAttributTypes());
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

function CreateFundAttributType(fundAttributType)
{
	SaveFundAttributType(fundAttributType);
}

function UpdateFundAttributType(fundAttributType)
{
	SaveFundAttributType(fundAttributType);
}

function SaveFundAttributType(fundAttributType)
{
	var url = "../Services/FundAttribut/Typ/";

	if (fundAttributType.Id != null &&
		fundAttributType.Id != -1)
	{
		url += fundAttributType.Id;
	}

	$.ajax(
	{
		type:"POST",
        url:url,
		dataType: "json",
		data: fundAttributType,
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
			
			LoadFundAttributTypes();
		}
	});
}

function DeleteFundAttributType(fundAttributType)
{
	$.ajax(
	{
		type:"DELETE",
        url:"../Services/FundAttribut/Typ/" + fundAttributType.Id,
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

			LoadFundAttributTypes();
		}
	});
}