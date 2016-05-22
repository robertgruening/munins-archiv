<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ablage/class.Ablage.php");

if (isset($_POST["Id"]))
{
	$ids = preg_split("/[;]/", $_POST["Id"]);
	$assocArrayAblagen = array();	
	for ($i = 0; $i < count($ids); $i++)
	{
		$rootAblage = new Ablage();
		$rootAblage->LoadById($ids[$i]);
		$assocArrayRootAblage = $rootAblage->ConvertToAssocArray(0);
		
		$isRoot = false;
		while ($isRoot == false)
		{	
			if ($rootAblage->GetParent() == NULL)
			{
				$isRoot = true;
			}
			else
			{
				$rootAblage = $rootAblage->GetParent();
				$tmp = $rootAblage->ConvertToAssocArray(0);
				$tmp["Children"] = array();
				array_push($tmp["Children"], $assocArrayRootAblage);
				$assocArrayRootAblage = $tmp;
			}
		}
		array_push($assocArrayAblagen, $assocArrayRootAblage);
	}
	echo json_encode($assocArrayAblagen);
}
else
{
	$ablage = new Ablage();
	$rootAblagen = $ablage->LoadRoots();
	$assocArrayAblagen = array();	
	for ($i = 0; $i < count($rootAblagen); $i++)
	{
		array_push($assocArrayAblagen, $rootAblagen[$i]->ConvertToAssocArrayWithKontexten(1000));
	}
	echo json_encode($assocArrayAblagen);
}
