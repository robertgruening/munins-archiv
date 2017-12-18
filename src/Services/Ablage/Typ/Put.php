<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Factory/AblageTypFactory.php");

$ablageTyp = new AblageTyp();
$ablageTyp->setBezeichnung($_POST["Bezeichnung"]);

$ablageTypFactory = new AblageTypFactory();
$ablageTyp = $ablageTypFactory->create($ablageTyp);
echo json_encode($ablageTyp);
