<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once("../Factory/UserFactory.php");
require_once("../UserStories/User/LoadUser.php");
require_once("../UserStories/User/LoadUsers.php");

session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	if (isset($_POST["signIn"])) {		
		signIn();
	}
	else if (isset($_POST["signOff"])) {
		signOff();
	}
}
else if ($_SERVER["REQUEST_METHOD"] == "GET") {
	getSessionState();
}

function signOff() {
	global $logger;
	$logger->info("User-abmelden gestartet");
	session_unset();
	session_destroy();
	$logger->info("User-abmelden beendet");
}

function signIn() {
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

function getSessionState() {
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
