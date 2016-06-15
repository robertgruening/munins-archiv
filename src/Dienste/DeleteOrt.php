<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ort/class.Ort.php");

if (isset($_POST["Ort"]))
{
	$ortJSON = json_decode($_POST["Ort"], true);
	
	$ort = new Ort();
	$ort->LoadById(intval($ortJSON["Id"]));
	
	if (count($ort->GetChildren()) == 0)
	{
		$ort->Delete();
		$ort = NULL;
		echo "INFO: Ort (".$ortJSON["Id"].") wurde gelöscht";
	}
	else
	{
		echo "ERROR: Ort hat Kind-Ort";
	}
}
