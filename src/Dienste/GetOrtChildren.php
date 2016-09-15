<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ort/class.Ort.php");

$assocArrayChildren = array();
$children = array();
$ort = new Ort();
	
if (isset($_POST["Id"]) &&
	$_POST["Id"] != NULL)
{
	$ort->LoadById(intval($_POST["Id"]));	
	$children = $ort->GetChildren();
}
else
{
	$children = $ort->LoadRoots();;
}

for ($i = 0; $i < count($children); $i++)
{
	array_push($assocArrayChildren, $children[$i]->ConvertToSimpleAssocArray());
}

echo json_encode($assocArrayChildren);
