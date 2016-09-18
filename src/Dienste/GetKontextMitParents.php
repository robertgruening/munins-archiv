<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Kontext/class.Kontext.php");
require_once("Klassen/Kontext/class.Begehungsflaeche.php");
require_once("Klassen/Kontext/class.Begehung.php");

$assocArrayKontexte = array();
$parents = array();
$kontext = new Kontext();

if (isset($_POST["Id"]))
{
	$parents = $kontext->LoadByIds(preg_split("/[;]/", $_POST["Id"]));		
}
else
{
	$parents = $kontext->LoadRoots();
}

for ($i = 0; $i < count($parents); $i++)
{
	if ($parents[$i]->GetTyp()->GetBezeichnung() == "Begehungsfläche")
	{
		$id = $parents[$i]->GetId();
		$parents[$i] = new Begehungsflaeche();
		$parents[$i]->LoadById($id);
	}
	else if ($parents[$i]->GetTyp()->GetBezeichnung() == "Begehung")
	{
		$id = $parents[$i]->GetId();
		$parents[$i] = new Begehung();
		$parents[$i]->LoadById($id);
	}
}

if (isset($_POST["ReturnDataStructure"]) &&
	$_POST["ReturnDataStructure"] == "list" && 
	count($parents) == 1)
{
	$assocArrayKontexte = $parents[0]->ConvertRootChainToSimpleAssocArrayList();
}
else
{
	for ($i = 0; $i < count($parents); $i++)
	{
		array_push($assocArrayKontexte, $parents[$i]->ConvertRootChainToSimpleAssocArray());
	}
}

echo json_encode($assocArrayKontexte);
