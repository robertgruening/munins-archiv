<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Kontext/class.Kontext.php");
require_once("../../Klassen/Ablage/class.Ablage.php");
require_once("../../Klassen/Fund/class.Fund.php");

$message = array();

if (isset($_POST["Fund"]))
{
	$fundJSON = json_decode($_POST["Fund"], true);	
	$fund = new Fund();
	
	if ($fundJSON["Id"] != NULL &&
		$fundJSON["Id"] != "")
	{
		$fund->LoadById($fundJSON["Id"]);
	}
	$fund->SetBezeichnung($fundJSON["Bezeichnung"]);
	$fund->SetAnzahl(intval($fundJSON["Anzahl"]));
	
	$fund->Save();
	
	if ($fund->GetId() == NULL)
	{
		$message["Message"] = "Ein Element konnte leider nicht gespeichert werden.";
	}
	else
	{
		if (isset($fundJSON["Kontext_Id"]))
		{
			$kontext = new Kontext();
			$kontext->LoadById(intval($fundJSON["Kontext_Id"]));
			$fund->SetKontexte($kontext);
		}

		if (isset($fundJSON["Ablage_Id"]))
		{
			$ablage = new Ablage();
			$ablage->LoadById(intval($fundJSON["Ablage_Id"]));
			$fund->SetAblage($ablage);
		}
		
		$message["Message"] = "Das Element (".$fund->GetId().") wurde gespeichert.";
		$message["ElementId"] = $fund->GetId();
	}
}
else
{
	$message["Message"] = "Es wurde kein Element erkannt.";
}

echo json_encode($message);
