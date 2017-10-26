<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Factory/AblageFactory.php");

if (isset($_GET["Id"]))
{
	$ablageFactory = new AblageFactory();
	$ablage = $ablageFactory->loadById(intval($_GET["Id"]));
	$ablage = $ablageFactory->loadParent($ablage);
	$ablage = $ablageFactory->loadChildren($ablage);
	$ablage = $ablageFactory->loadFunde($ablage);	
	
	echo json_encode($ablage);
	return;
}

$ablageFactory = new AblageFactory();
$roots = $ablageFactory->loadRoots();

echo json_encode($roots);
