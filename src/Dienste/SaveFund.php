<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Kontext/class.Kontext.php");
require_once("Klassen/Ablage/class.Ablage.php");
require_once("Klassen/Fund/class.Fund.php");

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
	
	if ($fund->GetId() != NULL)
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
		
		echo "Das Element (".$fund->GetId().") wurde gespeichert.";
	}
}
