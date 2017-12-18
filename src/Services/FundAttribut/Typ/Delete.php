<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../../Factory/FundAttributTypFactory.php");

if (isset($_GET["Id"]))
{
    $fundAttributTypFactory = new FundAttributTypFactory();
    $fundAttributTyp = $fundAttributTypFactory->loadById(intval($_GET["Id"]));
    return $fundAttributTypFactory->delete($fundAttributTyp);
}