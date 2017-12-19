<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/../Model/Fund.php");
include_once(__DIR__."/FundAttributFactory.php");

class FundFactory extends Factory
{
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Anzahl, Bezeichnung, Dimension1, Dimension2, Dimension3, Masse
                FROM Fund
                WHERE Id = ".$id;
    }
    
    protected function fill($dataSet)
    {
        $fund = new Fund();
        $fund->setId(intval($dataSet["Id"]));
        $fund->setBezeichnung($dataSet["Bezeichnung"]);
        $fund->setAnzahl($dataSet["Anzahl"]);
        $fund->setDimension1($dataSet["Dimension1"]);
        $fund->setDimension2($dataSet["Dimension2"]);
        $fund->setDimension3($dataSet["Dimension3"]);
        $fund->setMasse($dataSet["Masse"]);
        $fund = $this->loadFundAttribute($fund);
        
        return $fund;
    }
    
    public function loadByAblage($ablage)
    {
        $funde = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByAblage($ablage));	
			
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($funde, $this->loadById(intval($datensatz["Id"])));
				}
			}
		}
		
		$mysqli->close();
		
		return $funde;
    }
    
    protected function getSQLStatementToLoadIdsByAblage($ablage)
    {
        return "SELECT Id
                FROM Fund
                WHERE Ablage_Id = ".$ablage->getId();
    }
    
    public function loadByKontext($kontext)
    {
        $funde = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByKontext($kontext));	
			
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($funde, $this->loadById(intval($datensatz["Id"])));
				}
			}
		}
		
		$mysqli->close();
		
		return $funde;
    }
    
    protected function getSQLStatementToLoadIdsByKontext($kontext)
    {
        return "SELECT Id
                FROM Fund
                WHERE Kontext_Id = ".$kontext->getId();
    }

    public function loadFundAttribute($element)
    {
        $fundAttributFactory = new FundAttributFactory();
        $funde = $fundAttributFactory->loadByFund($element);
        $element->setFundAttribute($funde);
        
        return $element;
    }

    protected function getSQLStatementToCreate($element)
    {
        throw new Exception();
    }
    
    public function getTableName()
    {
        return "Fund";
    }
}
