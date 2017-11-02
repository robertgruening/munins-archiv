<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Factory/KontextFactory.php");

if (isset($_GET["Id"]))
{
	$kontextFactory = new KontextFactory();
	$kontext = $kontextFactory->loadById(intval($_GET["Id"]));
	$kontext = $kontextFactory->loadParent($kontext);
	$kontext = $kontextFactory->loadChildren($kontext);
	$kontext = $kontextFactory->loadFunde($kontext);
    $kontext = $kontextFactory->loadOrte($kontext);
    $kontext = $kontextFactory->loadAblagen($kontext);
	
	echo json_encode($kontext);
	return;
}

$kontextFactory = new KontextFactory();
$roots = $kontextFactory->loadRoots();

echo json_encode($roots);
