<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Ort/class.Ort.php");

if (isset($_GET["Id"]))
{	
	$ort = new Ort();
	$ort->LoadById(intval($_GET["Id"]));	
	
	if (count($ort->GetChildren()) > 0)
	{		
		echo "ERROR: Ort hat Kind-Ort";
		return;
	}
	
	if (count($ort->GetKontexte()) > 0)
	{		
		echo "ERROR: Ort hat Kontexte";
		return;
	}

	$ort->Delete();
	$ort = NULL;
	echo "INFO: Ort (".$_GET["Id"].") wurde gelöscht";
}
