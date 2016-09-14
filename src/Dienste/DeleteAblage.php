<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ablage/class.Ablage.php");

if (isset($_POST["Ablage"]))
{
	$ablageJSON = json_decode($_POST["Ablage"], true);
	
	$ablage = new Ablage();
	$ablage->LoadById(intval($ablageJSON["Id"]));
	
	if (count($ablage->GetChildren()) == 0)
	// ToDo: Und keine Verknüpfung zu Funden oder Kontexten!
	{
		$ablage->Delete();
		$ablage = NULL;
		echo "INFO: Ablage (".$ablageJSON["Id"].") wurde gelöscht";
	}
	else
	{
		echo "ERROR: Ablage hat Kind-Ablagen";
	}
}
