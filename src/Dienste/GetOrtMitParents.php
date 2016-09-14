<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ort/class.Ort.php");

if (isset($_POST["Id"]))
{
	$ids = preg_split("/[;]/", $_POST["Id"]);
	$assocArrayOrte = array();	
	for ($i = 0; $i < count($ids); $i++)
	{
		$rootOrt = new Ort();
		$rootOrt->LoadById($ids[$i]);
		$assocArrayRootOrt = $rootOrt->ConvertToAssocArray(0);
		
		$isRoot = false;
		while ($isRoot == false)
		{	
			if ($rootOrt->GetParent() == NULL)
			{
				$isRoot = true;
			}
			else
			{
				$rootOrt = $rootOrt->GetParent();
				$tmp = $rootOrt->ConvertToAssocArray(0);
				$tmp["Children"] = array();
				array_push($tmp["Children"], $assocArrayRootOrt);
				$assocArrayRootOrt = $tmp;
			}
		}
		array_push($assocArrayOrte, $assocArrayRootOrt);
	}
	echo json_encode($assocArrayOrte);
}
else if (isset($_POST["KontextId"]))
{
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));
	$orte = $kontext->GetOrte();
	
	$assocArrayOrte = array();	
	for ($i = 0; $i < count($orte); $i++)
	{
		$rootOrt = $orte[$i];
		$assocArrayRootOrt = $rootOrt->ConvertToAssocArray(0);
		
		$isRoot = false;
		while ($isRoot == false)
		{	
			if ($rootOrt->GetParent() == NULL)
			{
				$isRoot = true;
			}
			else
			{
				$rootOrt = $rootOrt->GetParent();
				$tmp = $rootOrt->ConvertToAssocArray(0);
				$tmp["Children"] = array();
				array_push($tmp["Children"], $assocArrayRootOrt);
				$assocArrayRootOrt = $tmp;
			}
		}
		array_push($assocArrayOrte, $assocArrayRootOrt);
	}
	echo json_encode($assocArrayOrte);
}
else
{
	$ort = new Ort();
	$rootOrte = $ort->LoadRoots();
	$assocArrayOrte = array();	
	for ($i = 0; $i < count($rootOrte); $i++)
	{
		array_push($assocArrayOrte, $rootOrte[$i]->ConvertToAssocArrayWithKontexten(1000));
	}
	echo json_encode($assocArrayOrte);
}
