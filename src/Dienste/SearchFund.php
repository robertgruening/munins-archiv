<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Fund/class.Fund.php");
require_once("Klassen/Ablage/class.Ablage.php");

$fundIds = NULL;
$message = array();
$message["Gesamtanzahl"] = 0;
$message["From"] = 0;
$message["To"] = 0;
$message["Elemente"] = array();

if (isset($_POST["Id"]))
{
	if (is_null($fundIds))
		$fundIds = array();
		
	array_push($fundIds, intval($_POST["Id"]));
}

if (isset($_POST["AblageId"]))
{
	if (is_null($fundIds))
		$fundIds = array();
		
	$ablage = new Ablage();
	$ablage->LoadById(intval($_POST["AblageId"]));
	$ablagen = array();
	array_push($ablagen, $ablage);
	$ablagen += $ablage->LoadSubtreeAsList();
	$funde = array();
	
	for ($i = 0; $i < count($ablagen); $i++)
	{
		$funde += $ablagen[$i]->GetFunde();
	}
	
	for ($i = 0; $i < count($funde); $i++)
	{
		array_push($fundIds, $funde[$i]->GetId());
	}
}

if (isset($_POST["KontextId"]))
{
	if (is_null($fundIds))
		$fundIds = array();
		
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));	
	$kontexte = array();
	array_push($kontexte, $kontext);
	$kontexte += $kontext->LoadSubtreeAsList();
	$funde = array();
	
	for ($i = 0; $i < count($kontexte); $i++)
	{
		$funde += $kontexte[$i]->GetFunde();
	}
	
	$tmp = $fundIds;
	$fundIds = array();
	
	for ($i = 0; $i < count($funde); $i++)
	{
		if (in_array($funde[$i]->GetId(), $tmp))
		{
			array_push($fundIds, $funde[$i]->GetId());
		}
	}
}

if (!is_null($fundIds) &&
	count($fundIds) == 0)
{
	echo json_encode($message);
	
	return;
}

$filter = array();

if (isset($_POST["Beschriftung"]) &&
	$_POST["Beschriftung"] != "")
{
	$filter["Beschriftung"] = $_POST["Beschriftung"];
}

if (!is_null($fundIds))
{
	$filter["Ids"] = $fundIds;
}

$fund = new Fund();

if (isset($_POST["Offset"]) &&
	isset($_POST["Limit"]))
{
	$funde = $fund->LoadByIds(intval($_POST["Offset"]), intval($_POST["Limit"]), $filter);
}
else
{	
	$funde = $fund->LoadByIds(NULL, NULL, $filter);
}

$message["Gesamtanzahl"] = $fund->Count($filter);

if ($message["Gesamtanzahl"] > 0)
{
	$message["From"] = 1;
	$message["To"] = count($funde);
	
	if (isset($_POST["Offset"]))
	{
		$message["From"] += intval($_POST["Offset"]);
		$message["To"] += intval($_POST["Offset"]);
	}
}

for ($i = 0; $i < count($funde); $i++)
{
	array_push($message["Elemente"], $funde[$i]->ConvertToAssocArray());
}

echo json_encode($message);
