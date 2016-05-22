<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Kontext/class.LfD.php");

if (isset($_POST["LfD"]))
{
	$lfdJSON = json_decode($_POST["LfD"], true);
	$lfd = new LfD();
	$lfd->SetTK25Nr(intval($lfdJSON["TK25Nr"]));
	$lfd->SetNr(intval($lfdJSON["Nr"]));	
	$lfd->Save();
	
	if ($lfd->GetId() != NULL)
	{
		echo "Das Element (".$lfd->GetId().") wurde gespeichert.";
	}
	else
	{
		$lfd->LoadByTK25NrAndNr(intval($lfdJSON["TK25Nr"]), intval($lfdJSON["Nr"]));
		echo "Das Element (".$lfd->GetId().") existiert bereits.";
	}
}
