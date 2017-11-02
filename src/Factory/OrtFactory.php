<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/OrtTypFactory.php");
include_once(__DIR__."/ITreeFactory.php");
include_once(__DIR__."/TreeFactory.php");
include_once(__DIR__."/../Model/Ort.php");

class OrtFactory extends Factory implements iTreeFactory
{
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung, Typ_Id
                FROM ".$this->getTableName()."
                WHERE Id = ".$id;
    }
    
    protected function fill($dataSet)
    {
        $ort = new Ort();
        $ort->setId(intval($dataSet["Id"]));
        $ort->setBezeichnung($dataSet["Bezeichnung"]);
        $ort->setPath($this->getPath($ort));
        
        $ortTypFactory = new OrtTypFactory();
        $ortTyp = $ortTypFactory->loadById(intval($dataSet["Typ_Id"]));
        
        $ort->setType($ortTyp);
        
        return $ort;
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
    
    public function loadRoots()
    {
        $treeFactory = new TreeFactory($this);
        
        return $treeFactory->loadRoots();
    }
    
    public function loadByKontext($kontext)
    {
        $elemente = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByKontext($kontext));	
			
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($elemente, $this->loadById(intval($datensatz["Id"])));
				}
			}
		}
		
		$mysqli->close();
		
		return $elemente;
    }
    
    protected function getSQLStatementToLoadIdsByKontext($kontext)
    {
        return "SELECT Ort_Id AS Id
                FROM Kontext_".$this->getTableName()."
                WHERE Kontext_Id = ".$kontext->getId();
    }
    
    public function getTableName()
    {
        return "Ort";
    }
}
