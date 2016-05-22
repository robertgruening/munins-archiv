<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Fund/class.Fund.php");
require_once("Klassen/Ablage/class.Ablage.php");

if (isset($_POST["Id"]))
{
	$fund = new Fund();
	$fund->LoadById(intval($_POST["Id"]));
	echo json_encode($fund->ConvertToAssocArray(0));
}
else if (isset($_POST["AblageId"]))
{
	$assocArrayFunde = array();
	$ablage = new Ablage();
	$ablage->LoadById(intval($_POST["AblageId"]));
	$funde = $ablage->GetFunde();
	for ($i = 0; $i < count($funde); $i++)
	{
		array_push($assocArrayFunde, $funde[$i]->ConvertToAssocArray(0));
	}
	echo json_encode($assocArrayFunde);
}
else if (isset($_POST["KontextId"]))
{
	$assocArrayFunde = array();
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));
	$funde = $kontext->GetFunde();
	for ($i = 0; $i < count($funde); $i++)
	{
		array_push($assocArrayFunde, $funde[$i]->ConvertToAssocArray(0));
	}
	echo json_encode($assocArrayFunde);
}
