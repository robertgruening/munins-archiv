<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Fund/class.FundAttribut.php");

if (isset($_POST["Id"]) &&
	$_POST["Id"] != NULL)
{
	$attribut = new FundAttribut();
	$attribut->LoadById(intval($_POST["Id"]));
	
	$children = $attribut->GetChildren();
	$assocArrayChildren = array();
	
	for ($i = 0; $i < count($children); $i++)
	{
		array_push($assocArrayChildren, $children[$i]->ConvertToAssocArray(0));
	}
	echo json_encode($assocArrayChildren);
}
else if (isset($_POST["TypId"]))
{
	$assocArrayFundAttribute = array();
	$attribut = new FundAttribut();
	$attribute = $attribut->LoadRootsByTypId(intval($_POST["TypId"]));
	for ($i = 0; $i < count($attribute); $i++)
	{
		array_push($assocArrayFundAttribute, $attribute[$i]->ConvertToAssocArray(0));
	}
	echo json_encode($assocArrayFundAttribute);
}
else
{
	$assocArrayFundAttribute = array();
	$attribut = new FundAttribut();
	$attribute = $attribut->LoadRoots();
	for ($i = 0; $i < count($attribute); $i++)
	{
		array_push($assocArrayFundAttribute, $attribute[$i]->ConvertToAssocArray(0));
	}
	echo json_encode($assocArrayFundAttribute);
}

