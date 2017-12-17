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
    echo "\r\n";
    echo "Falls Sie das Upgrade abbrechen wollen, verwenden Sie die Tastenkombination Steuerung und C (STRG+C).\r\n";
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
    echo "Im Folgenden wird eine Sicherungsdatei mit dem Inhalt der Datenbank \"Munins_Archiv\" erzeugt.\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    CreateDatabaseBackup($config);
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";

    echo "3. Datenbankaktualisierung\r\n";
    echo "Im Folgenden werden alle Grabungsdaten gelöscht. Aufgrund der Komplexität von Grabungsdaten muss diese für die Anwendung \"Munins Archiv\" neu bewertet und entwickelt werden.\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    DeleteGrabungen($config);
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";

    echo "Im Folgenden wird die Tabelle \"Fund\" um neue Felder erweitert.\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    UpgradeTableFund($config);
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";

    echo "Im Folgenden wird die Segmentierung der Nummern des Landesamtes für Denkmalpflege (LfD) aufgehoben. Außerdem werden die bisherigen LfD-Erfassungsnummern zu LfD-Nummern umgewandelt. Mit diesen Änderungen soll dem Umstand Rechnung getragen werden, dass die Landesämter ihr Nummerierungssystem ändern und unterschiedliche Landesämter unterschiedliche Nummerierungssystem haben.\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    UpgradeLfDNummern($config);
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";

    echo "Im Folgenden werden die Bezeichnungen der Ablagen vom Typ \"Karton\" so geändert, dass diese nicht mehr zur Laufzeit vom System berechnet werden, sondern vollständig vom Anwender bestimmt werden. Folglich ist die Kartonbezeichnung nicht mehr von den zugeordneten Kontexten abhängig.\r\n";
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

    echo "Im Folgenden wird die Struktur der Datenbank \"Munins_Archiv\" aufgeräumt. Tabellen, Spalten und Indexe werden dabei gelöscht.\r\n";
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";
    CleanUpDatabaseStructure($config);
    readline("Weiter mit [EINGABE] ...");
    echo "\r\n";

    echo "Beende Upgrade von Version 1.0 auf Version 1.1.\r\n";
}

#region configuration
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
#endregion

#region backup
function CreateDatabaseBackup($config)
{
    $result = exec("mysqldump ".$config["MYSQL_DATENBANK"].
                   " --password=".$config["MYSQL_KENNWORT"].
                   " --user=".$config["MYSQL_BENUTZER"].
                   " --single-transaction > '".$config["DATABASE_BACKUP_FILE_PATH"].$config["DATABASE_BACKUP_FILE_NAME"]."'",$output);
}
#endregion

#region SQL operations
#region table operations
function RenameTable($config, $oldTableName, $newTableName)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        RENAME TABLE ".$oldTableName." TO ".$newTableName.";");
    }
    $mysqli->close();
    
    return $ergebnis;
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
#endregion

#region column operations
function RenameColumnInTable($config, $tableName, $oldColumnName, $newColumnName)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
            ALTER TABLE ".$tableName."
            CHANGE COLUMN ".$oldColumnName." ".$newColumnName." VARCHAR(30) NOT NULL;");
    }
    $mysqli->close();
    
    return $ergebnis;
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

function CreateColumn($config, $tableName, $columnName, $dataType)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        ALTER TABLE ".$tableName." 
            ADD COLUMN ".$columnName." ".$dataType." NULL;");
    }
    $mysqli->close();
    
    return $ergebnis;
}

function AddColumnToTable($config, $tableName, $columnName, $dataType)
{
    if (DoesColumnExist($config, $tableName, $columnName))
    {
        echo "Die Spalte \"".$columnName."\" existiert bereits in der Tabelle \"".$tableName."\".\r\n";
    }
    else
    {
        if (CreateColumn($config, $tableName, $columnName, $dataType))
        {        
            echo "Die Spalte \"".$columnName."\" wurde erfolgreich in der Tabelle \"".$tableName."\" angelegt.\r\n";
        }
        else
        {
            echo "Es ist ein Fehler aufgetreten beim Anlegen der Spalte \"".$columnName."\" in der Tabelle \"".$tableName."\".\r\n";
        }
    }
}

function DropColumn($config, $tableName, $columnName)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        ALTER TABLE ".$tableName." 
            DROP COLUMN ".$columnName.";");
    }
    $mysqli->close();
    
    return $ergebnis;
}

function RemoveColumnFromTable($config, $tableName, $columnName)
{
    if (DoesColumnExist($config, $tableName, $columnName))
    {
        if (DropColumn($config, $tableName, $columnName))
        {        
            echo "Die Spalte \"".$columnName."\" wurde erfolgreich aus der Tabelle \"".$tableName."\" entfernt.\r\n";
        }
        else
        {
            echo "Es ist ein Fehler aufgetreten beim Entfernen der Spalte \"".$columnName."\" aus der Tabelle \"".$tableName."\".\r\n";
        }
    }
    else
    {
        echo "Die Spalte \"".$columnName."\" ist bereits aus der Tabelle \"".$tableName."\" entfernt.\r\n";
    }
}
#endregion

#region index operations
function DoesIndexExist($config, $tableName, $indexName)
{
    $doesIndexExist = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
            SELECT COUNT(*) AS Anzahl 
            FROM INFORMATION_SCHEMA.STATISTICS
            WHERE TABLE_SCHEMA = '".$config["MYSQL_DATENBANK"]."' AND
                TABLE_NAME = '".$tableName."' AND
                INDEX_NAME = '".$indexName."';");
	    $datensatz = $ergebnis->fetch_assoc();
	    $doesIndexExist = intval($datensatz["Anzahl"]) == 0 ? false : true;
    }
    $mysqli->close();
    
    return $doesIndexExist;
}

function CreateUniqueIndex($config, $tableName, $indexName, $columnName)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        CREATE UNIQUE INDEX ".$indexName." 
            ON ".$tableName." (".$columnName.");");
    }
    $mysqli->close();
    
    return $ergebnis;
}

function AddUniqueIndexToTable($config, $tableName, $indexName, $columnName)
{
    if (DoesIndexExist($config, $tableName, $indexName))
    {
        echo "Der eindeutige Index \"".$indexName."\" existiert bereits in der Tabelle \"".$tableName."\".\r\n";
    }
    else
    {
        if (CreateUniqueIndex($config, $tableName, $indexName, $columnName))
        {        
            echo "Der eindeutige Index \"".$indexName."\" wurde erfolgreich in der Tabelle \"".$tableName."\" angelegt.\r\n";
        }
        else
        {
            echo "Es ist ein Fehler aufgetreten beim Anlegen des eindeutigen Index' \"".$indexName."\" in der Tabelle \"".$tableName."\".\r\n";
        }
    }
}

function DropIndex($config, $tableName, $indexName)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        ALTER TABLE ".$tableName." 
            DROP INDEX ".$indexName.";");
    }
    $mysqli->close();
    
    return $ergebnis;
}

function RemoveIndexFromTable($config, $tableName, $indexName)
{
    if (DoesIndexExist($config, $tableName, $indexName))
    {
        if (DropIndex($config, $tableName, $indexName))
        {        
            echo "Der Index \"".$indexName."\" wurde erfolgreich aus der Tabelle \"".$tableName."\" entfernt.\r\n";
        }
        else
        {
            echo "Es ist ein Fehler aufgetreten beim Entfernen des Index' \"".$indexName."\" aus der Tabelle \"".$tableName."\".\r\n";
        }
    }
    else
    {
        echo "Der Index \"".$indexName."\" ist bereits aus der Tabelle \"".$tableName."\" entfernt.\r\n";
    }
}
#endregion
#endregion

#region data operations
#region Ablage
function GetAblageByType($config, $ablageType)
{
    $ablagen = array();
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
        SELECT Ablage.Id AS Id, Ablage.Bezeichnung AS Bezeichnung
        FROM Ablage LEFT JOIN AblageTyp ON Ablage.Typ_Id = AblageTyp.Id	        
        WHERE AblageTyp.Bezeichnung = '".$ablageType."';");
	        
	    if (!$mysqli->errno)
		{
			while ($datensatz = $ergebnis->fetch_assoc())
			{
				$ablage["Id"] = intval($datensatz["Id"]);
				$ablage["Bezeichnung"] = $datensatz["Bezeichnung"];
				array_push($ablagen, $ablage);
			}
		}
    }
    $mysqli->close();
    
    return $ablagen;
}
#endregion

#region Kontext
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

function GetKontexteByType($config, $kontextType)
{
    $kontexte = array();
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        SELECT Kontext.Id AS Id, Kontext.Bezeichnung AS Bezeichnung
	        FROM Kontext LEFT JOIN KontextTyp ON Kontext.Typ_Id = KontextTyp.Id	        
	        WHERE KontextTyp.Bezeichnung = '".$kontextType."';");
	        
	    if (!$mysqli->errno)
		{
			while ($datensatz = $ergebnis->fetch_assoc())
			{
				$kontext["Id"] = intval($datensatz["Id"]);
				$kontext["Bezeichnung"] = $datensatz["Bezeichnung"];
				array_push($kontexte, $kontext);
			}
		}
    }
    $mysqli->close();
    
    return $kontexte;
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

function UnlinkAblagenFromKontext($config, $kontext)
{
    $ablagen = array();
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        DELETE
	        FROM Ablage_Kontext
	        WHERE Kontext_Id = ".$kontext["Id"].";");
	        
	    if (!$mysqli->errno)
		{
			echo "Verknüpfungen des Kontexts (".$kontext["Id"].") mit Ablagen sind gelöscht.\r\n";
		}
    }
    $mysqli->close();
    
    return $ablagen;
}

function UnlinkOrteFromKontext($config, $kontext)
{
    $ablagen = array();
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        DELETE
	        FROM Kontext_Ort
	        WHERE Kontext_Id = ".$kontext["Id"].";");
	        
	    if (!$mysqli->errno)
		{
			echo "Verknüpfungen des Kontexts (".$kontext["Id"].") mit Orten sind gelöscht.\r\n";
		}
    }
    $mysqli->close();
    
    return $ablagen;
}

function UnlinkLfDsFromKontext($config, $kontext)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
            DELETE
            FROM Kontext_LfD
            WHERE Kontext_Id = ".$kontext["Id"].";");

        if (!$mysqli->errno)
        {
            echo "Verknüpfungen des Kontexts (".$kontext["Id"].") mit LfDs sind gelöscht.\r\n";
        }
    }
    $mysqli->close();
    
    return $ergebnis;
}

function DeleteKontext($config, $kontext)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        DELETE
            FROM Kontext
            WHERE Id = ".$kontext["Id"].";");
    }
    $mysqli->close();
    
    return $ergebnis;
}

function DeleteKontextByType($config, $kontextTypeName)
{
    $kontexte = GetKontexteByType($config, $kontextTypeName);

    for ($i = 0; $i < count($kontexte); $i++)
    {
        $funde = GetFundeByKontext($config, $kontexte[$i]);

        for ($j = 0; $j < count($funde); $j++)
        {
            UnlinkFundAttributeFromFund($config, $funde[$j]);

            if (DeleteFund($config, $funde[$j]))
            {
                echo "Fund (".$funde[$j]["Id"].") ist gelöscht.\r\n";
            }
            else
            {
                echo "Fehler: Fund (".$funde[$j]["Id"].") wurde nicht gelöscht.\r\n";
            }
        }

        UnlinkAblagenFromKontext($config, $kontexte[$i]);        
        UnlinkOrteFromKontext($config, $kontexte[$i]);
        UnlinkLfDsFromKontext($config, $kontexte[$i]);

        if (DeleteKontext($config, $kontexte[$i]))
        {
            echo "Kontext (".$kontexte[$i]["Id"].") ist gelöscht.\r\n";
        }
        else
        {
            echo "Fehler: Kontext (".$kontexte[$i]["Id"].") ist nicht gelöscht.\r\n";
        }
    }
}
#endregion

#region KontextTyp
function DeleteKontextType($config, $kontextTypeName)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
        $ergebnis = $mysqli->query("
            DELETE
            FROM KontextTyp
            WHERE Bezeichnung = '".$kontextTypeName."';");
            
        if (!$mysqli->errno)
        {
            echo "Kontexttyp \"".$kontextTypeName."\" ist gelöscht.\r\n";
        }
    }
    $mysqli->close();
    
    return $ergebnis;
}
#endregion

#region Fund
function GetFundeByKontext($config, $kontext)
{
    $funde = array();
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        SELECT Id
	        FROM Fund
	        WHERE Kontext_Id = ".$kontext["Id"].";");
	        
	    if (!$mysqli->errno)
		{
			while ($datensatz = $ergebnis->fetch_assoc())
			{
				$fund["Id"] = intval($datensatz["Id"]);
				array_push($funde, $fund);
			}
		}
    }
    $mysqli->close();
    
    return $funde;
}

function UnlinkFundAttributeFromFund($config, $fund)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
        $ergebnis = $mysqli->query("
            DELETE
            FROM Fund_FundAttribut
            WHERE Fund_Id = ".$fund["Id"].";");
            
        if (!$mysqli->errno)
        {
            echo "Verknüpfungen des Fundes (".$fund["Id"].") mit Fundattributen sind gelöscht.\r\n";
        }
    }
    $mysqli->close();
    
    return $ergebnis;
}

function DeleteFund($config, $fund)
{
    $ergebnis = false;
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
        $ergebnis = $mysqli->query("
	        DELETE
            FROM Fund
            WHERE Id = ".$fund["Id"].";");
    }
    $mysqli->close();
    
    return $ergebnis;
}
#endregion
#endregion

#region tasks
#region clean up
function CleanUpDatabaseStructure($config)
{
    RemoveTable($config, "Fundstelle_Flurstuecke");
    RemoveTable($config, "Fundstelle");
    RemoveTable($config, "Ort_Ort");
}
#endregion

#region delete "Grabungen"
function DeleteGrabungen($config)
{
    echo "Lösche Kontexte vom Typ \"Laufende Nummer\".\r\n";
    DeleteKontextByType($config, "Laufende Nummer");
    DeleteKontextType($config, "Laufende Nummer");
    echo "\r\n";

    echo "Lösche Kontexte vom Typ \"Befund\".\r\n";
    DeleteKontextByType($config, "Befund");
    DeleteKontextType($config, "Befund");
    echo "\r\n";

    echo "Lösche Kontexte vom Typ \"Fläche\".\r\n";
    DeleteKontextByType($config, "Fläche");
    DeleteKontextType($config, "Fläche");
    echo "\r\n";

    echo "Lösche Kontexte vom Typ \"Grabung\".\r\n";
    DeleteKontextByType($config, "Grabung");
    DeleteKontextType($config, "Grabung");
    echo "\r\n";
}
#endregion

#region upgrade "Fund"
function UpgradeTableFund($config)
{
    AddColumnToTable($config, "Fund", "Dimension1", "INT");
    AddColumnToTable($config, "Fund", "Dimension2", "INT");
    AddColumnToTable($config, "Fund", "Dimension3", "INT");
    AddColumnToTable($config, "Fund", "Masse", "INT");
}
#endregion

#region upgrade "Bezeichnung" of "Kartons"
function UpgradeKartonBezeichnungen($config)
{
    $kartons = GetAblageByType($config, "Karton");
    
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

    RemoveTable($config, "Karton");
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
#endregion

#region upgrade "Bezeichnung" of "FundAttribut", "Kontext", "Ablage", "Ort"
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
#endregion

#region upgrade "LfdNummer"
function UpgradeLfDNummern($config)
{
    RenameTable($config, "LfD", "LfdNummer");
    RenameTable($config, "Kontext_LfD", "Kontext_LfdNummer");
    RenameColumnInTable($config, "Kontext_LfdNummer", "LfD_Id", "LfdNummer_Id");
    AddColumnToTable($config, "LfdNummer", "Bezeichnung", "NVARCHAR(30)");
    AddUniqueIndexToTable($config, "LfdNummer", "LfDNummer", "Bezeichnung");

    if (DoesColumnExist($config, "LfdNummer", "TK25Nr") &&
        DoesColumnExist($config, "LfdNummer", "Nr"))
    {
        TransformLfDNummern($config);
        RemoveIndexFromTable($config, "LfdNummer", "TK25Nummer");
        RemoveColumnFromTable($config, "LfdNummer", "TK25Nr");
        RemoveColumnFromTable($config, "LfdNummer", "Nr");
    }
    else
    {
        echo "Die LfD-Nummernsegmente sind bereits zusammengeführt.\r\n";
    }

    if (DoesColumnExist($config, "Begehung", "LfDErfassungsJahr") &&
        DoesColumnExist($config, "Begehung", "LfDErfassungsNr"))
    {
        TransformLfDErfassungsNummern($config);
        RemoveColumnFromTable($config, "Begehung", "LfDErfassungsJahr");
        RemoveColumnFromTable($config, "Begehung", "LfDErfassungsNr");
    }
    else
    {
        echo "Die LfD-Erfassungsnummern sind bereits zu LfD-Nummern transformiert.\r\n";
    }
}

function TransformLfDNummern($config)
{
    $lfdNummern = GetLfDNummern($config);
    
    for ($i = 0; $i < count($lfdNummern); $i++)
    {
        $lfdNummern[$i]["Bezeichnung"] = sprintf("%s\\%04s", $lfdNummern[$i]["TK25Nr"], $lfdNummern[$i]["Nr"]);
        
        echo $lfdNummern[$i]["Bezeichnung"]."\r\n";
        
        SetNewLfDNummer($config, $lfdNummern[$i]);
    }
}

function GetLfDNummern($config)
{
    $elements = array();
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        SELECT Id, TK25Nr, Nr
	        FROM LfdNummer;");
	        
	    if (!$mysqli->errno)
		{
			while ($datensatz = $ergebnis->fetch_assoc())
			{
				$element["Id"] = intval($datensatz["Id"]);
				$element["TK25Nr"] = $datensatz["TK25Nr"];
				$element["Nr"] = $datensatz["Nr"];
				array_push($elements, $element);
			}
		}
    }
    $mysqli->close();
    
    return $elements;
}

function SetNewLfDNummer($config, $lfdNummer)
{
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        Update LfdNummer
	        SET Bezeichnung = '".$mysqli->real_escape_string($lfdNummer["Bezeichnung"])."'
	        WHERE Id = ".$lfdNummer["Id"].";");
    }
    $mysqli->close();
}

function TransformLfDErfassungsNummern($config)
{
    $lfdErfassungsNummern = GetLfDErfassungsNummern($config);
    
    for ($i = 0; $i < count($lfdErfassungsNummern); $i++)
    {
        $lfdErfassungsNummern[$i]["Bezeichnung"] = sprintf("%s\\%04s", $lfdErfassungsNummern[$i]["LfDErfassungsJahr"], $lfdErfassungsNummern[$i]["LfDErfassungsNr"]);
        
        echo $lfdErfassungsNummern[$i]["Bezeichnung"]." verknüpft mit Kontext (".$lfdErfassungsNummern[$i]["Kontext_Id"].").\r\n";

        $lfdErfassungsNummern[$i] = GetNewLfDErfassungsNummer($config, $lfdErfassungsNummern[$i]);

        if ($lfdErfassungsNummern[$i]["Id"] == null)
        {        
            $lfdErfassungsNummern[$i] = SetNewLfDErfassungsNummer($config, $lfdErfassungsNummern[$i]);
        }

        LinkNewLfdErfassungsNummer($config, $lfdErfassungsNummern[$i]);
    }
}

function GetLfDErfassungsNummern($config)
{
    $elements = array();
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        SELECT Id AS Kontext_Id, LfDErfassungsJahr, LfDErfassungsNr
            FROM Begehung
            ORDER BY LfDErfassungsJahr, LfDErfassungsNr;");
	        
	    if (!$mysqli->errno)
		{
			while ($datensatz = $ergebnis->fetch_assoc())
			{
                if ($datensatz["LfDErfassungsJahr"] != null &&
                    $datensatz["LfDErfassungsNr"] != null)
                {
                    $element["Kontext_Id"] = intval($datensatz["Kontext_Id"]);
                    $element["LfDErfassungsJahr"] = intval($datensatz["LfDErfassungsJahr"]);
                    $element["LfDErfassungsNr"] = intval($datensatz["LfDErfassungsNr"]);
                    array_push($elements, $element);
                }
			}
		}
    }
    $mysqli->close();
    
    return $elements;
}

function LinkNewLfdErfassungsNummer($config, $lfdNummer)
{
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        INSERT INTO Kontext_LfD (Kontext_Id, LfD_Id)
            VALUES (".$lfdNummer["Kontext_Id"].", ".$lfdNummer["Id"].");");
    }
    $mysqli->close();
}

function SetNewLfDErfassungsNummer($config, $lfdNummer)
{
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
	        INSERT INTO LfdNummer(Bezeichnung)
            VALUES ('".$mysqli->real_escape_string($lfdNummer["Bezeichnung"])."');");

        if (!$mysqli->errno)
        {
            $lfdNummer["Id"] = intval($mysqli->insert_id);
        }
    }
    $mysqli->close();

    return $lfdNummer;
}

function GetNewLfDErfassungsNummer($config, $lfdNummer)
{
    $mysqli = new mysqli($config["MYSQL_HOST"], $config["MYSQL_BENUTZER"], $config["MYSQL_KENNWORT"], $config["MYSQL_DATENBANK"]);

    if (!$mysqli->connect_errno)
    {
	    $mysqli->set_charset("utf8");
	    $ergebnis = $mysqli->query("
            SELECT Id            
            FROM LfdNummer
            WHERE Bezeichnung = '".$mysqli->real_escape_string($lfdNummer["Bezeichnung"])."';");
	        
	    if (!$mysqli->errno)
		{
            $datensatz = $ergebnis->fetch_assoc();
            $lfdNummer["Id"] = intval($datensatz["Id"]);
		}
    }
    $mysqli->close();
    
    return $lfdNummer;
}
#endregion
#endregion