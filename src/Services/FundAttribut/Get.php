<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Factory/FundAttributFactory.php");

if (isset($_GET["Id"]))
{
	$fundAttributFactory = new FundAttributFactory();
	$fundAttribut = $fundAttributFactory->loadById(intval($_GET["Id"]));
	$fundAttribut = $fundAttributFactory->loadParent($fundAttribut);
	$fundAttribut = $fundAttributFactory->loadChildren($fundAttribut);
	
	echo json_encode($fundAttribut);
	return;
}

$fundAttributFactory = new FundAttributFactory();
$roots = $fundAttributFactory->loadRoots();

echo json_encode($roots);
