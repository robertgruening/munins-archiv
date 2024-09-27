<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

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
        $loadUsers = new LoadUsers();

        if ($loadUsers->run())
        {
			$users = $loadUsers->getUsers();
			
			foreach ($users as $user) {
				if ($user->getUserName() == $_POST["userName"]) {
					$_SESSION["UserGuid"] = $user->getGuid();
					break;
				}
			}
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadUsers->getMessages());
        }

        $logger->info("User-anmelden beendet");
		return;
	}
}
