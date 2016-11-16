<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Ort/class.OrtTyp.php");

if (isset($_POST["Id"]))
{
	$ortTyp = new OrtTyp();
	$ortTyp->LoadById(intval($_POST["Id"]));
	echo json_encode($ortTyp->ConvertToAssocArray());
}
else
{
	$assocArrayOrtTypen = array();
	$ortTyp = new OrtTyp();
	$ortTypen = $ortTyp->LoadAll(null, null, "");
	for ($i = 0; $i < count($ortTypen); $i++)
	{
		array_push($assocArrayOrtTypen, $ortTypen[$i]->ConvertToAssocArray());
	}
	echo json_encode($assocArrayOrtTypen);
}
