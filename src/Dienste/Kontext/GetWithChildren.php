<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Kontext/class.Kontext.php");

$assocArrayChildren = array();
$children = array();
$kontext = new Kontext();
	
if (isset($_GET["Id"]) &&
	$_GET["Id"] != NULL)
{
	$kontext->LoadById(intval($_GET["Id"]));	
	$children = $kontext->GetChildren();
}
else
{
	$children = $kontext->LoadRoots();
}

for ($i = 0; $i < count($children); $i++)
{
	array_push($assocArrayChildren, $children[$i]->ConvertToSimpleAssocArray());
}

echo json_encode($assocArrayChildren);
