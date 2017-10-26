<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Factory/KontextTypFactory.php");

if (isset($_GET["Id"]))
{
	$kontextTypFactory = new KontextTypFactory();
	$kontextTyp = $kontextTypFactory->loadById(intval($_GET["Id"]));
	echo json_encode($kontextTyp);
}
else
{
	$kontextTypFactory = new KontextTypFactory();
    $kontextTypen = $kontextTypFactory->loadAll();
    echo json_encode($kontextTypen);
}
