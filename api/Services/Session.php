<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once("../Factory/UserFactory.php");
require_once("../UserStories/User/LoadUser.php");
require_once("../UserStories/User/LoadUsers.php");

session_start();

if (isset($_POST)) {
	if (isset($_POST["logoff"])) {		
		logoff();
	}
	else if (isset($_POST["login"])) {
		login();
	}
}
else if (isset($_GET)) {
	getSessionState();
}

function logoff() {
	global $logger;
	$logger->info("User-abmelden gestartet");
	session_unset();
	session_destroy();
	$logger->info("User-abmelden beendet");
}

function login() {
	global $logger;
	$logger->info("User-anmelden gestartet");
		
	if (!isset($_POST["userName"])) {
		http_response_code(401);
		return;
	}		

	$userByUserName = null;
	$loadUsers = new LoadUsers();

	if ($loadUsers->run())
	{
		$users = $loadUsers->getUsers();
		
		foreach ($users as $user) {
			if ($user->getUserName() == $_POST["userName"]) {
				$userByUserName = $user;
				break;
			}
		}
	}
	else
	{
		http_response_code(401);
	}

	if ($userByUserName == null) {
		http_response_code(401);
	}
	else {
		$_SESSION["UserGuid"] = $userByUserName->getGuid();
		$loadUser = new LoadUser();
		$loadUser->setGuid($userByUserName->getGuid());
		
		if ($loadUser->run())
		{
			echo json_encode($loadUser->getUser());
		}
		else
		{
			http_response_code(401);
		}
	}

	$logger->info("User-anmelden beendet");
}

function getSession() {
	global $logger;
	$logger->info("Session-abfragen gestartet");

	if (!isset($_SESSION["UserGuid"])) {
		http_response_code(403);
		return;
	}

	$loadUser = new LoadUser();
	$loadUser->setGuid($_SESSION["UserGuid"]);
	
	if ($loadUser->run())
	{
		echo json_encode($loadUser->getUser());
	}
	else
	{
		http_response_code(500);
		echo json_encode($loadUser->getMessages());
	}
	
	$logger->info("Session-abfragen beendet");
}
