<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ablage/class.Ablage.php");

if (isset($_POST["Id"]) &&
	$_POST["Id"] != NULL)
{
	$ablage = new Ablage();
	$ablage->LoadById(intval($_POST["Id"]));
	
	$children = $ablage->GetChildren();
	$assocArrayChildren = array();
	
	for ($i = 0; $i < count($children); $i++)
	{
		array_push($assocArrayChildren, $children[$i]->ConvertToAssocArray(0));
	}
	echo json_encode($assocArrayChildren);
}
else
{
	$assocArrayAblagen = array();
	$ablage = new Ablage();
	$ablagen = $ablage->LoadRoots();
	for ($i = 0; $i < count($ablagen); $i++)
	{
		array_push($assocArrayAblagen, $ablagen[$i]->ConvertToAssocArrayWithKontexten(0));
	}
	echo json_encode($assocArrayAblagen);
}

