<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ort/class.Ort.php");
require_once("Klassen/Kontext/class.Kontext.php");

if (isset($_GET["Id"]))
{
	$ort = new Ort();
	$ort->LoadById(intval($_GET["Id"]));
	
	echo json_encode($ort->ConvertToAssocArray(0));
}
else if (isset($_GET["KontextId"]))
{
	$assocArrayOrte = array();
	$kontext = new Kontext();
	$kontext->LoadById(intval($_GET["KontextId"]));
	$orte = $kontext->GetOrte();
	for ($i = 0; $i < count($orte); $i++)
	{
		array_push($assocArrayOrte, $orte[$i]->ConvertToAssocArray(1000));
	}
	echo json_encode($assocArrayOrte);
}
else
{
	$assocArrayOrte = array();
	$ort = new Ort();
	$orte = $ort->LoadRoots();
	for ($i = 0; $i < count($orte); $i++)
	{
		array_push($assocArrayOrte, $orte[$i]->ConvertToAssocArrayWithKontexten(1000));
	}
	echo json_encode($assocArrayOrte);
}

