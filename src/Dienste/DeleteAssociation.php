<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Kontext/class.Kontext.php");
require_once("Klassen/Kontext/class.Begehungsflaeche.php");
require_once("Klassen/Ablage/class.Ablage.php");
require_once("Klassen/Fund/class.Fund.php");
require_once("Klassen/Fund/class.FundAttribut.php");
require_once("Klassen/Ort/class.Ort.php");

if (isset($_POST["FundId"]) && 
	isset($_POST["FundAttributId"]))
{
	$fundAttribut = new FundAttribut();
	$fundAttribut->LoadById(intval($_POST["FundAttributId"]));
	
	$fund = new Fund();
	$fund->LoadById(intval($_POST["FundId"]));	
	$fund->RemoveAttribut($fundAttribut);
	return;
}

if (isset($_POST["OrtAId"]) && 
	isset($_POST["OrtBId"]))
{
	$ortA = new Ort();
	$ortA->LoadById(intval($_POST["OrtAId"]));
	
	$ortB = new Ort();
	$ortB->LoadById(intval($_POST["OrtBId"]));
	$ortB->RemoveTeil($ortA);
	return;
}

if (isset($_POST["OrtId"]) && 
	isset($_POST["KontextId"]))
{	
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["KontextId"]));
	
	$ort = new Ort();
	$ort->LoadById(intval($_POST["OrtId"]));
	$ort->RemoveKontext($kontext);
	return;
}

