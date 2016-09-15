<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ort/class.Ort.php");
require_once("Klassen/Kontext/class.Kontext.php");

if (isset($_POST["Id"]))
{
	$ort = new Ort();
	$ort->LoadById(intval($_POST["Id"]));
	
	echo json_encode($ort->ConvertToAssocArray());
	return;
}

$assocArrayOrte = array();
$orte = array();

if (isset($_POST["KontextId"]))
{
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));
	$orte = $kontext->GetOrte();
}
else
{
	$ort = new Ort();
	$orte = $ort->LoadRoots();
}

for ($i = 0; $i < count($orte); $i++)
{
	array_push($assocArrayOrte, $orte[$i]->ConvertToAssocArray());
}

echo json_encode($assocArrayOrte);
