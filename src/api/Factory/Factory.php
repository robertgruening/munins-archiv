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
	/**
	* Returns all elements matching the given search conditions.
	*
	* @param $searchConditions List (key, value) of search conditions. Default is array().
	* @param $pagingConditions List (key, value) with paging conditions. Default is null.
	*/
	public function loadBySearchConditions($searchConditions = array(), $pagingConditions = null)
	{
		global $logger;
		$logger->debug("Lade Elemente anhand von Suchkriterien ".json_encode($searchConditions));
		$logger->debug("Lade Elemente mittels Seitenkriterien ".json_encode($pagingConditions));
		$elemente = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSqlStatementToLoadBySearchConditions($searchConditions, $pagingConditions));
			
			if ($mysqli->errno)
			{
				$logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
			}
			else
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($elemente, $this->fill($datensatz));
				}
			}
		}
		
		$mysqli->close();
		
		return $elemente;
	}
	
	/**
	* Returns the SQL SELECT statement with search conditions as string.
	*
	* @param $searchConditions List (key, value) of search conditions. Default is array().
	* @param $pagingConditions List (key, value) with paging conditions. Default is null.
	*/
	protected function getSqlStatementToLoadBySearchConditions($searchConditions = array(), $pagingConditions = null)
	{
		$sqlStatement = $this->getSqlStatementToLoad();		
		$searchConditionStrings = $this->getSqlSearchConditionStrings($searchConditions);
		
		if (count($searchConditionStrings) == 0)
		{
			if ($pagingConditions != null)
			{
				if (isset($pagingConditions["PageIndexElementId"]) &&
					is_numeric($pagingConditions["PageIndexElementId"]))
				{
					$sqlStatement .= " WHERE ".$this->getTableName().".Id >= ".$pagingConditions["PageIndexElementId"];
				}

				$sqlStatement .= " ORDER BY ".$this->getTableName().".Id";
				$sqlStatement .= " LIMIT ".$pagingConditions["PageSize"];
			}

			return $sqlStatement;
		}

		$sqlStatement .= " WHERE ".implode(" AND ", $searchConditionStrings);

		if ($pagingConditions != null)
		{
			if (isset($pagingConditions["PageIndexElementId"]) &&
				is_numeric($pagingConditions["PageIndexElementId"]))
			{
				$sqlStatement .= " AND ".$this->getTableName().".Id >= ".$pagingConditions["PageIndexElementId"];
			}
			
			$sqlStatement .= " ORDER BY ".$this->getTableName().".Id";
			$sqlStatement .= " LIMIT ".$pagingConditions["PageSize"];
		}
		
		return $sqlStatement;
	}
	
	abstract protected function getSqlStatementToLoad();
	abstract protected function getSqlSearchConditionStrings($searchConditions);
	
	public function loadById($id)
	{
		$searchConditions = array();
		$searchConditions["Id"] = $id;
		
		$elements = $this->loadBySearchConditions($searchConditions);
		
		if ($elements == null ||
			count($elements) == 0)
		{
			return null;
		}

		return $elements[0];
	}

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

	protected function insert(iNode $element)
	{
		global $logger;
		$logger->debug("Erzeuge Element");

		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->multi_query($this->getSQLStatementToInsert($element));

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

	protected function update($element)
	{
		global $logger;
		$logger->debug("Aktualisiere Element (".$element->GetId().")");

		$isSuccessfullyUpdated = false;
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->multi_query($this->getSQLStatementToUpdate($element));

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
			$ergebnis = $mysqli->multi_query($this->getSQLStatementToDelete($element));

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
