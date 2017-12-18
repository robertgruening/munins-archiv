<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Factory/LfdNummerFactory.php");

if (isset($_GET["Id"]))
{
    $lfdNummerFactory = new LfdNummerFactory();
    $lfdNummer = $lfdNummerFactory->loadById(intval($_GET["Id"]));
    return $lfdNummerFactory->delete($lfdNummer);
}