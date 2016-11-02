<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Fund/class.Fund.php");
require_once("Klassen/Ablage/class.Ablage.php");

if (isset($_POST["Id"]))
{
	$fund = new Fund();
	$fund->LoadById(intval($_POST["Id"]));
	
	echo json_encode($fund->ConvertToAssocArray(0));
	return;
}
$message = array();
$message["Elemente"] = array();
$funde = array();
	
if (isset($_POST["AblageId"]))
{
	$ablage = new Ablage();
	$ablage->LoadById(intval($_POST["AblageId"]));
	$funde = $ablage->GetFunde();
}
else if (isset($_POST["KontextId"]))
{
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));
	$funde = $kontext->GetFunde();
}

if (count($funde) == 0)
{
	$fund = new Fund();
	$message["Gesamtanzahl"] = $fund->Count();
	
	if (isset($_POST["Offset"]) &&
		isset($_POST["Limit"]))
	{
		$funde = $fund->LoadAll(intval($_POST["Offset"]), intval($_POST["Limit"]));
		
		$message["From"] = 0;
		$message["To"] = 0;
		
		if ($message["Gesamtanzahl"] > 0)
		{
			$message["From"] = intval($_POST["Offset"]) + 1;
			$message["To"] = intval($_POST["Offset"]) + count($funde);
		}
	}
	else
	{	
		$funde = $fund->LoadAll(null, null);
	}
	
}

for ($i = 0; $i < count($funde); $i++)
{
	array_push($message["Elemente"], $funde[$i]->ConvertToAssocArray());
}


echo json_encode($message);
