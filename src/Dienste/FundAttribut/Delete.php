<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Fund/class.FundAttribut.php");

if (isset($_GET["Id"]))
{	
	$fundattribut = new FundAttribut();
	$fundattribut->LoadById(intval($_GET["Id"]));
	
	if (count($fundattribut->GetChildren()) > 0)
	{
		echo "ERROR: Fundattribut hat Kind-Fundattribute";
		return;
	}
	
	if (count($fundattribut->GetFunde()) > 0)
	{
		echo "ERROR: Fundattribut ist Funden zugewiesen";
		return;
	}
	
	$fundattribut->Delete();
	$fundattribut = NULL;
	echo "INFO: Fundattribut (".$_GET["Id"].") wurde gelöscht";	
}
