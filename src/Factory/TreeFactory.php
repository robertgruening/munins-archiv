<?php
include_once(__DIR__."/config.php");
include_once(__DIR__."/ITreeFactory.php");

class TreeFactory implements iTreeFactory
{
    private $_modelFactory = null;
    
    function __construct($modelFactory)
    {
        $this->_modelFactory = $modelFactory;
    }

    public function loadParent($element)
    {
        $parent = null;
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadParentId($element));
			
			if (!$mysqli->errno)
			{
			    $parentId = $ergebnis->fetch_assoc()["Parent_Id"];
			    
			    if ($parentId != null)
			    {
			        $parent = $this->_modelFactory->loadById(intval($parentId));
			    }				
			}
		}
		
		$mysqli->close();
		
		return $parent;
    }
    
    private function getSQLStatementToLoadParentId($element)
    {
        return "SELECT Parent_Id
                FROM ".$this->_modelFactory->getTableName()."
                WHERE Id = ".$element->getId();
    }

    public function loadChildren($element)
    {
        $children = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadChildIds($element));
			
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$child = $this->_modelFactory->loadById(intval($datensatz["Id"]));
					
					if ($child != null)
					{
    					array_push($children, $child);
					}
				}				
			}
		}
		
		$mysqli->close();
		
		return $children;
    }
    
    private function getSQLStatementToLoadChildIds($element)
    {
        return "SELECT Id
                FROM ".$this->_modelFactory->getTableName()."
                WHERE Parent_Id = ".$element->getId();
    }
    
    public function getPath($element)
    {
        $path = "";
        
        $parent = $this->loadParent($element);
            
        if ($parent != null)
        {
            $path .= $this->getPath($parent)."/";
        }
                
        $path .= $element->getBezeichnung();
        
        return $path;
    }
}
