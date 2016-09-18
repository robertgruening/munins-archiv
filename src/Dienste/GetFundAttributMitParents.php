<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Fund/class.FundAttribut.php");

$assocArrayFundAttribute = array();
$parents = array();
$fundAttribut = new FundAttribut();

if (isset($_POST["Id"]))
{
	$parents = $fundAttribut->LoadByIds(preg_split("/[;]/", $_POST["Id"]));	
}
else
{
	$parents = $fundAttribut->LoadRoots();
}

if (isset($_POST["ReturnDataStructure"]) &&
	$_POST["ReturnDataStructure"] == "list" && 
	count($parents) == 1)
{
	$assocArrayFundAttribute = $parents[0]->ConvertRootChainToSimpleAssocArrayList();
}
else
{
	for ($i = 0; $i < count($parents); $i++)
	{
		array_push($assocArrayFundAttribute, $parents[$i]->ConvertRootChainToSimpleAssocArray());
	}
}

echo json_encode($assocArrayFundAttribute);
