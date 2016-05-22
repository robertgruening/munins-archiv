<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ablage/class.Ablage.php");
require_once("Klassen/Ablage/class.Karton.php");
require_once("Klassen/Kontext/class.Kontext.php");

if (isset($_POST["Id"]))
{
	$ablage = new Ablage();
	$ablage->LoadById(intval($_POST["Id"]));
	
	/*if ($ablage->GetTyp()->GetBezeichnung() == "Karton")
	{
		$ablage = new Kontext();
		$ablage->LoadById(intval($_POST["Id"]));
	}*/
	
	echo json_encode($ablage->ConvertToAssocArray(0));
}
else if (isset($_POST["KontextId"]))
{
	$assocArrayAblagen = array();
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));
	$ablagen = $kontext->GetAblagen();
	for ($i = 0; $i < count($ablagen); $i++)
	{
		if ($ablagen[$i]->GetTyp()->GetBezeichnung() == "Karton")
		{
			$ablageId = $ablagen[$i]->GetId();
			$ablagen[$i] = new Karton();
			$ablagen[$i]->LoadById($ablageId);
		}
		array_push($assocArrayAblagen, $ablagen[$i]->ConvertToAssocArray(1000));
	}
	echo json_encode($assocArrayAblagen);
}
else
{
	$assocArrayAblagen = array();
	$ablage = new Ablage();
	$ablagen = $ablage->LoadRoots();
	for ($i = 0; $i < count($ablagen); $i++)
	{
		/*if ($ablagen[$i]->GetTyp()->GetBezeichnung() == "Karton")
		{
			$ablagen[$i] = new Karton();
			$ablagen[$i]->LoadById(intval($_POST["Id"]));
		}*/
		array_push($assocArrayAblagen, $ablagen[$i]->ConvertToAssocArrayWithKontexten(1000));
	}
	echo json_encode($assocArrayAblagen);
}

