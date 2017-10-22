<?php
include_once(__DIR__."/config.php");

abstract class Factory
{
    public function loadById($id)
    {
        $element = null;
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadById($id));	
			
			if (!$mysqli->errno)
			{
				$element = $this->fill($ergebnis->fetch_assoc());
			}
		}
		
		$mysqli->close();
		
		return $element;
    }
    
    abstract protected function getSQLStatementToLoadById($id);
    abstract protected function fill($dataSet);
}
