<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Factory/FundAttributTypFactory.php");

$fundAttributTyp = new FundAttributTyp();
$fundAttributTyp->setBezeichnung($_POST["Bezeichnung"]);

$fundAttributTypFactory = new FundAttributTypFactory();
$fundAttributTyp = $fundAttributTypFactory->create($fundAttributTyp);
echo json_encode($fundAttributTyp);
