<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Kontext/class.Kontext.php");
require_once("Klassen/Kontext/class.Begehungsflaeche.php");
require_once("Klassen/Ablage/class.Ablage.php");
require_once("Klassen/Fund/class.Fund.php");
require_once("Klassen/Fund/class.FundAttribut.php");

if (isset($_POST["KontextId"]) && 
	isset($_POST["AblageId"]))
{
	$ablage = new Ablage();
	$ablage->LoadById(intval($_POST["AblageId"]));
	
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));
	$kontext->AddAblage($ablage);
}
else if (isset($_POST["KontextId"]) && 
	isset($_POST["FundId"]))
{
	$fund = new Fund();
	$fund->LoadById(intval($_POST["FundId"]));
	
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));
	$kontext->AddFund($fund);
}
else if (isset($_POST["FundId"]) && 
	isset($_POST["AblageId"]))
{
	$fund = new Fund();
	$fund->LoadById(intval($_POST["FundId"]));
	
	$ablage = new Ablage();
	$ablage->LoadById(intval($_POST["AblageId"]));
	$ablage->AddFund($fund);
}
else if (isset($_POST["KontextId"]) && 
	isset($_POST["LfDId"]))
{
	$lfd = new LfD();
	$lfd->LoadById(intval($_POST["LfDId"]));
	
	$kontext = new Begehungsflaeche();
	$kontext->LoadById(intval($_POST["KontextId"]));
	$kontext->AddLfD($lfd);
}
else if (isset($_POST["FundId"]) && 
	isset($_POST["FundAttributId"]))
{
	$fundAttribut = new FundAttribut();
	$fundAttribut->LoadById(intval($_POST["FundAttributId"]));
	
	$fund = new Fund();
	$fund->LoadById(intval($_POST["FundId"]));	
	$fund->AddAttribut($fundAttribut);
}

