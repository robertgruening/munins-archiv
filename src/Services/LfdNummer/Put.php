<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Factory/LfdNummerFactory.php");

$lfdNummer = new LfdNummer();
$lfdNummer->setBezeichnung($_POST["Bezeichnung"]);

$lfdNummerFactory = new LfdNummerFactory();
$lfdNummer = $lfdNummerFactory->create($lfdNummer);
echo json_encode($lfdNummer);
