<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/../Model/KontextTyp.php");

class KontextTypFactory extends Factory implements iListFactory
{
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung
                FROM ".$this->getTableName()."
                WHERE Id = ".$id;
    }
    
    public function loadByNodeId($nodeId)
    {
        $element = null;
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadByNodeId($nodeId));	
			
			if (!$mysqli->errno)
			{
				$element = $this->fill($ergebnis->fetch_assoc());
			}
		}
		
		$mysqli->close();
		
		return $element;
    }
    
    protected function getSQLStatementToLoadByNodeId($nodeId)
    {
        return "SELECT ".$this->getTableName().".Id AS Id, ".$this->getTableName().".Bezeichnung AS Bezeichnung
                FROM ".$this->getTableName()." LEFT JOIN Kontext ON ".$this->getTableName().".Id = Kontext.Typ_Id
                WHERE Kontext.Id = ".$nodeId;
    }
    
    protected function fill($dataSet)
    {
        $kontextTyp = new KontextTyp();
        $kontextTyp->setId(intval($dataSet["Id"]));
        $kontextTyp->setBezeichnung($dataSet["Bezeichnung"]);
        
        return $kontextTyp;
    }

    public function loadAll()
    {
        $listFactory = new ListFactory($this);

        return $listFactory->loadAll();
    }
    
    public function getTableName()
    {
        return "KontextTyp";
    }
}
