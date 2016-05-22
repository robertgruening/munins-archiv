<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Fund/class.FundAttribut.php");

if (isset($_POST["Id"]))
{
	$ids = preg_split("/[;]/", $_POST["Id"]);
	$assocArrayFundAttribute = array();	
	for ($i = 0; $i < count($ids); $i++)
	{
		$rootFundAttribut = new FundAttribut();
		$rootFundAttribut->LoadById($ids[$i]);
		$assocArrayRootFundAttribut = $rootFundAttribut->ConvertToAssocArray(0);
		
		$isRoot = false;
		while ($isRoot == false)
		{	
			if ($rootFundAttribut->GetParent() == NULL)
			{
				$isRoot = true;
			}
			else
			{
				$rootFundAttribut = $rootFundAttribut->GetParent();
				$tmp = $rootFundAttribut->ConvertToAssocArray(0);
				$tmp["Children"] = array();
				array_push($tmp["Children"], $assocArrayRootFundAttribut);
				$assocArrayRootFundAttribut = $tmp;
			}
		}
		array_push($assocArrayFundAttribute, $assocArrayRootFundAttribut);
	}
	echo json_encode($assocArrayFundAttribute);
}
else
{
	$attribut = new FundAttribut();
	$rootFundAttributien = $attribut->LoadRoots();
	$assocArrayFundAttribute = array();	
	for ($i = 0; $i < count($rootFundAttributien); $i++)
	{
		array_push($assocArrayFundAttribute, $rootFundAttributien[$i]->ConvertToAssocArray(0));
	}
	echo json_encode($assocArrayFundAttribute);
}
