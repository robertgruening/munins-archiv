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
	window.open("Form.html", "_self");
}

function OpenPageNewAblageChild()
{
	window.open("Form.html?Parent_Id=" + _ablage.Id, "_blank");
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
        url:"../Services/Ablage/Get/" + id,
        dataType: "json",
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
            	_ablage = data;
				SetAblageJSON(_ablage);
				SetShortView(_ablage);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function SaveAblage()
{	
	$.ajax(
	{
		type:"POST",
		url:"../Services/Ablage/Save",
        dataType: "json",
		data: {
			"Ablage" : JSON.stringify(GetAblageJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			var message = $.parseJSON(data);
			alert(message.Message);
			
			if (message.ElementId)
				LoadAblageById(message.ElementId);
		}
	});
}

function DeleteAblage()
{
	$.ajax(
	{
		type:"GET",
		url:"../Services/Ablage/Delete/" + _ablage.Id,
        dataType: "json",
		success:function(data, textStatus, jqXHR)
		{
			var pattern = /Ablage\s\(\d+\)\sist\sgelöscht\./g;

			if (pattern.test(JSON.stringify(data)))
			{
				OpenPageNewAblage();
			}
			else
			{
				alert(data);
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
		"Parent" : {
			"Id" : GetAblageParentId()
		}
	};
	
	return ablage;
}

function SetAblageJSON(ablage)
{
	if (ablage == undefined ||
		ablage == null)
	{
		SetAblageId();
		SetAblageBezeichnung();
		SetAblageType();
		SetAblagePath();
		SetAblageParentId();

		LoadListParents();
		LoadListChildren();
		LoadListFunde();

		SetFormTitle("Ablage");
	}
	else
	{
		SetAblageId(ablage.Id);
		SetAblageBezeichnung(ablage.Bezeichnung);
		SetAblageType(ablage.Type.Bezeichnung);
		SetAblagePath(ablage.Path);
		
		if (ablage.Parent)
		{
			SetAblageParentId(ablage.Parent.Id);
		}
		else
		{
			SetAblageParentId();
		}

		LoadListParents();
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
		url:"../Services/Ablage/Typ/Get/",
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
			alert("error");
		}
	});	
}