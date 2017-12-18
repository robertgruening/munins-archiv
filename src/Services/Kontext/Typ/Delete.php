<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Factory/KontextTypFactory.php");

if (isset($_GET["Id"]))
{
    $kontextTypFactory = new KontextTypFactory();
    $kontextTyp = $kontextTypFactory->loadById(intval($_GET["Id"]));
    return $kontextTypFactory->delete($kontextTyp);
}