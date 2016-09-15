<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Fund/class.FundAttribut.php");
require_once("Klassen/Fund/class.Fund.php");

if (isset($_POST["Id"]))
{
	$attribut = new FundAttribut();
	$attribut->LoadById(intval($_POST["Id"]));
	
	echo json_encode($attribut->ConvertToAssocArray());
	return;
}

$assocArrayFundAttribute = array();
$attribute = array();

if (isset($_POST["FundId"]))
{
	$fund = new Fund();
	$fund->LoadById(intval($_POST["FundId"]));
	$attribute = $fund->GetAttribute();
}
else if (isset($_POST["TypId"]))
{
	$attribut = new FundAttribut();
	$attribute = $attribut->LoadRootsByTypId(intval($_POST["TypId"]));
}
else
{
	$attribut = new FundAttribut();
	$attribute = $attribut->LoadRoots();
}

for ($i = 0; $i < count($attribute); $i++)
{
	array_push($assocArrayFundAttribute, $attribute[$i]->ConvertToAssocArray());
}

echo json_encode($assocArrayFundAttribute);
