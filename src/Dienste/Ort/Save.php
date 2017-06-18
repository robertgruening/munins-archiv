<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Ort/class.Ort.php");
require_once("../../Klassen/Ort/class.OrtTyp.php");

$message = array();

if (isset($_POST["Ort"]))
{
	$ortJSON = json_decode($_POST["Ort"], true);
	$ortTyp = new OrtTyp();
	$ortTyp->LoadById(intval($ortJSON["OrtTyp_Id"]));
	
	$ort = new Ort();	
	
	if ($ortJSON["Id"] != NULL &&
		$ortJSON["Id"] != "")
	{
		$ort->LoadById($ortJSON["Id"]);
	}
	
	$ort->SetBezeichnung($ortJSON["Bezeichnung"]);
	$ort->SetTyp($ortTyp);
	
	$ort->Save();
	
	if ($ortJSON["Parent_Id"] != NULL)
	{		
		$parent = new Ort();
		$parent->LoadById(intval($ortJSON["Parent_Id"]));
		$ort->SetParent($parent);
	}
	
	if ($ort->GetId() == NULL)
	{
		$message["Message"] = "Ein Element konnte leider nicht gespeichert werden.";
	}
	else
	{
		$message["Message"] = "Das Element (".$ort->GetId().") wurde gespeichert.";
		$message["ElementId"] = $ort->GetId();
	}
}
else
{
	$message["Message"] = "Es wurde kein Element erkannt.";
}

echo json_encode($message);
