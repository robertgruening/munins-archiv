<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Kontext/class.Kontext.php");
require_once("Klassen/Kontext/class.Begehungsflaeche.php");
require_once("Klassen/Kontext/class.Begehung.php");

if (isset($_POST["Id"]))
{
	$ids = preg_split("/[;]/", $_POST["Id"]);
	$assocArrayKontexte = array();	
	for ($i = 0; $i < count($ids); $i++)
	{
		$rootKontext = new Kontext();
		$rootKontext->LoadById($ids[$i]);
		
		if ($rootKontext->GetTyp()->GetBezeichnung() == "Begehungsfläche")
		{
			$id = $rootKontext->GetId();
			$rootKontext = new Begehungsflaeche();
			$rootKontext->LoadById($id);
		}
		else if ($rootKontext->GetTyp()->GetBezeichnung() == "Begehung")
		{
			$id = $rootKontext->GetId();
			$rootKontext = new Begehung();
			$rootKontext->LoadById($id);
		}
	
		$assocArrayRootKontext = $rootKontext->ConvertToAssocArray(0);
		
		$isRoot = false;
		while ($isRoot == false)
		{	
			if ($rootKontext->GetParent() == NULL)
			{
				$isRoot = true;
			}
			else
			{
				$rootKontext = $rootKontext->GetParent();
				
				if ($rootKontext->GetTyp()->GetBezeichnung() == "Begehungsfläche")
				{
					$id = $rootKontext->GetId();
					$rootKontext = new Begehungsflaeche();
					$rootKontext->LoadById($id);
				}
				else if ($rootKontext->GetTyp()->GetBezeichnung() == "Begehung")
				{
					$id = $rootKontext->GetId();
					$rootKontext = new Begehung();
					$rootKontext->LoadById($id);
				}
		
				$tmp = $rootKontext->ConvertToAssocArray(0);
				$tmp["Children"] = array();
				array_push($tmp["Children"], $assocArrayRootKontext);
				$assocArrayRootKontext = $tmp;
			}
		}
		array_push($assocArrayKontexte, $assocArrayRootKontext);
	}
	echo json_encode($assocArrayKontexte);
}
else
{
	$kontext = new Kontext();
	$rootKontexte = $kontext->LoadRoots();
	$assocArrayKontexte = array();	
	for ($i = 0; $i < count($rootKontexte); $i++)
	{		
		if ($rootKontext[$i]->GetTyp()->GetBezeichnung() == "Begehungsfläche")
		{
			$id = $rootKontexte[$i]->GetId();
			$rootKontexte[$i] = new Begehungsflaeche();
			$rootKontexte[$i]->LoadById($id);
		}
		else if ($rootKontext[$i]->GetTyp()->GetBezeichnung() == "Begehung")
		{
			$id = $rootKontexte[$i]->GetId();
			$rootKontexte[$i] = new Begehung();
			$rootKontexte[$i]->LoadById($id);
		}
		array_push($assocArrayKontexte, $rootKontexte[$i]->ConvertToAssocArrayWithAblagen(1000));
	}
	echo json_encode($assocArrayKontexte);
}
