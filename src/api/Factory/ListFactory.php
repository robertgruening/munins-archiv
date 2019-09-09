<?php
include_once(__DIR__."/config.php");
include_once(__DIR__."/IListFactory.php");

class ListFactory implements iListFactory
{
    #region variables
    private $_modelFactory = null;
    #endregion

    #region properties
    protected function getModelFactory()
    {
        return $this->_modelFactory;
    }
    #endregion
    
    #region constructors
    function __construct($modelFactory)
    {
        $this->_modelFactory = $modelFactory;
    }
    #endregion

    #region methods
    #region load
    public function loadAll()
    {
        $elements = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadAll());	
			
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($elements, $this->getModelFactory()->loadById(intval($datensatz["Id"])));
				}
			}
		}
		
		$mysqli->close();
		
		return $elements;
    }
    
    private function getSQLStatementToLoadAll()
    {
        return "SELECT Id
                FROM ".$this->getModelFactory()->getTableName().";";
    }
    #endregion
    #endregion
}
