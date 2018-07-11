<?php
include_once(__DIR__."/config.php");
include_once(__DIR__."/../Logger.php");

abstract class Factory
{
    /**
     * Returns the name of the database table.
     */
	abstract public function getTableName();

	#region load
    public function loadById($id)
    {
        global $logger;
		$logger->debug("Lade Element (".$id.")");
		
        $element = null;
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadById($id));	
			
			if ($mysqli->errno)
			{
				$logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
			}
			else
			{
				$element = $this->fill($ergebnis->fetch_assoc());
			}
		}
		
		$mysqli->close();
		
		return $element;
    }
    
    abstract protected function getSQLStatementToLoadById($id);
	abstract protected function fill($dataSet);
	#endregion
	
	#region save
	/**
	 * Saves element and returns the element. If the element's ID is -1, 
	 * the method sets the ID given by the database to the element.
	 * 
	 * @param $element Element, which is to save.
	 */
	public function save($element)
	{
		if ($element->getId() == -1)
		{
			$element->setId($this->insert($element)->getId());
		}
		else
		{
			$this->update($element);
		}

		return $element;
	}

	private function insert(iNode $element)
	{
        global $logger;
		$logger->debug("Erzeuge Element");

		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToInsert($element));	
			
			if ($mysqli->errno)
			{
				$logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
			}
			else
			{
				$element->setId($mysqli->insert_id);
			}
		}
		
		$mysqli->close();

		return $element;
	}
	
	abstract protected function getSQLStatementToInsert(iNode $element);
	
	private function update($element)
	{
        global $logger;
		$logger->debug("Aktualisiere Element (".$element->GetId().")");

		$isSuccessfullyUpdated = false;
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToUpdate($element));	
			
			if ($mysqli->errno)
			{
				$logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
			}
			else
			{
				$isSuccessfullyUpdated = true;
			}
		}
		
		$mysqli->close();

		return $isSuccessfullyUpdated;
	}

	abstract protected function getSQLStatementToUpdate(iNode $element);
	#endregion

	#region delte
	public function delete($element)
	{
		global $logger;
		$logger->debug("Lösche Element (".$element->getId().")");

		$isSuccessfullyDeleted = false;

		if ($element == null)
		{
			return $isSuccessfullyDeleted;
		}

		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToDelete($element));	
			
			if ($mysqli->errno)
			{
				$logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
			}
			else
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
	#endregion

	#region convert
	abstract public function convertToInstance($object);
	#endregion
}
