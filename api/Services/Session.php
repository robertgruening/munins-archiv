<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once("../UserStories/User/LoadUser.php");
require_once("../UserStories/User/LoadUsers.php");

session_start();

global $logger;

if (isset($_POST))
	if (isset($_POST["logoff"])) {		
		
		$logger->info("User-abmelden gestartet");
		session_unset();
		session_destroy();
		$logger->info("User-abmelden beendet");
		return;
	}

	if (isset($_POST["login"]) &&
		isset($_POST["userName"])) {
		
        $logger->info("User-anmelden gestartet");

		$userToLogin = null;
        $loadUsers = new LoadUsers();

        if ($loadUsers->run())
        {
			$users = $loadUsers->getUsers();
			
			foreach ($users as $user) {
				if ($user->getUserName() == $_POST["userName"]) {
					$userToLogin = $user;
					break;
				}
			}
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadUsers->getMessages());
        }

		if ($userToLogin == null) {
            http_response_code(401);
            echo "[ \"Anmeldung fehlgeschlagen!\" ]";
		}
		else {
			$_SESSION["UserGuid"] = $userToLogin->getGuid();
			$loadUser = new LoadUser();
			$loadUser->setGuid($userToLogin->getGuid());
			
			if ($loadUser->run())
			{
				echo json_encode($loadUser->getUser());
			}
			else
			{
				http_response_code(500);
				echo json_encode($loadUser->getMessages());
			}
		}

        $logger->info("User-anmelden beendet");
		return;
	}
}
else if (isset($_GET)) {
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
