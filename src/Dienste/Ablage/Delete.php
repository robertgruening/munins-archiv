<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Ablage/class.Ablage.php");

if (isset($_GET["Id"]))
{
	$ablage = new Ablage();
	$ablage->LoadById(intval($_GET["Id"]));
	
	if (count($ablage->GetChildren()) > 0)
	{
		echo "ERROR: Ablage hat Kind-Ablagen";
		return;
	}
	
	if (count($ablage->GetKontexte()) > 0)
	{
		echo "ERROR: Ablage hat Kontexte";
		return;
	}
	
	if (count($ablage->GetFunde()) > 0)
	{
		echo "ERROR: Ablage hat Funde";
		return;
	}
	
	$ablage->Delete();
	$ablage = NULL;
	echo "INFO: Ablage (".$_GET["Id"].") wurde gelöscht";
}
