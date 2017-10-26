<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Factory/FundAttributTypFactory.php");

if (isset($_GET["Id"]))
{
	$fundAttributTypFactory = new FundAttributTypFactory();
	$fundAttributTyp = $fundAttributTypFactory->loadById(intval($_GET["Id"]));
	echo json_encode($fundAttributTyp);
}
else
{
	$fundAttributTypFactory = new FundAttributTypFactory();
    $fundAttributTypen = $fundAttributTypFactory->loadAll();
    echo json_encode($fundAttributTypen);
}
