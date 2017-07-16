<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Fund/class.Fund.php");
require_once("../../Klassen/Fund/class.FundAttribut.php");
require_once("../../Klassen/Ablage/class.Ablage.php");

if (isset($_GET["Id"]))
{
	$fund = new Fund();
	$fund->LoadById(intval($_GET["Id"]));
	
	echo json_encode($fund->ConvertToAssocArray(0));
	return;
}

$assocArrayFunde = array();
$funde = array();
	
if (isset($_GET["AblageId"]))
{
	$ablage = new Ablage();
	$ablage->LoadById(intval($_GET["AblageId"]));
	$funde = $ablage->GetFunde();
}
else if (isset($_GET["KontextId"]))
{
	$kontext = new Kontext();
	$kontext->LoadById(intval($_GET["KontextId"]));
	$funde = $kontext->GetFunde();
}
else if (isset($_GET["FundAttributId"]))
{
	$fundAttribut = new FundAttribut();
	$fundAttribut->LoadById(intval($_GET["FundAttributId"]));
	$funde = $fundAttribut->GetFunde();
}

for ($i = 0; $i < count($funde); $i++)
{
	array_push($assocArrayFunde, $funde[$i]->ConvertToAssocArray());
}

echo json_encode($assocArrayFunde);
