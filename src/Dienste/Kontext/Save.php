<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Kontext/class.Kontext.php");
require_once("../../Klassen/Kontext/class.Begehung.php");
require_once("../../Klassen/Kontext/class.Begehungsflaeche.php");
require_once("../../Klassen/Kontext/class.KontextTyp.php");

$message = array();

if (isset($_POST["Kontext"]))
{
	$kontextJSON = json_decode($_POST["Kontext"], true);	
	$kontextTyp = new KontextTyp();
	$kontextTyp->LoadById(intval($kontextJSON["KontextTyp_Id"]));
	
	$kontext = new Kontext();
	
	if ($kontextTyp->GetBezeichnung() == "Begehungsfläche")
		$kontext = new Begehungsflaeche();
	else if ($kontextTyp->GetBezeichnung() == "Begehung")
		$kontext = new Begehung();
	
	if ($kontextJSON["Id"] != NULL &&
		$kontextJSON["Id"] != "")
	{
		$kontext->LoadById($kontextJSON["Id"]);
	}
		
	$kontext->SetBezeichnung($kontextJSON["Bezeichnung"]);
	$kontext->SetTyp($kontextTyp);
		
	if ($kontextTyp->GetBezeichnung() == "Begehung")
	{
		$lfdErfassungsJahr = $kontextJSON["LfDErfassungsJahr"] == "" ? null : intval($kontextJSON["LfDErfassungsJahr"]);
		$lfdErfassungsNr = $kontextJSON["LfDErfassungsNr"] == "" ? null : intval($kontextJSON["LfDErfassungsNr"]);
		
		$kontext->SetLfDErfassungsJahr($lfdErfassungsJahr);
		$kontext->SetLfDErfassungsNr($lfdErfassungsNr);
		$kontext->SetDatum($kontextJSON["Datum"]);
		$kontext->SetKommentar($kontextJSON["Kommentar"]);
	}
	
	$kontext->Save();
	
	if ($kontextJSON["Parent_Id"] != NULL)
	{
		$parent = new Kontext();
		$parent->LoadById(intval($kontextJSON["Parent_Id"]));
		$kontext->SetParent($parent);
	}
	
	if ($kontext->GetId() == NULL)
	{
		$message["Message"] = "Ein Element konnte leider nicht gespeichert werden.";
	}
	else
	{
		$message["Message"] = "Das Element (".$kontext->GetId().") wurde gespeichert.";
		$message["ElementId"] = $kontext->GetId();
	}
}
else
{
	$message["Message"] = "Es wurde kein Element erkannt.";
}

echo json_encode($message);
