var _kartonschildIndex = 0;

$(document).ready(function() {
	$("#buttonAddKarton").click(function() { AddAblage(); });
	LoadAblageById(2);
	LoadAblageById(2);
	LoadAblageById(2);
	LoadAblageById(2);
	
	LoadAblageById(2);
	LoadAblageById(2);
	LoadAblageById(2);
	LoadAblageById(2);
	
	LoadAblageById(2);
	LoadAblageById(2);
	LoadAblageById(2);
	LoadAblageById(2);
	
	LoadAblageById(2);
	LoadAblageById(2);
	LoadAblageById(2);
	LoadAblageById(2);
	
	LoadAblageById(2);
	LoadAblageById(2);
	LoadAblageById(2);
	LoadAblageById(2);
	
	LoadAblageById(2);
	LoadAblageById(2);
	LoadAblageById(2);
	LoadAblageById(2);
});

function AddAblage()
{
	var dialog = "<div id=dialogAddAblage title='Ablage hinzufügen'>";
	dialog += "<p>";
	dialog += "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>";
	dialog += "Bitte wählen Sie ein Ablagelement aus, das Sie hinzufügen möchten:</p>";
	dialog += "<div id=divAddAblage class=field></div>";
	dialog += "<input id=hiddenfieldAblageId type=hidden></input>"
	dialog += "</div>";
	$("body").append(dialog);
	LoadMultiDropdownAblage();
	$("#dialogAddAblage").dialog({
		resizable: true,
		modal: true,
		buttons: {
			"Hinzufügen": function() {
				$(this).dialog("close");
				LoadAblageById($("#hiddenfieldAblageId").val());
				$("#dialogAddAblage").remove();
			},
			"Abbrechen": function() {
				$(this).dialog("close");
				$("#dialogAddAblage").remove();
			}
		}
	});
}

function LoadMultiDropdownAblage()
{
	$("#divAddAblage").MultiDropdown(
	{
		UrlGetParents : "Dienste/GetAblageMitParents.php",
		UrlGetChildren : "Dienste/GetAblageChildren.php",
		//SelectedElementId : null,
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
			$("#hiddenfieldAblageId").val(elementId);
		}
	});
}

function LoadAblageById(id)
{
	if (id == undefined ||
		id == null ||
		id == GetValueForNoSelection())
	{
		//ClearFields();
		return;
	}
	
	$.ajax(
	{
		type:"POST",
		url:"Dienste/GetAblageMitParents.php",
		data: {
			Id : id
		},
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{				
				var parents = $.parseJSON(data);
				var ablage = parents[0];
				var parent = null;
				
				while (ablage.Children != undefined &&
					ablage.Children.length > 0)
				{
					parent = ablage;
					ablage = ablage.Children[0];				
				}
				ablage.Parent = parent;
				LoadNewKarton(ablage);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function LoadNewKarton(kontext)
{
	$("#page").append(CreateNewKartonschild(_kartonschildIndex, kontext));
	_kartonschildIndex++;
}

function CreateNewKartonschild(index, kontext)
{
	var kartonschild = "<div class=kartonschild>";
	kartonschild += "<p class=labelKennung>Kennung</p>";
	kartonschild += "<p class=kennung>"+kontext.FullBezeichnung+"</p>";
	kartonschild += "<div>";
	
	return kartonschild;
}

function GetValueForNoSelection()
{
	return -1;
}
