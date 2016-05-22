<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ablage/class.Ablage.php");
require_once("Klassen/Kontext/class.Kontext.php");
require_once("Klassen/Fund/class.Fund.php");

if (isset($_POST["Typ"]))
{
	$typ = $_POST["Typ"];
	$element = NULL;
	
	switch($typ)
	{
		case "Kontext" : 
		{
			$element = new Kontext();
			break;
		}
		case "Ablage" : 
		{
			$element = new Ablage();
			break;
		}
		case "Fund" : 
		{
			$element = new Fund();
			break;
		}
		default :
		{
			echo "Fehler: Unbekannter Typ";
			return;
		}
	}
	
	echo $element->Count();
}
