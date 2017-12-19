<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/FundAttributTypFactory.php");
include_once(__DIR__."/ITreeFactory.php");
include_once(__DIR__."/TreeFactory.php");
include_once(__DIR__."/../Model/FundAttribut.php");

class FundAttributFactory extends Factory implements iTreeFactory
{
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung, Typ_Id
                FROM FundAttribut
                WHERE Id = ".$id;
    }
    
    protected function fill($dataSet)
    {
        $fundAttribut = new FundAttribut();
        $fundAttribut->setId(intval($dataSet["Id"]));
        $fundAttribut->setBezeichnung($dataSet["Bezeichnung"]);
        $fundAttribut->setPath($this->getPath($fundAttribut));
        
        $fundAttributTypFactory = new FundAttributTypFactory();
        $fundAttributTyp = $fundAttributTypFactory->loadById(intval($dataSet["Typ_Id"]));
        
        $fundAttribut->setType($fundAttributTyp);
        
        return $fundAttribut;
    }
    
    public function loadParent($element)
    {
        $treeFactory = new TreeFactory($this);
        $parent = $treeFactory->loadParent($element);
        $element->setParent($parent);
        
        return $element;
    }

    public function loadChildren($element)
    {
        $treeFactory = new TreeFactory($this);
        $children = $treeFactory->loadChildren($element);
        $element->setChildren($children);
        
        return $element;
    }

    public function getPath($element)
    {
        $treeFactory = new TreeFactory($this);
        
        return $treeFactory->getPath($element);
    }
    
    public function loadByFund($fund)
    {
        $fundAttribute = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByFund($fund));	
			
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($fundAttribute, $this->loadById(intval($datensatz["Id"])));
				}
			}
		}
		
		$mysqli->close();
		
		return $fundAttribute;
    }
    
    protected function getSQLStatementToLoadIdsByFund($fund)
    {
        return "SELECT FundAttribut_Id AS Id
                FROM Fund_FundAttribut
                WHERE Fund_Id = ".$fund->getId();
    }
    
    public function loadRoots()
    {
        $treeFactory = new TreeFactory($this);
        
        return $treeFactory->loadRoots();
    }
    
    protected function getSQLStatementToCreate($element)
    {
        throw new Exception();
    }
    
    public function getTableName()
    {
        return "FundAttribut";
    }
}
