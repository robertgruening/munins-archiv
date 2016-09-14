<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ablage/class.Ablage.php");
require_once("Klassen/Kontext/class.Kontext.php");

if (isset($_POST["Id"]))
{
	$ablage = new Ablage();
	$ablage->LoadById(intval($_POST["Id"]));
	
	echo json_encode($ablage->ConvertToAssocArray());
}
else if (isset($_POST["KontextId"]))
{
	$assocArrayAblagen = array();
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));
	$ablagen = $kontext->GetAblagen();
	for ($i = 0; $i < count($ablagen); $i++)
	{
		array_push($assocArrayAblagen, $ablagen[$i]->ConvertToAssocArray());
	}
	echo json_encode($assocArrayAblagen);
}
else
{
	$assocArrayAblagen = array();
	$ablage = new Ablage();
	$ablagen = $ablage->LoadRoots();
	for ($i = 0; $i < count($ablagen); $i++)
	{
		array_push($assocArrayAblagen, $ablagen[$i]->ConvertToAssocArrayWithProperties(true, true));
	}
	echo json_encode($assocArrayAblagen);
}

