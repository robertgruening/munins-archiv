var _ablage = null;

function IsAblageSet()
{
	return (_ablage != null);
}

function GetValueForNoSelection()
{
	return -1;
}

function OpenPageNewAblage()
{
	window.open("Explorer.html", "_self");
}

function OpenPageNewFund()
{
	window.open("../Fund/Form.html?Ablage_Id=" + _ablage.Id, "_blank");
}

function LoadAblageById(id)
{
	if (id == undefined ||
		id == null)
	{
		ClearFields();
		return;
	}
	
	$.ajax(
	{
		type:"GET",
        url:"../Services/Ablage/" + id,
        dataType: "JSON",
		success:function(data, textStatus, jqXHR)
		{
			_ablage = data;
			SetAblageJSON(_ablage);
			SetShortView(_ablage);
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

function SaveAblage()
{	
	$.ajax(
	{
		type:"POST",
		url:"../Services/Ablage",
        dataType: "JSON",
		data: {
			"Ablage" : JSON.stringify(GetAblageJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			LoadAblageById(data.Id);
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

function DeleteAblage()
{
	$.ajax(
	{
		type:"DELETE",
		url:"../Services/Ablage/" + _ablage.Id,
        dataType: "JSON",
		success:function(data, textStatus, jqXHR)
		{
			OpenPageNewAblage();
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

function GetAblageJSON()
{
	var ablage = {
		"Id" : _ablage.Id,
		"Bezeichnung" : GetAblageBezeichnung(),
		"Type" : {
			"Id" : GetAblageTypeId()
		},
		"Parent" : _ablage.Parent
	};
	
	return ablage;
}

function SetAblageJSON(ablage)
{
	if (ablage == undefined ||
		ablage == null)
	{
		SetAblageBezeichnung();
		SetAblageType();
		SetAblagePath();
		SetAblageParent();

		LoadListChildren();
		LoadListFunde();

		SetFormTitle("Ablage");
	}
	else
	{
		SetAblageBezeichnung(ablage.Bezeichnung);
		SetAblageType(ablage.Type.Bezeichnung);
		SetAblagePath(ablage.Path);
		SetAblageParent(ablage.Parent);
		
		LoadListChildren(ablage.Children);
		LoadListFunde(ablage.Funde);
			
		SetFormTitle("("+ablage.Id+") "+ablage.Type.Bezeichnung+": "+ablage.Bezeichnung);
	}
}

function LoadSelectionType()
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
				FillSelectionAblageType(data);
				SetAblageType();
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