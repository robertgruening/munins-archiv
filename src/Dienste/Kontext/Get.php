<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Kontext/class.Kontext.php");
require_once("../../Klassen/Kontext/class.Begehungsflaeche.php");
require_once("../../Klassen/Kontext/class.Begehung.php");
require_once("../../Klassen/Ablage/class.Ablage.php");
require_once("../../Klassen/Ort/class.Ort.php");

if (isset($_GET["Id"]))
{
	$kontext = new Kontext();
	$kontext->LoadById(intval($_GET["Id"]));
	
	if ($kontext->GetTyp()->GetBezeichnung() == "Begehungsfläche")
	{
		$kontext = new Begehungsflaeche();
		$kontext->LoadById(intval($_GET["Id"]));
	}
	else if ($kontext->GetTyp()->GetBezeichnung() == "Begehung")
	{
		$kontext = new Begehung();
		$kontext->LoadById(intval($_GET["Id"]));
	}
	
	echo json_encode($kontext->ConvertToAssocArray());
	return;
}

$assocArrayKontexte = array();
$kontexte = array();

if (isset($_GET["AblageId"]))
{
	$ablage = new Ablage();
	$ablage->LoadById(intval($_GET["AblageId"]));
	$kontexte = $ablage->GetKontexte();
}
else if (isset($_GET["OrtId"]))
{
	$ort = new Ort();
	$ort->LoadById(intval($_GET["OrtId"]));
	$kontexte = $ort->GetKontexte();
}
else
{	
	$kontext = new Kontext();
	$kontexte = $kontext->LoadRoots();
}

for ($i = 0; $i < count($kontexte); $i++)
{
	array_push($assocArrayKontexte, $kontexte[$i]->ConvertToSimpleAssocArray());
}

echo json_encode($assocArrayKontexte);

