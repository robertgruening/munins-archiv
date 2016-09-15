<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ablage/class.Ablage.php");
require_once("Klassen/Kontext/class.Kontext.php");

if (isset($_POST["Id"]))
{
	$ablage = new Ablage();
	$ablage->LoadById(intval($_POST["Id"]));
	
	echo json_encode($ablage->ConvertToAssocArray());
	return;
}

$assocArrayAblagen = array();
$ablagen = array();
	
if (isset($_POST["KontextId"]))
{
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));
	$ablagen = $kontext->GetAblagen();	
}
else
{
	$ablage = new Ablage();
	$ablagen = $ablage->LoadRoots();
}

for ($i = 0; $i < count($ablagen); $i++)
{
	array_push($assocArrayAblagen, $ablagen[$i]->ConvertToSimpleAssocArray());
}

echo json_encode($assocArrayAblagen);
