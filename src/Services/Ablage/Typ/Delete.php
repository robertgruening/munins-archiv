<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Factory/AblageTypFactory.php");

if (isset($_GET["Id"]))
{
    $ablageTypFactory = new AblageTypFactory();
    $ablageTyp = $ablageTypFactory->loadById(intval($_GET["Id"]));
    return $ablageTypFactory->delete($ablageTyp);
}