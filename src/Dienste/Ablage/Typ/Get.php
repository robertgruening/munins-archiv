<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Klassen/Ablage/class.AblageTyp.php");

if (isset($_GET["Id"]))
{
	$ablageTyp = new AblageTyp();
	$ablageTyp->LoadById(intval($_GET["Id"]));
	echo json_encode($ablageTyp->ConvertToAssocArray());
}
else
{
	$assocArrayAblageTypen = array();
	$ablageTyp = new AblageTyp();
	$ablageTypen = $ablageTyp->LoadAll(NULL, NULL, "");
	for ($i = 0; $i < count($ablageTypen); $i++)
	{
		array_push($assocArrayAblageTypen, $ablageTypen[$i]->ConvertToAssocArray());
	}
	echo json_encode($assocArrayAblageTypen);
}
