<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ablage/class.Ablage.php");

if (isset($_POST["Id"]))
{
	$assocArrayAblagen = array();
	$ablage = new Ablage();
	$ablagen = $ablage->LoadByIds(preg_split("/[;]/", $_POST["Id"]));
	
	for ($i = 0; $i < count($ablagen); $i++)
	{
		array_push($assocArrayAblagen, $ablagen[$i]->ConvertRootChainToSimpleAssocArray());
	}
	
	echo json_encode($assocArrayAblagen);
}
else
{
	$ablage = new Ablage();
	$rootAblagen = $ablage->LoadRoots();
	$assocArrayAblagen = array();	
	for ($i = 0; $i < count($rootAblagen); $i++)
	{
		array_push($assocArrayAblagen, $rootAblagen[$i]->ConvertRootChainToSimpleAssocArray());
	}
	echo json_encode($assocArrayAblagen);
}
