<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Klassen/Kontext/class.Kontext.php");
require_once("../../Klassen/Kontext/class.Begehungsflaeche.php");
require_once("../../Klassen/Kontext/class.LfD.php");

if (isset($_GET["Id"]))
{
	$lfd = new LfD();
	$lfd->LoadById(intval($_GET["Id"]));
	
	echo json_encode($lfd->ConvertToAssocArray());
	return;
}

if (isset($_GET["TK25Nr"]) &&
	isset($_GET["Nr"]))
{
	$lfd = new LfD();
	$lfd->LoadByTK25NrAndNr(intval($_POST["TK25Nr"]), intval($_POST["Nr"]));
	if ($lfd)
		echo json_encode($lfd->ConvertToAssocArray());
	else
		echo "";
		
	return;
}

$assocArrayLfDs = array();
$lfds = array();
	
if (isset($_GET["KontextId"]))
{
	$kontext = new Kontext();
	$kontext->LoadById(intval($_GET["KontextId"]));
	
	if ($kontext->GetTyp()->GetBezeichnung() == "Begehungsfläche")
	{
		$kontext = new Begehungsflaeche();
		$kontext->LoadById(intval($_GET["KontextId"]));
	}
	
	$lfds = $kontext->GetLfDs();
}
else
{
	$lfd = new LfD();
	$lfds = $lfd->LoadAll();
}

for ($i = 0; $i < count($lfds); $i++)
{
	array_push($assocArrayLfDs, $lfds[$i]->ConvertToAssocArray());
}

echo json_encode($assocArrayLfDs);
