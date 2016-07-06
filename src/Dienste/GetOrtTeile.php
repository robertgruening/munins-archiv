<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ort/class.Ort.php");

if (isset($_POST["Id"]) &&
	$_POST["Id"] != NULL)
{
	$ort = new Ort();
	$ort->LoadById(intval($_POST["Id"]));
	
	$parts = $ort->GetTeile();
	$assocArrayParts = array();
	
	for ($i = 0; $i < count($parts); $i++)
	{
		array_push($assocArrayParts, $parts[$i]->ConvertToAssocArray(0));
	}
	echo json_encode($assocArrayParts);
}
