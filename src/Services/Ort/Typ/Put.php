<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Factory/OrtTypFactory.php");

$ortTyp = new OrtTyp();
$ortTyp->setBezeichnung($_POST["Bezeichnung"]);

$ortTypFactory = new OrtTypFactory();
$ortTyp = $ortTypFactory->create($ortTyp);
echo json_encode($ortTyp);
