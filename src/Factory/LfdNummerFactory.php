<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/../Model/LfdNummer.php");

class LfdNummerFactory extends Factory implements iListFactory
{
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung
                FROM ".$this->getTableName()."
                WHERE Id = ".$id;
    }
    
    protected function fill($dataSet)
    {
        $lfdNummer = new LfdNummer();
        $lfdNummer->setId(intval($dataSet["Id"]));
        $lfdNummer->setBezeichnung($dataSet["Bezeichnung"]);
        
        return $lfdNummer;
    }
    
    public function loadByKontext($kontext)
    {
        $lfdNummern = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByKontext($kontext));	
			
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($lfdNummern, $this->loadById(intval($datensatz["Id"])));
				}
			}
		}
		
		$mysqli->close();
		
		return $lfdNummern;
    }
    
    protected function getSQLStatementToLoadIdsByKontext($kontext)
    {
        return "SELECT LfdNummer_Id AS Id
                FROM Kontext_LfdNummer
                WHERE Kontext_Id = ".$kontext->getId().";";
    }

    public function loadAll()
    {
        $listFactory = new ListFactory($this);
        
        return $listFactory->loadAll();
    }
    
    public function getTableName()
    {
        return "LfdNummer";
    }
}
