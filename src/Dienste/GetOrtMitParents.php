<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ort/class.Ort.php");

$assocArrayOrte = array();
$parents = array();
$ort = new Ort();

if (isset($_POST["Id"]))
{
	$parents = $ort->LoadByIds(preg_split("/[;]/", $_POST["Id"]));	
}
else if (isset($_POST["KontextId"]))
{
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));
	$parents = $kontext->GetOrte();
}
else
{
	$parents = $ort->LoadRoots();
}

if (isset($_POST["ReturnDataStructure"]) &&
	$_POST["ReturnDataStructure"] == "list" && 
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
