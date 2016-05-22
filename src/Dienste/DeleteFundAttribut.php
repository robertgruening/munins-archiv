<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Fund/class.FundAttribut.php");

if (isset($_POST["FundAttribut"]))
{
	$fundattributJSON = json_decode($_POST["FundAttribut"], true);
	
	$fundattribut = new FundAttribut();
	$fundattribut->LoadById(intval($fundattributJSON["Id"]));
	
	if (count($fundattribut->GetChildren()) == 0)
	{
		$fundattribut->Delete();
		$fundattribut = NULL;
		echo "INFO: Fundattribut (".$fundattributJSON["Id"].") wurde gelöscht";
	}
	else
	{
		echo "ERROR: Fundattribut hat Kind-Fundattribute";
	}
}
