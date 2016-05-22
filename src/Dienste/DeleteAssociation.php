<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Kontext/class.Kontext.php");
require_once("Klassen/Kontext/class.Begehungsflaeche.php");
require_once("Klassen/Ablage/class.Ablage.php");
require_once("Klassen/Fund/class.Fund.php");
require_once("Klassen/Fund/class.FundAttribut.php");

if (isset($_POST["FundId"]) && 
	isset($_POST["FundAttributId"]))
{
	$fundAttribut = new FundAttribut();
	$fundAttribut->LoadById(intval($_POST["FundAttributId"]));
	
	$fund = new Fund();
	$fund->LoadById(intval($_POST["FundId"]));	
	$fund->RemoveAttribut($fundAttribut);
}

