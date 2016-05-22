<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Kontext/class.Kontext.php");
require_once("Klassen/Kontext/class.Begehungsflaeche.php");
require_once("Klassen/Kontext/class.LfD.php");

if (isset($_POST["Id"]))
{
	$lfd = new LfD();
	$lfd->LoadById(intval($_POST["Id"]));
	echo json_encode($lfd->ConvertToAssocArray());
}
else if (isset($_POST["KontextId"]))
{
	$assocArrayLfDs = array();
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));
	
	if ($kontext->GetTyp()->GetBezeichnung() == "Begehungsfläche")
	{
		$kontext = new Begehungsflaeche();
		$kontext->LoadById(intval($_POST["KontextId"]));
	}
	
	$lfds = $kontext->GetLfDs();
	for ($i = 0; $i < count($lfds); $i++)
	{
		array_push($assocArrayLfDs, $lfds[$i]->ConvertToAssocArray());
	}
	echo json_encode($assocArrayLfDs);
}
else if (isset($_POST["TK25Nr"]) &&
		isset($_POST["Nr"]))
{
	$lfd = new LfD();
	$lfd->LoadByTK25NrAndNr(intval($_POST["TK25Nr"]), intval($_POST["Nr"]));
	if ($lfd)
		echo json_encode($lfd->ConvertToAssocArray());
	else
		echo "";
}
else
{
	$assocArrayLfDs = array();
	$lfd = new LfD();
	$lfds = $lfd->LoadAll();
	
	for ($i = 0; $i < count($lfds); $i++)
	{
		array_push($assocArrayLfDs, $lfds[$i]->ConvertToAssocArray());
	}
	echo json_encode($assocArrayLfDs);
}

