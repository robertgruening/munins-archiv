<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Klassen/Ablage/class.Ablage.php");
require_once("../Klassen/Fund/class.Fund.php");
require_once("../Klassen/Fund/class.FundAttribut.php");
require_once("../Klassen/Kontext/class.Kontext.php");
require_once("../Klassen/Ort/class.Ort.php");

if (isset($_GET["Typ"]))
{
	$typ = $_GET["Typ"];
	$element = NULL;
	
	switch($typ)
	{
		case "Ablage" : 
		{
			$element = new Ablage();
			break;
		}
		case "Fund" : 
		{
			$element = new Fund();
			echo $element->Count(array());
			return;
		}
		case "FundAttribut" : 
		{
			$element = new FundAttribut();
			break;
		}
		case "Kontext" : 
		{
			$element = new Kontext();
			break;
		}
		case "Ort" : 
		{
			$element = new Ort();
			break;
		}
		default :
		{
			echo "Fehler: Unbekannter Typ";
			return;
		}
	}
	
	echo $element->Count("");
}
