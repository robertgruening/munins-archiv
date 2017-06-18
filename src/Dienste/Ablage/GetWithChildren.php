<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Ablage/class.Ablage.php");

$assocArrayChildren = array();
$children = array();
$ablage = new Ablage();
	
if (isset($_GET["Id"]) &&
	$_GET["Id"] != NULL)
{
	$ablage->LoadById(intval($_GET["Id"]));	
	$children = $ablage->GetChildren();
}
else
{
	$children = $ablage->LoadRoots();
}

for ($i = 0; $i < count($children); $i++)
{
	array_push($assocArrayChildren, $children[$i]->ConvertToSimpleAssocArray());
}

echo json_encode($assocArrayChildren);

