<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Factory/KontextTypFactory.php");

$kontextTyp = new KontextTyp();
$kontextTyp->setBezeichnung($_POST["Bezeichnung"]);

$kontextTypFactory = new KontextTypFactory();
$kontextTyp = $kontextTypFactory->create($kontextTyp);
echo json_encode($kontextTyp);
