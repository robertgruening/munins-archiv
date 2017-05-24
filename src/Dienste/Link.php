<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Klassen/Kontext/class.Kontext.php");
require_once("../Klassen/Kontext/class.Begehungsflaeche.php");
require_once("../Klassen/Ablage/class.Ablage.php");
require_once("../Klassen/Fund/class.Fund.php");
require_once("../Klassen/Fund/class.FundAttribut.php");
require_once("../Klassen/Ort/class.Ort.php");

if (isset($_GET["KontextId"]) && 
	isset($_GET["AblageId"]))
{
	$ablage = new Ablage();
	$ablage->LoadById(intval($_GET["AblageId"]));
	
	$kontext = new Kontext();
	$kontext->LoadById(intval($_GET["KontextId"]));
	$kontext->AddAblage($ablage);
	return;
}

if (isset($_GET["KontextId"]) && 
	isset($_GET["FundId"]))
{
	$fund = new Fund();
	$fund->LoadById(intval($_GET["FundId"]));
	
	$kontext = new Kontext();
	$kontext->LoadById(intval($_GET["KontextId"]));
	$kontext->AddFund($fund);
	return;
}

if (isset($_GET["FundId"]) && 
	isset($_GET["AblageId"]))
{
	$fund = new Fund();
	$fund->LoadById(intval($_GET["FundId"]));
	
	$ablage = new Ablage();
	$ablage->LoadById(intval($_GET["AblageId"]));
	$ablage->AddFund($fund);
	return;
}

if (isset($_GET["KontextId"]) && 
	isset($_GET["LfDId"]))
{
	$lfd = new LfD();
	$lfd->LoadById(intval($_GET["LfDId"]));
	
	$kontext = new Begehungsflaeche();
	$kontext->LoadById(intval($_GET["KontextId"]));
	$kontext->AddLfD($lfd);
	return;
}

if (isset($_GET["FundId"]) && 
	isset($_GET["FundAttributId"]))
{
	$fundAttribut = new FundAttribut();
	$fundAttribut->LoadById(intval($_GET["FundAttributId"]));
	
	$fund = new Fund();
	$fund->LoadById(intval($_GET["FundId"]));	
	$fund->AddAttribut($fundAttribut);
	return;
}

if (isset($_GET["OrtAId"]) && 
	isset($_GET["OrtBId"]))
{
	$ortA = new Ort();
	$ortA->LoadById(intval($_GET["OrtAId"]));
	
	$ortB = new Ort();
	$ortB->LoadById(intval($_GET["OrtBId"]));
	$ortB->AddTeil($ortA);
	return;
	
}

if (isset($_GET["OrtId"]) && 
	isset($_GET["KontextId"]))
{	
	$kontext = new Kontext();
	$kontext->LoadById(intval($_GET["KontextId"]));
	
	$ort = new Ort();
	$ort->LoadById(intval($_GET["OrtId"]));
	$ort->AddKontext($kontext);
	return;
}

