<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Ablage/class.Ablage.php");

$assocArrayAblagen = array();
$parents = array();
$ablage = new Ablage();

if (isset($_GET["Id"]))
{
	$parents = $ablage->LoadByIds(preg_split("/[;]/", $_GET["Id"]));	
}
else
{
	$parents = $ablage->LoadRoots();
}

if (isset($_GET["ReturnDataStructure"]) &&
	$_GET["ReturnDataStructure"] == "List" && 
	count($parents) == 1)
{
	$assocArrayAblagen = $parents[0]->ConvertRootChainToSimpleAssocArrayList();
}
else
{
	for ($i = 0; $i < count($parents); $i++)
	{
		array_push($assocArrayAblagen, $parents[$i]->ConvertRootChainToSimpleAssocArray());
	}
}

echo json_encode($assocArrayAblagen);
