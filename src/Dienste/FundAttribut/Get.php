<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Fund/class.FundAttribut.php");
require_once("../../Klassen/Fund/class.Fund.php");

if (isset($_GET["Id"]))
{
	$attribut = new FundAttribut();
	$attribut->LoadById(intval($_GET["Id"]));
	
	echo json_encode($attribut->ConvertToAssocArray());
	return;
}

$assocArrayFundAttribute = array();
$attribute = array();

if (isset($_GET["FundId"]))
{
	$fund = new Fund();
	$fund->LoadById(intval($_GET["FundId"]));
	$attribute = $fund->GetAttribute();
}
else if (isset($_GET["TypId"]))
{
	$attribut = new FundAttribut();
	$attribute = $attribut->LoadRootsByTypId(intval($_GET["TypId"]));
}
else
{
	$attribut = new FundAttribut();
	$attribute = $attribut->LoadRoots();
}

for ($i = 0; $i < count($attribute); $i++)
{
	array_push($assocArrayFundAttribute, $attribute[$i]->ConvertToSimpleAssocArray());
}

echo json_encode($assocArrayFundAttribute);
