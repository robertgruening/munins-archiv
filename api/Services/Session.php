<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

session_start();

global $logger;

if (isset($_POST) &&
  	isset($_POST["logoff"])) {
		
  	session_unset();
  	session_destroy();
  	return;
}
