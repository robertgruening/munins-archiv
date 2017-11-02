<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Factory/OrtFactory.php");

if (isset($_GET["Id"]))
{
	$ortFactory = new OrtFactory();
	$ort = $ortFactory->loadById(intval($_GET["Id"]));
	$ort = $ortFactory->loadParent($ort);
	$ort = $ortFactory->loadChildren($ort);
	
	echo json_encode($ort);
	return;
}

$ortFactory = new OrtFactory();
$roots = $ortFactory->loadRoots();

echo json_encode($roots);
