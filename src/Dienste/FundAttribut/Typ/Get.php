<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Klassen/Fund/class.FundAttributTyp.php");

if (isset($_GET["Id"]))
{
	$fundAttributTyp = new FundAttributTyp();
	$fundAttributTyp->LoadById(intval($_GET["Id"]));
	echo json_encode($fundAttributTyp->ConvertToAssocArray());
}
else
{
	$assocArrayFundAttributTypen = array();
	$fundAttributTyp = new FundAttributTyp();
	$fundAttributTypen = $fundAttributTyp->LoadAll(null, null, "");
	for ($i = 0; $i < count($fundAttributTypen); $i++)
	{
		array_push($assocArrayFundAttributTypen, $fundAttributTypen[$i]->ConvertToAssocArray());
	}
	echo json_encode($assocArrayFundAttributTypen);
}
