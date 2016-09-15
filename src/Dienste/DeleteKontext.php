<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Kontext/class.Kontext.php");

if (isset($_POST["Kontext"]))
{
	$kontextJSON = json_decode($_POST["Kontext"], true);
	
	$kontext = new Kontext();
	$kontext->LoadById(intval($kontextJSON["Id"]));
	
	if (count($kontext->GetChildren()) > 0)
	{
		echo "ERROR: Kontext hat Kind-Kontexte";
		return;
	}
	
	if (count($kontext->GetAblagen()) > 0)
	{
		echo "ERROR: Kontext hat Ablagen";
		return;
	}
	
	if (count($kontext->GetFunde()) > 0)
	{
		echo "ERROR: Kontext hat Funde";
		return;
	}
	
	$kontext->Delete();
	$kontext = NULL;
	echo "INFO: Kontext (".$kontextJSON["Id"].") wurde gelöscht";
}
