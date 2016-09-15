<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Fund/class.FundAttribut.php");

$assocArrayChildren = array();
$children = array();
$attribut = new FundAttribut();
	
if (isset($_POST["Id"]) &&
	$_POST["Id"] != NULL)
{
	$attribut->LoadById(intval($_POST["Id"]));	
	$children = $attribut->GetChildren();
}
else if (isset($_POST["TypId"]))
{
	$children = $attribut->LoadRootsByTypId(intval($_POST["TypId"]));
}
else
{
	$children = $attribut->LoadRoots();
}

for ($i = 0; $i < count($children); $i++)
{
	array_push($assocArrayChildren, $children[$i]->ConvertToSimpleAssocArray());
}

echo json_encode($assocArrayChildren);
