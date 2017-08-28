<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 
    
Main();

function Main()
{
    $config = array();
    $config["MYSQL_HOST"] = "localhost";
    $config["MYSQL_BENUTZER"] = "";
    $config["MYSQL_KENNWORT"] = "";
    $config["MYSQL_DATENBANK"] = "Munins_Archiv";
    $config["DATABASE_BACKUP_FILE_PATH"] = "";
    $config["DATABASE_BACKUP_FILE_NAME"] = "Munins_Archiv_v1.0.sql";

    echo "MUNINS ARCHIV\r\n";
    echo "\r\n";
    echo "Hinweise:\r\n";
    echo "\r\n";
    echo "Dieses Upgrade-Skript ist für den Einsatz auf einem Linux-Betriebssystem konzipiert. Wenn Sie ein Windows-Betriebssystem verwenden, können Sie dieses Skript entsprechend anpassen oder Sie wenden sich an den Hersteller (http://github.com/robertgruening/Munins-Archiv/).\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    echo "Wenn Sie das Upgrade abbrechen wollen, verwenden Sie die Tastenkombination Steuerung und C (STRG+C).\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    echo "Starte Upgrade von Version 1.0 auf Version 1.1.\r\n";
    echo "\r\n";
    echo "\r\n";
    
    echo "1. Konfiguriere Parameter\r\n";
    echo "Im Folgenden müssen Sie Zugangsdaten und Einstellungen vornehmen, damit das Skript das Upgrade durchführen kann.\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    $config = FillConfig($config); 
    echo "\r\n"; 
    ListConfig($config);    
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    
    echo "2. Datenbanksicherung\r\n";
    echo "Im Folgenden wird eine Sicherungsdatei mit den Inhalten der Datenbank \"Munins_Archiv\" erzeugt.\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    CreateDatabaseBackup($config);
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";

    echo "3. Datenbankaktualisierung\r\n";
    echo "Im Folgenden wird die Struktur der Datenbank \"Munins_Archiv\" verändert.\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    UpdateDatabaseStructure($config);
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    echo "Im Folgenden werden die Bezeichnungen der Ablagen vom Typ \"Karton\" geändert. Das hat zur Folge, dass diese nicht mehr zur Laufzeit berechnet, sondern vollständig vom Anwender bestimmt werden. Folglich ist die Kartonbezeichnung nicht mehr mehr von den zugeordneten Kontexten abhängig.\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    UpdateKartonBezeichnungen($config);
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";    
    echo "Beende Upgrade von Version 1.0 auf Version 1.1.";
}

function FillConfig($config)
{
    echo "Geben Sie nachfolgend die Zugangsdaten eine MySQL-Datenbankbenutzers an, der Administratorrechte für die Datenbank \"".$config["MYSQL_DATENBANK"]."\" hat.\r\n";
    $config["MYSQL_BENUTZER"] = readline("Benutzername: ");
    $config["MYSQL_KENNWORT"] = readline("Passwort: ");
    echo "\r\n";
    echo "Geben Sie nachfolgend den Verzeichnispfad an, in dem die Sicherungsdateien für das Upgrade abgelegt werden sollen.\r\n";
    $config["DATABASE_BACKUP_FILE_PATH"] = readline("Pfad: ");
    
    if (!endsWith($config["DATABASE_BACKUP_FILE_PATH"], "/"))
    {
        $config["DATABASE_BACKUP_FILE_PATH"] .= "/";
    }
    
    return $config;
}

function ListConfig($config)
{
    echo "MYSQL_HOST: ".$config["MYSQL_HOST"]."\r\n";
    echo "MYSQL_BENUTZER: ".$config["MYSQL_BENUTZER"]."\r\n";
    echo "MYSQL_KENNWORT: ".($config["MYSQL_KENNWORT"] == "" ? "" : "*****")."\r\n";
    echo "MYSQL_DATENBANK: ".$config["MYSQL_DATENBANK"]."\r\n";
    echo "DATABASE_BACKUP_FILE_PATH: ".$config["DATABASE_BACKUP_FILE_PATH"]."\r\n";
    echo "DATABASE_BACKUP_FILE_NAME: ".$config["DATABASE_BACKUP_FILE_NAME"]."\r\n";
}

function CreateDatabaseBackup($config)
{
    $result = exec("mysqldump ".$config["MYSQL_DATENBANK"].
                   " --password=".$config["MYSQL_KENNWORT"].
                   " --user=".$config["MYSQL_BENUTZER"].
                   " --single-transaction > '".$config["DATABASE_BACKUP_FILE_PATH"].$config["DATABASE_BACKUP_FILE_NAME"]."'",$output);
}

function startsWith($haystack, $needle)
{
     $length = strlen($needle);
     
     if ($length == 0)
     {
        return true;
     }
          
     return (substr($haystack, 0, $length) === $needle);
}

function endsWith($haystack, $needle)
{
    $length = strlen($needle);
    
    if ($length == 0) 
    {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

function DoesColumnExist($config, $tableName, $columnName)
{
    $doesColumnExist = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        SELECT COUNT(*) AS Anzahl 
	        FROM information_schema.COLUMNS 
	        WHERE TABLE_SCHEMA = '".$config["MYSQL_DATENBANK"]."' AND 
	        TABLE_NAME = '".$tableName."' AND 
	        COLUMN_NAME = '".$columnName."';");
	    $datensatz = $ergebnis->fetch_assoc();
	    $doesColumnExist = intval($datensatz["Anzahl"]) == 0 ? false : true;
    }
    $mysqli->close();
    
    return $doesColumnExist;
}

function CreateColumn($config, $tableName, $columnName)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        ALTER TABLE ".$tableName." 
            ADD COLUMN ".$columnName." INT NULL;");
    }
    $mysqli->close();
    
    return $ergebnis;
}

function AddColumnToTable($config, $tableName, $columnName)
{
    if (DoesColumnExist($config, $tableName, $columnName))
    {
        echo "Die Spalte \"".$columnName."\" existiert bereits in der Tabelle \"".$tableName."\".\r\n";
    }
    else
    {
        if (CreateColumn($config, $tableName, $columnName))
        {        
            echo "Die Spalte \"".$columnName."\" wurde erfolgreich in der Tabelle \"".$tableName."\" angelegt.\r\n";
        }
        else
        {
            echo "Es ist ein Fehler aufgetreten beim Anlegen der Spalte \"".$columnName."\" in der Tabelle \"".$tableName."\".\r\n";
        }
    }
}

function UpdateDatabaseStructure($config)
{
    AddColumnToTable($config, "Fund", "Dimension1");
    AddColumnToTable($config, "Fund", "Dimension2");
    AddColumnToTable($config, "Fund", "Dimension3");
    AddColumnToTable($config, "Fund", "Masse");
}

function UpdateKartonBezeichnungen($config)
{
    $kartons = GetKartons($config);
    
    for ($i = 0; $i < count($kartons); $i++)
    {
        echo "Bearbeite Karton mit Id ".$kartons[$i]["Id"]."\r\n";
        $kontextFullBezeichnung = GetKontextFullBezeichnungByAblageId($config, $kartons[$i]["Id"]);
        
        if ($kontextFullBezeichnung != "" &&
            $kartons[$i]["Bezeichnung"] != null &&
            $kartons[$i]["Bezeichnung"] != "")
        {
            echo "Kartonbezeichnung: ".$kartons[$i]["Bezeichnung"]."\r\n";
            echo "Zugehörige vollständige Kontextbezeichnung: ".$kontextFullBezeichnung."\r\n";
            
            if (startsWith($kartons[$i]["Bezeichnung"], $kontextFullBezeichnung))
            {      
                echo "Die Kartonbezeichnung (".$kartons[$i]["Bezeichnung"].") beginnt bereits mit der vollständigen Kontextbezeichnung (".$kontextFullBezeichnung.").\r\n";  
            }
            else
            {    
                $kartons[$i]["Bezeichnung"] = $kontextFullBezeichnung."-".$kartons[$i]["Bezeichnung"];
                echo "Neue Kartonbezeichnung: ".$kartons[$i]["Bezeichnung"]."\r\n";            
                SaveNewBezeichnung($config, $kartons[$i]["Id"], $kartons[$i]["Bezeichnung"]);
            }
            
            echo "\r\n";
        }
    }    
}

function GetKartons($config)
{
    $kartons = array();
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        SELECT Ablage.Id AS Id, Ablage.Bezeichnung AS Bezeichnung
	        FROM Ablage LEFT JOIN AblageTyp ON Ablage.Typ_Id = AblageTyp.Id	        
	        WHERE AblageTyp.Bezeichnung = 'Karton';");
	        
	    if (!$mysqli->errno)
		{
			while ($datensatz = $ergebnis->fetch_assoc())
			{
				$karton["Id"] = intval($datensatz["Id"]);
				$karton["Bezeichnung"] = $datensatz["Bezeichnung"];
				array_push($kartons, $karton);
			}
		}
    }
    $mysqli->close();
    
    return $kartons;
}

function GetKontextFullBezeichnungByAblageId($config, $ablageId)
{
    $kontext = GetKontextByAblage($config, $ablageId);
    
    if ($kontext == null)
    {
        return "";
    }
    
    return GetKontextFullBezeichnung($config, $kontext["Id"]);
}

function GetKontextFullBezeichnung($config, $id)
{
    $fullBezeichnung = "";
    $kontext = GetKontext($config, $id);
    
    if ($kontext["Parent_Id"] == null)
    {
        $fullBezeichnung = $kontext["Bezeichnung"];
    }
    else
    {
        $fullBezeichnung = GetKontextFullBezeichnung($config, $kontext["Parent_Id"]);
        
        if ($fullBezeichnung != null &&
            $fullBezeichnung != "" &&
            $kontext["Bezeichnung"] != null &&
            $kontext["Bezeichnung"] != "")
        {
            $fullBezeichnung .= "-".$kontext["Bezeichnung"];
        }            
    }
    
    return $fullBezeichnung;
}

function GetKontext($config, $id)
{
    $kontext = null;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        SELECT Id, Bezeichnung, Parent_Id
	        FROM Kontext
	        WHERE Id = ".$id.";");
	        
	    if (!$mysqli->errno)
		{
			$datensatz = $ergebnis->fetch_assoc();
			$kontext = $datensatz;
		}
    }
    $mysqli->close();
    
    return $kontext;
}

function GetKontextByAblage($config, $ablageId)
{
    $kontext = null;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        SELECT Kontext.Id AS Id, Kontext.Bezeichnung AS Bezeichnung, Kontext.Parent_Id AS Parent_Id
	        FROM Kontext LEFT JOIN Ablage_Kontext ON Kontext.Id = Ablage_Kontext.Kontext_Id
	        WHERE Ablage_Kontext.Ablage_Id = ".$ablageId."
	        LIMIT 1;");
	        
	    if (!$mysqli->errno)
		{
			$datensatz = $ergebnis->fetch_assoc();
			$kontext = $datensatz;
		}
    }
    $mysqli->close();
    
    return $kontext;
}

function SaveNewBezeichnung($config, $id, $newBezeichnung)
{
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        Update Ablage
	        SET Bezeichnung = '".$newBezeichnung."'
	        WHERE Id = ".$id.";");
    }
    $mysqli->close();
}