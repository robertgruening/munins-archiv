<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Klassen/Ort/class.Ort.php");

if (isset($_GET["Id"]) &&
	$_GET["Id"] != NULL)
{
	$ort = new Ort();
	$ort->LoadById(intval($_GET["Id"]));
	
	$parts = $ort->GetTeile();
	$assocArrayParts = array();
	
	for ($i = 0; $i < count($parts); $i++)
	{
		array_push($assocArrayParts, $parts[$i]->ConvertToAssocArray());
	}
	
	echo json_encode($assocArrayParts);
}
