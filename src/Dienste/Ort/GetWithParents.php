<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Ort/class.Ort.php");

$assocArrayOrte = array();
$parents = array();
$ort = new Ort();

if (isset($_GET["Id"]))
{
	$parents = $ort->LoadByIds(preg_split("/[;]/", $_GET["Id"]));	
}
else if (isset($_GET["KontextId"]))
{
	$kontext = new Kontext();
	$kontext->LoadById(intval($_GET["KontextId"]));
	$parents = $kontext->GetOrte();
}
else
{
	$parents = $ort->LoadRoots();
}

if (isset($_GET["ReturnDataStructure"]) &&
	$_GET["ReturnDataStructure"] == "List" && 
	count($parents) == 1)
{
	$assocArrayOrte = $parents[0]->ConvertRootChainToSimpleAssocArrayList();
}
else
{
	for ($i = 0; $i < count($parents); $i++)
	{
		array_push($assocArrayOrte, $parents[$i]->ConvertRootChainToSimpleAssocArray());
	}
}

echo json_encode($assocArrayOrte);
