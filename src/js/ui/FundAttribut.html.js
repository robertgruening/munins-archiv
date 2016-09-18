var _selectorMultiDropdownParent = "#divParentSelections";
var _selectorTextboxParentId = "#textboxParentId";

$(document).ready(function() {
	$("#textboxId").attr("disabled",true);
	$(_selectorTextboxParentId).attr("disabled",true);
	
	$("#buttonSetParent").click(function() { SetParent(); });
	$("#buttonAddKontext").click(function() { AddKontext(); });
	
	LoadSelectionTyp();
	LoadListRootFundAttribute();	
});

function selectTypen_onChange()
{
	SelectTypId(GetSelectedTypId());
	LoadMultiDropdownParent(null, GetSelectedTypId());
}

function GetSelectedTypId()
{
	return $("#selectTypen option:selected").val();
}

function GetDefaultTypId()
{
	return GetTypIdByTypBezeichnung("Material");
}

function GetTypIdByTypBezeichnung(typName)
{
	return $("#selectTypen option").filter(function () { return $(this).html() == typName; }).val();
}

function SelectTypId(typId)
{
	if (typId == undefined ||
		typId == null)
	{
		typId = GetDefaultTypId();
	}
	
	$("#selectTypen").val(typId);				
	ShowFormFieldBlocksByTyp();
}

function ShowFormFieldBlocksByTyp()
{	
	//$("#divParent").hide();
}

function buttonNeu_onClick()
{
	ClearFields();
}

function ClearFields()
{
	$("#textboxId").val("");
	SelectTypId();
	$("#textboxBezeichnung").val("");
	$(_selectorTextboxParentId).val("");
	setTimeout(LoadListParents(), 1000);
	setTimeout(LoadListChildren(), 1000);
	setTimeout(LoadListFunde(), 1000);
	
	document.title = "Fundattribut";
}

function GetFundAttributJSON()
{
	var fundAttribut = {
		"Id" : $("#textboxId").val(),
		"Bezeichnung" : $("#textboxBezeichnung").val(),
		"Typ_Id" : GetSelectedTypId(),
		"Parent_Id" : $(_selectorTextboxParentId).val() == "" ? null : $(_selectorTextboxParentId).val()
	};
	
	return fundAttribut;
}

function SetFundAttributJSON(fundAttribut)
{
	$("#textboxId").val(fundAttribut.Id);
	$("#textboxBezeichnung").val(fundAttribut.Bezeichnung);
	SelectTypId(fundAttribut.Typ.Id);
	LoadListChildren(fundAttribut.Id);
	LoadListFunde(fundAttribut.Id);
	
	if (fundAttribut.Parent)
		$(_selectorTextboxParentId).val(fundAttribut.Parent.Id);

	LoadListParents();
		
	document.title = "("+fundAttribut.Id+") "+fundAttribut.Typ.Bezeichnung+": "+fundAttribut.Bezeichnung;
}

function buttonSpeichern_onClick()
{	
	SaveFundAttribut();	
}

function SaveFundAttribut()
{
	if ($("#textboxId").val() == GetValueForNoSelection())
	{
		return;
	}
	
	$.ajax(
	{
		type:"POST",
		url:"Dienste/SaveFundAttribut.php",
		data: {
			"FundAttribut" : JSON.stringify(GetFundAttributJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			alert(data);
			LoadListRootFundAttribute();
		}
	});
}

function LoadListParents()
{	
	var data = null;
	
	if ($("#textboxParentId").val() != undefined &&
		$("#textboxParentId").val() != "")
	{	
		data = { 
			Id : $("#textboxParentId").val(), 
			ReturnDataStructure : "list"
		};
	}
		
	$("#divParent #divList").List(
	{
		UrlGetElements : "Dienste/GetFundAttributMitParents.php",
		Data : data,
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "FundAttribut.html"
	});
}

function LoadListChildren(fundAttributId)
{
	var data = null;
	
	if (fundAttributId != undefined &&
		fundAttributId != null)
	{
		data = { Id : fundAttributId };
	}
	
	$("#divFundAttribute #divList").List(
	{
		UrlGetElements : "Dienste/GetFundAttributChildren.php",
		Data : data,
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "FundAttribut.html"
	});
}

function LoadListFunde(fundAttributId)
{
	var data = null;
	
	if (fundAttributId != undefined &&
		fundAttributId != null)
	{
		data = { FundAttributId : fundAttributId };
	}
	
	$("#divFunde #divList").List(
	{
		UrlGetElements : "Dienste/GetFund.php",
		Data : data,
		SetListItemText : function(element)
		{
			if (element.Bezeichnung == null)
				return element.Anzahl.toString().replace("-", ">")+"x "+element.Typ.Bezeichnung+" ("+element.Id+")";
			else
				return element.Anzahl.toString().replace("-", ">")+"x "+element.Typ.Bezeichnung+": \""+element.Bezeichnung+"\" ("+element.Id+")";
		},
		ListItemLink : "Fund.html"
	});
}

function LoadListRootFundAttribute()
{	
	$("#divRootFundAttribute #divList").List(
	{
		UrlGetElements : "Dienste/GetFundAttributChildren.php",
		Data : { Id : null },
		SetListItemText : function(element)
		{
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
		},
		ListItemLink : "FundAttribut.html"
	});
}

function SetParent()
{	
	var dialog = "<div id=dialogSetParent title='Übergeordnetes Fundattribut auswählen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Bitte wählen Sie ein Fundattribut aus, unter das Sie das neue Fundattribut hinzufügen möchten:</p>";
	dialog += "<div id=divSetParent class=field></div>";
	dialog += "<input id=hiddenfieldParentId type=hidden></input>"
	dialog += "</div>";
	$("body").append(dialog);
	LoadMultiDropdownParent();
	$("#dialogSetParent").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Auswählen": function() {
				$(this).dialog("close");
				$(_selectorTextboxParentId).val($("#hiddenfieldParentId").val());
				$("#dialogSetParent").remove();
				LoadListParents();
			},
			"Abbrechen": function() {
				$(this).dialog("close");
				$("#dialogSetParent").remove();
			}
		}
	});
}

function LoadMultiDropdownParent()
{
	$("#divSetParent").MultiDropdown(
	{
		UrlGetParents : "Dienste/GetFundAttributMitParents.php",
		UrlGetChildren : "Dienste/GetFundAttributChildren.php",
		//SelectedElementId : null,
		//Blacklist : [],
		SetOptionBackgroundImage : function(element)
		{		
			return "images/system/Icon"+element.Typ.Bezeichnung.replace(" ","_")+"_16px.png";
		},
		SetOptionText : function(element)
		{
			if (element.FullBezeichnung == "")
				return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ("+element.Id+")";
				
			return element.Typ.Bezeichnung+": "+element.Bezeichnung+" ["+element.FullBezeichnung+"] ("+element.Id+")";
		},
		SetSelectedElementId : function(elementId)
		{
			$("#hiddenfieldParentId").val(elementId);
		}
	});
}

function buttonDelete_onClick()
{
	if ($("#textboxId").val() == GetValueForNoSelection())
	{
		return;
	}
	
	var dialog = "<div id=dialogDelete title='FundAttribut löschen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Möchten Sie die FundAttribut ("+$("#textboxId").val()+") wirklich löschen?</p>";
	dialog += "</div>";
	$("body").append(dialog);
	$("#dialogDelete").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Ja": function() {
				$(this).dialog("close");
				DeleteFundAttribut();
				$("#dialogDelete").remove();
			},
			"Nein": function() {
				$(this).dialog("close");
				$("#dialogDelete").remove();
			}
		}
	});
}

function DeleteFundAttribut()
{
	$.ajax(
	{
		type:"POST",
		url:"Dienste/DeleteFundAttribut.php",
		data: {
			"FundAttribut" : JSON.stringify(GetFundAttributJSON())
		},
		success:function(data, textStatus, jqXHR)
		{
			alert(data);
			ClearFields();
			LoadListRootFundAttribute();
		}
	});
}

function LoadSelectionTyp()
{
	$.ajax(
	{
		type:"POST",
		url:"Dienste/GetFundAttributTyp.php",
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
				var typen = $.parseJSON(data);
				var options = "";
				for (var i = 0; i < typen.length; i++)
				{
					if (i == 0)
						options += CreateOptionTyp(typen[i], true);
					else
						options += CreateOptionTyp(typen[i], false);
				}
				$("#selectTypen").html(options);
				SelectTypId();
				
				if (GetURLParameter("Id"))
					LoadFundAttributeById(GetURLParameter("Id"));
				else
					ClearFields();
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function CreateOptionTyp(typ, select)
{
	var option = "<option value=" + typ.Id + " ";
	if (select == true)
		option += "selected=selected ";	
	option += ">";
	option += typ.Bezeichnung;
	option += "</option>";
	
	return option;
}

function LoadFundAttributeById(id)
{
	if (id == undefined ||
		id == null ||
		id == GetValueForNoSelection())
	{
		ClearFields();
		return;
	}
	
	$.ajax(
	{
		type:"POST",
		url:"Dienste/GetFundAttributMitParents.php",
		data: {
			Id : id
		},
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{				
				var parents = $.parseJSON(data);
				var fundAttribut = parents[0];
				var parent = null;
				
				while (fundAttribut.Children != undefined &&
					fundAttribut.Children.length > 0)
				{
					parent = fundAttribut;
					fundAttribut = fundAttribut.Children[0];				
				}
				fundAttribut.Parent = parent;
				SetFundAttributJSON(fundAttribut);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function GetURLParameter(name)
{
	var url = window.location.search.substring(1);
	var parameters = url.split("&");
	for (var i = 0; i < parameters.length; i++)
	{
		var parameter = parameters[i].split("=");
		if (parameter[0] == name)
		{
			return parameter[1];
		}
	}
}

function GetCurrentElementId()
{
	return $("#textboxId").val();
}

function GetValueForNoSelection()
{
	return -1;
}
