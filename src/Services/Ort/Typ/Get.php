<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Factory/OrtTypFactory.php");

if (isset($_GET["Id"]))
{
	$ortTypFactory = new OrtTypFactory();
	$ortTyp = $ortTypFactory->loadById(intval($_GET["Id"]));
	echo json_encode($ortTyp);
}
else
{
	$ortTypFactory = new OrtTypFactory();
    $ortTypen = $ortTypFactory->loadAll();
    echo json_encode($ortTypen);
}
