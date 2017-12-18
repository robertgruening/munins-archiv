<?php
include_once(__DIR__."/config.php");

abstract class Factory
{
	abstract public function getTableName();

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
	
	/**
	 * Inserts the given element into the database,
	 * sets the ID - defined by the database - in the 
	 * element and returns the element.
	 * 
	 * If there is a duplicate key error (error number: 1062)
	 * the method returns null.
	 */
	public function create($element)
	{
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToCreate($element));	
			
			if (!$mysqli->errno)
			{
				$element->setId(intval($mysqli->insert_id));
			}
			else if ($mysqli->errno == 1062)
			{
				$element = null;
			}
		}
		
		$mysqli->close();
		
		return $element;
	}

	abstract protected function getSQLStatementToCreate($element);
	
	public function delete($element)
	{
		$isSuccessfullyDeleted = false;
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToDelete($element));	
			
			if (!$mysqli->errno)
			{
				$isSuccessfullyDeleted = true;
			}
		}
		
		$mysqli->close();

		return $isSuccessfullyDeleted;
	}

	protected function getSQLStatementToDelete($element)
	{
		return "DELETE
				FROM ".$this->getTableName()."
				WHERE Id = ".$element->getId().";";
	}
}
