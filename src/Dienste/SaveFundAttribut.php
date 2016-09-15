<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Fund/class.FundAttribut.php");
require_once("Klassen/Fund/class.FundAttributTyp.php");

if (isset($_POST["FundAttribut"]))
{
	$fundAttributJSON = json_decode($_POST["FundAttribut"], true);
	$fundAttributTyp = new FundAttributTyp();
	$fundAttributTyp->LoadById(intval($fundAttributJSON["Typ_Id"]));
	
	$fundAttribut = new FundAttribut();	
		
	if ($fundAttributJSON["Id"] != NULL &&
		$fundAttributJSON["Id"] != "")
	{
		$fundAttribut->LoadById($fundAttributJSON["Id"]);
	}
	
	$fundAttribut->SetBezeichnung($fundAttributJSON["Bezeichnung"]);
	$fundAttribut->SetTyp($fundAttributTyp);
	
	$fundAttribut->Save();
	
	if ($fundAttributJSON["Parent_Id"] != NULL)
	{		
		$parent = new FundAttribut();
		$parent->LoadById(intval($fundAttributJSON["Parent_Id"]));
		$fundAttribut->SetParent($parent);
	}
	
	if ($fundAttribut->GetId() != NULL)
	{
		echo "Das Element (".$fundAttribut->GetId().") wurde gespeichert.";
	}
}
