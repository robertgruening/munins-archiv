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
	public function countBySearchConditions($searchConditions = array())
	{
		global $logger;
		$logger->debug("Zähle Elemente anhand von Suchkriterien ".json_encode($searchConditions));
		$count = 0;
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSqlStatementToCountBySearchConditions($searchConditions));
			
			if ($mysqli->errno)
			{
				$logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
			}
			else if ($datensatz = $ergebnis->fetch_assoc())
			{
				$count = intval($datensatz["Count"]);
			}
		}
		
		$mysqli->close();
		
		return $count;
	}

	protected function getSqlStatementToCountBySearchConditions($searchConditions = array())
	{
		$sqlStatement = $this->getSqlStatementToCount();		
		$searchConditionStrings = $this->getSqlSearchConditionStrings($searchConditions);
		
		if (count($searchConditionStrings) == 0)
		{
			return $sqlStatement;
		}

		$sqlStatement .= " WHERE ".implode(" AND ", $searchConditionStrings);
		
		return $sqlStatement;
	}
	
	private function getSqlStatementToCount()
	{
		return "SELECT COUNT(*) AS Count FROM ".$this->getTableName();
	}

	/**
	* Returns all elements matching the given search conditions.
	*
	* @param $searchConditions List (key, value) of search conditions. Default is array().
	* @param $pagingConditions List (key, value) with paging conditions. Default is null.
	* @param $sortingConditions List (key, value) with sorting conditions. Default is null.
	*/
	public function loadBySearchConditions($searchConditions = array(), $pagingConditions = null, $sortingConditions = null)
	{
		global $logger;
		$logger->debug("Lade Elemente anhand von Suchkriterien ".json_encode($searchConditions));
		$logger->debug("Lade Elemente mittels Seitenkriterien ".json_encode($pagingConditions));
		$logger->debug("Lade Elemente mittels Sortierkriterien ".json_encode($sortingConditions));
		$elemente = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSqlStatementToLoadBySearchConditions($searchConditions, $pagingConditions, $sortingConditions));
			
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
	* @param $sortingConditions List (key, value) with sorting conditions. Default is null.
	*/
	protected function getSqlStatementToLoadBySearchConditions($searchConditions = array(), $pagingConditions = null, $sortingConditions = null)
	{
		global $logger;
		$sqlStatement = $this->getSqlStatementToLoad();		
		$searchConditionStrings = $this->getSqlSearchConditionStrings($searchConditions);

		if (count($searchConditionStrings) == 0)
		{
			if ($pagingConditions != null)
			{
				if (isset($pagingConditions["PageIndexElementId"]) &&
					is_numeric($pagingConditions["PageIndexElementId"]))
				{
					$sqlStatement .= " WHERE ".$this->getSqlPageIndexCondition($pagingConditions, $sortingConditions);
				}

				$sqlStatement .= " ".$this->getSqlPageOrderConditionString($pagingConditions, $sortingConditions);
				$sqlStatement .= " LIMIT ".$pagingConditions["PageSize"];
			}

			$sqlStatement = "(".$sqlStatement.") ORDER BY Id ASC";

			$logger->debug("SQL: ".$sqlStatement);

			return $sqlStatement;
		}

		$sqlStatement .= " WHERE ".implode(" AND ", $searchConditionStrings);

		if ($pagingConditions != null)
		{
			if (isset($pagingConditions["PageIndexElementId"]) &&
				is_numeric($pagingConditions["PageIndexElementId"]))
			{
				$sqlStatement .= " AND ".$this->getSqlPageIndexCondition($pagingConditions, $sortingConditions);
			}
			
			$sqlStatement .= " ".$this->getSqlPageOrderConditionString($pagingConditions, $sortingConditions);
			$sqlStatement .= " LIMIT ".$pagingConditions["PageSize"];
		}

		$sqlStatement = "(".$sqlStatement.") ORDER BY Id ASC";

		$logger->debug("SQL: ".$sqlStatement);
		
		return $sqlStatement;
	}
	
	abstract protected function getSqlStatementToLoad();
	abstract protected function getSqlSearchConditionStrings($searchConditions);

	/**
	 * 
	 * 
	 * @param $pagingConditions List (key, value) with paging conditions. Default is null.
	 * @param $sortingConditions List (key, value) with sorting conditions. Default is null.
	 */
	protected function getSqlPageIndexCondition($pagingConditions = null, $sortingConditions = null)
	{
		if (($this->isSortingDirectionAscending($sortingConditions) &&
			 $this->isPagingDirectionForward($pagingConditions)) ||
			(!$this->isSortingDirectionAscending($sortingConditions) &&
			 !$this->isPagingDirectionForward($pagingConditions)))
		{
			return $this->getTableName().".Id >= ".$pagingConditions["PageIndexElementId"];			
		}		

		return $this->getTableName().".Id <= ".$pagingConditions["PageIndexElementId"];
	}

	protected function isSortingDirectionAscending($sortingConditions = null)
	{
		if ($sortingConditions == null ||
			!isset($sortingConditions["SortingOrder"]) ||
			strtoupper($sortingConditions["SortingOrder"]) == "ASC")
		{
			return true;	
		}

		if (strtoupper($sortingConditions["SortingOrder"]) == "DESC")
		{
			return false;
		}

		throw new InvalidArgumentException("Value of 'SortingOrder' (".$sortingConditions["SortingOrder"].") is not supported!");
	}

	protected function isPagingDirectionForward($pagingConditions = null)
	{
		if ($pagingConditions == null ||
			!isset($pagingConditions["PagingDirection"]) ||
			strtolower($pagingConditions["PagingDirection"]) == "forward")
		{
			return true;	
		}

		if (strtolower($pagingConditions["PagingDirection"]) == "backward")
		{
			return false;
		}

		throw new InvalidArgumentException("Value of 'PagingDirection' (".$pagingConditions["PagingDirection"].") is not supported!");
	}

	/**
	 * 
	 * 
	 * @param $pagingConditions List (key, value) with paging conditions. Default is null.
	 * @param $sortingConditions List (key, value) with sorting conditions. Default is null.
	 */
	protected function getSqlPageOrderConditionString($pagingConditions = null, $sortingConditions = null)
	{
		if (($this->isSortingDirectionAscending($sortingConditions) &&
			 $this->isPagingDirectionForward($pagingConditions)) ||
			(!$this->isSortingDirectionAscending($sortingConditions) &&
			 !$this->isPagingDirectionForward($pagingConditions)))
		{
			return "ORDER BY ".$this->getTableName().".Id ASC";
		}
		
		return "ORDER BY ".$this->getTableName().".Id DESC";
	}
	
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
