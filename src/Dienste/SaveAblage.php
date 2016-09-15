<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ablage/class.Ablage.php");
require_once("Klassen/Ablage/class.AblageTyp.php");

if (isset($_POST["Ablage"]))
{
	$ablageJSON = json_decode($_POST["Ablage"], true);
	$ablageTyp = new AblageTyp();
	$ablageTyp->LoadById(intval($ablageJSON["AblageTyp_Id"]));
	
	$ablage = new Ablage();	
		
	if ($ablageJSON["Id"] != NULL &&
		$ablageJSON["Id"] != "")
	{
		$ablage->LoadById($ablageJSON["Id"]);
	}
	
	$ablage->SetBezeichnung($ablageJSON["Bezeichnung"]);
	$ablage->SetTyp($ablageTyp);
	
	$ablage->Save();
	
	if ($ablageJSON["Parent_Id"] != NULL)
	{		
		$parent = new Ablage();
		$parent->LoadById(intval($ablageJSON["Parent_Id"]));
		$ablage->SetParent($parent);
	}
	
	if ($ablage->GetId() != NULL)
	{
		echo "Das Element (".$ablage->GetId().") wurde gespeichert.";
	}
}
