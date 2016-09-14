var _kartonschildIndex = 0;

$(document).ready(function() {
	$("#buttonAddKarton").click(function() { AddAblage(); });
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
				LoadKontexte(ablage);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function LoadKontexte(ablage)
{	
	$.ajax(
	{
		type:"POST",
		url:"Dienste/GetKontext.php",
		data: {
			AblageId : ablage.Id
		},
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{	
				var kontext = $.parseJSON(data)[0];
				LoadKontextMitParents(ablage, kontext.Id);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function LoadKontextMitParents(ablage, kontextId)
{	
	$.ajax(
	{
		type:"POST",
		url:"Dienste/GetKontextMitParents.php",
		data: {
			Id : kontextId
		},
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{					
				var parents = $.parseJSON(data);
				var kontext = parents[0];
				var parent = null;
				
				while (kontext.Children != undefined &&
					kontext.Children.length > 0)
				{
					parent = kontext;
					kontext = kontext.Children[0];				
				}
				kontext.Parent = parent;
				// Annahme:
				// Die Ablage ist mit einem Kontext der Zeit verbunden,
				// aber mit dem darüberliegenden Kontext des Ortes ist
				// der Ort verbunden.
				// Beispiel:
				// Karton ist verknüpft mit Begehung und
				// Ort ist verknüpft mit Begehungsfläche
				LoadOrte(ablage, kontext.Parent);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function LoadOrte(ablage, kontext)
{	
	$.ajax(
	{
		type:"POST",
		url:"Dienste/GetOrtMitParents.php",
		data: {
			KontextId : kontext.Id
		},
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{	
				var ort = $.parseJSON(data)[0];
				LoadNewKarton(ablage, ort);
			}
		},
		error:function(jqXHR, textStatus, errorThrown)
		{
			alert("error");
		}
	});	
}

function LoadNewKarton(ablage, ort)
{
	$("#page").append(CreateNewKartonschild(_kartonschildIndex, ablage, ort));
	_kartonschildIndex++;
}

function CreateNewKartonschild(index, ablage, ort)
{
	var kartonschild = "<div class=kartonschild>";
	kartonschild += "<p class=labelKennung>Kennung</p>";
	kartonschild += "<p class=kennung>"+ablage.FullBezeichnung+"</p>";
	kartonschild += "<table>";
	kartonschild += GetOrtsTabelle(ort);
	kartonschild += "<table>";
	kartonschild += "<div>";
	
	return kartonschild;
}

function GetOrtsTabelle(ort)
{
	var zeile = "";
	zeile += "<tr>";
	zeile += "<td class=ortsTypBezeichnung>" + ort.Typ.Bezeichnung + "<td>";
	zeile += "<td class=ortsBezeichnung>" + ort.Bezeichnung + "<td>";
	zeile += "</tr>";
	
	if (ort.Children != undefined)
		zeile += GetOrtsTabelle(ort.Children[0]);
		
	return zeile;
}

function GetValueForNoSelection()
{
	return -1;
}
