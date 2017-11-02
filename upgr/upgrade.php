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
    UpgradeDatabaseStructure($config);
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    echo "Im Folgenden werden die Bezeichnungen der Ablagen vom Typ \"Karton\" geändert. Das hat zur Folge, dass diese nicht mehr zur Laufzeit berechnet, sondern vollständig vom Anwender bestimmt werden. Folglich ist die Kartonbezeichnung nicht mehr mehr von den zugeordneten Kontexten abhängig.\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    UpgradeKartonBezeichnungen($config);
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    echo "Im Folgenden werden die Bezeichnungen daraufhin geprüft, dass sie gesetzt sind und, dass sie unter den Kindelementen eindeutig ist. Muss ein Element geändert werden, so fordert das Skript dazu auf. Diese Aktualisierung erfolgt für Fundattribute, Kontexte, Ablagen und Orte.\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    UpgradeAllBezeichnungen($config);
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    echo "Beende Upgrade von Version 1.0 auf Version 1.1.\r\n";
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
    echo "MYSQL_HOST: .............. ".$config["MYSQL_HOST"]."\r\n";
    echo "MYSQL_BENUTZER: .......... ".$config["MYSQL_BENUTZER"]."\r\n";
    echo "MYSQL_KENNWORT: .......... ".($config["MYSQL_KENNWORT"] == "" ? "" : "*****")."\r\n";
    echo "MYSQL_DATENBANK: ......... ".$config["MYSQL_DATENBANK"]."\r\n";
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

function DeleteTable($config, $tableName)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        DROP TABLE ".$tableName.";");
    }
    $mysqli->close();
    
    return $ergebnis;
}

function DoesTableExist($config, $tableName)
{
    $doesTableExist = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        SELECT COUNT(*) AS Anzahl 
	        FROM information_schema.TABLES
	        WHERE TABLE_SCHEMA = '".$config["MYSQL_DATENBANK"]."' AND 
	        TABLE_NAME = '".$tableName."';");
	    $datensatz = $ergebnis->fetch_assoc();
	    $doesTableExist = intval($datensatz["Anzahl"]) == 0 ? false : true;
    }
    $mysqli->close();
    
    return $doesTableExist;
}

function RemoveTable($config, $tableName)
{
    if (!DoesTableExist($config, $tableName))
    {
        echo "Die Tabelle \"".$tableName."\" ist bereits entfernt.\r\n";
    }
    else
    {
        if (DeleteTable($config, $tableName))
        {        
            echo "Die Tabelle \"".$tableName."\" wurde erfolgreich entfernt.\r\n";
        }
        else
        {
            echo "Es ist ein Fehler aufgetreten beim Löschen der Tabelle \"".$tableName."\".\r\n";
        }
    }
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

function UpgradeDatabaseStructure($config)
{
    RemoveTable($config, "Fundstelle_Flurstuecke");
    AddColumnToTable($config, "Fund", "Dimension1");
    AddColumnToTable($config, "Fund", "Dimension2");
    AddColumnToTable($config, "Fund", "Dimension3");
    AddColumnToTable($config, "Fund", "Masse");
}

function UpgradeKartonBezeichnungen($config)
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
            echo "Kartonbezeichnung: ............. ".$kartons[$i]["Bezeichnung"]."\r\n";
            echo "Vollständige Kontextbezeichnung: ".$kontextFullBezeichnung."\r\n";
            
            if (startsWith($kartons[$i]["Bezeichnung"], $kontextFullBezeichnung))
            {      
                echo "Die Kartonbezeichnung (".$kartons[$i]["Bezeichnung"].") beginnt bereits mit der vollständigen Kontextbezeichnung (".$kontextFullBezeichnung.").\r\n";  
            }
            else
            {    
                $kartons[$i]["Bezeichnung"] = $kontextFullBezeichnung."-".$kartons[$i]["Bezeichnung"];
                echo "Neue Kartonbezeichnung: ........ ".$kartons[$i]["Bezeichnung"]."\r\n";            
                SaveNewKartonBezeichnung($config, $kartons[$i]["Id"], $kartons[$i]["Bezeichnung"]);
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

function SaveNewKartonBezeichnung($config, $id, $newBezeichnung)
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

function UpgradeAllBezeichnungen($config)
{
    echo "Aktualisiere Fundattribute.\r\n";
    UpgradeBezeichnungen($config, "FundAttribut", null, array());
    
    echo "Aktualisiere Kontexte.\r\n";
    UpgradeBezeichnungen($config, "Kontext", null, array());
    
    echo "Aktualisiere Ablagen.\r\n";
    UpgradeBezeichnungen($config, "Ablage", null, array());
    
    echo "Aktualisiere Orte.\r\n";
    UpgradeBezeichnungen($config, "Ort", null, array());    
}

function UpgradeBezeichnungen($config, $tableName, $parentId, $pathElements)
{
    $elements = GetElements($config, $tableName, $parentId);    
    $siblingsBezeichnungen = array();       
    
    for ($i = 0; $i < count($elements); $i++)
    {
        WriteElementInformation($elements[$i], $pathElements);
        echo "\r\n";
        
        if ($elements[$i]["Bezeichnung"] == null ||
            $elements[$i]["Bezeichnung"] == "" ||
            in_array($elements[$i]["Bezeichnung"], $siblingsBezeichnungen))
        {
            $elements[$i]["Bezeichnung"] = GetNewBezeichnung($elements[$i], $pathElements, $siblingsBezeichnungen);
            SetNewBezeichnung($config, $tableName, $elements[$i]);
        }
        
        array_push($siblingsBezeichnungen, $elements[$i]["Bezeichnung"]);
        array_push($pathElements, $elements[$i]);
        UpgradeBezeichnungen($config, $tableName, $elements[$i]["Id"], $pathElements);
        array_pop($pathElements);
    }   
}

function GetElements($config, $tableName, $parentId)
{
    $elements = array();
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        SELECT ".$tableName.".Id AS Id, ".$tableName.".Bezeichnung AS Bezeichnung, ".$tableName."Typ.Bezeichnung AS Typ
	        FROM ".$tableName." LEFT JOIN ".$tableName."Typ ON ".$tableName.".Typ_Id = ".$tableName."Typ.Id
	        WHERE ".$tableName.".Parent_Id ".($parentId == null ? "IS NULL" : "= ".$parentId).";");
	        
	    if (!$mysqli->errno)
		{
			while ($datensatz = $ergebnis->fetch_assoc())
			{
				$element["Id"] = intval($datensatz["Id"]);
				$element["Bezeichnung"] = $datensatz["Bezeichnung"];
				$element["Typ"] = $datensatz["Typ"];
				array_push($elements, $element);
			}
		}
    }
    $mysqli->close();
    
    return $elements;
}

function GetNewBezeichnung($element, $pathElements, $siblingsBezeichnungen)
{
    $newBezeichnung = $element["Bezeichnung"];
        
    while (in_array($newBezeichnung, $siblingsBezeichnungen) || 
            $newBezeichnung == null ||
            $newBezeichnung == "")
    {
        if ($element["Bezeichnung"] == null ||
            $element["Bezeichnung"] == "")
        {
            echo "Das folgende Element hat keine Bezeichnung.\r\n";
        }
        else if (in_array($newBezeichnung, $siblingsBezeichnungen))        
        {
            echo "Das folgende Element hat die gleiche Bezeichnung wie ein benachbartes Element.\r\n";
        } 
        else if (strpos($newBezeichnung, "/") === true)
        {
            echo "Das folgende Element enthält ein nicht erlaubtes Zeichen (\"/\").\r\n";
        } 
    
        WriteElementInformation($element, $pathElements);
        $newBezeichnung = readline("neue Bezeichnung: ");
        echo "\r\n";
    }
    
    return $newBezeichnung;
}

function WriteElementInformation($element, $pathElements)
{        
    echo "Id: ........ ".$element["Id"]."\r\n";
    echo "Bezeichnung: ".$element["Bezeichnung"]."\r\n";
    echo "Typ: ....... ".$element["Typ"]."\r\n";
    echo "Pfad: ...... ";
    
    for ($i = 0; $i < count($pathElements); $i++)
    {
        echo $pathElements[$i]["Bezeichnung"];
        
        if ($i < (count($pathElements) - 1))
        {
            echo "/";
        }
    }
    
    echo "\r\n";
}

function SetNewBezeichnung($config, $tableName, $element)
{
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        Update ".$tableName."
	        SET Bezeichnung = '".$element["Bezeichnung"]."'
	        WHERE Id = ".$element["Id"].";");
    }
    $mysqli->close();
}
