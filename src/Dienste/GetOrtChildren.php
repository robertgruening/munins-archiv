<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ort/class.Ort.php");

if (isset($_POST["Id"]) &&
	$_POST["Id"] != NULL)
{
	$ort = new Ort();
	$ort->LoadById(intval($_POST["Id"]));
	
	$children = $ort->GetChildren();
	$assocArrayChildren = array();
	
	for ($i = 0; $i < count($children); $i++)
	{
		array_push($assocArrayChildren, $children[$i]->ConvertToAssocArray(0));
	}
	echo json_encode($assocArrayChildren);
}
else
{
	$assocArrayOrte = array();
	$ort = new Ort();
	$orte = $ort->LoadRoots();
	for ($i = 0; $i < count($orte); $i++)
	{
		array_push($assocArrayOrte, $orte[$i]->ConvertToAssocArrayWithKontexten(0));
	}
	echo json_encode($assocArrayOrte);
}

