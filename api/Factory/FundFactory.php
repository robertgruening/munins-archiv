<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/../Model/Fund.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/ISqlSearchConditionStringsProvider.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/FundAttributFactory.php");
include_once(__DIR__."/AblageFactory.php");
include_once(__DIR__."/KontextFactory.php");

class FundFactory extends Factory implements iListFactory
{
    #region variables
    private $_listFactory = null;
    private $_fundAttributFactory = null;
    private $_ablageFactory = null;
    private $_kontextFactory = null;
    private $_userFactory = null;
    #endregion

    #region properties
    protected function getListFactory()
    {
        return $this->_listFactory;
    }

    protected function getFundAttributFactory()
    {
        return $this->_fundAttributFactory;
    }

    protected function getAblageFactory()
    {
        if ($this->_ablageFactory == null)
        {
            $this->_ablageFactory = new AblageFactory();
        }

        return $this->_ablageFactory;
    }

    protected function getKontextFactory()
    {
        if ($this->_kontextFactory == null)
        {
            $this->_kontextFactory = new KontextFactory();
        }

        return $this->_kontextFactory;
    }

    protected function getUserFactory()
    {
	    if ($this->_userFactory == null)
	    {
		    $this->_userFactory = new UserFactory();
	    }

	    return $this->_userFactory;
    }
    #endregion

    #region constructors
    function __construct()
    {
        $this->_listFactory = new ListFactory($this);
        $this->_fundAttributFactory = new FundAttributFactory();
    }
    #endregion

    #region methods
    /**
    * Returns the name of the database table.
    */
    public function getTableName()
    {
        return "Fund";
    }

    #region load
	/**
	* Returns the SQL SELECT statement to load Id, Bezeichnung, Anzahl,
    * Dimension1, Dimension2, Dimension3, Masse, FileName, Fildername,
    * Rating and LastCheckedDate as string.
	*/
	protected function getSQLStatementToLoad()
	{
		return "SELECT Id, Bezeichnung, Anzahl, Dimension1, Dimension2, Dimension3, Masse, FileName, FolderName, Rating, LastCheckedDate
			FROM ".$this->getTableName();
	}
    
	/**
	* Returns the SQL statement search conditions as string by the given search conditions.
	* Search condition keys are: Id, ContainsBezeichnung, Bezeichnung, HasAblage, Ablage_Id, HasKontext, Kontext_Id, HasFundAttribute and FundAttribut_Ids.
	*
	* @param $searchConditions Array of search conditions (key, value) to be translated into SQL WHERE conditions.
	*/
	protected function getSqlSearchConditionStrings($searchConditions)
	{
		if ($searchConditions == null ||
			count($searchConditions) == 0)
		{
			return array();
		}
        
		$sqlSearchConditionStrings = array();
		
		if (isset($searchConditions["HasAblage"]))
		{
			if ($searchConditions["HasAblage"] === true)
			{
				array_push($sqlSearchConditionStrings, "Ablage_Id IS NOT NULL");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "Ablage_Id IS NULL");
			}		
		}
		
		if (isset($searchConditions["Ablage_Id"]))
		{
			array_push($sqlSearchConditionStrings, "Ablage_Id = ".$searchConditions["Ablage_Id"]);
		}
		
		if (isset($searchConditions["Ablage_Ids"]))
		{
            array_push($sqlSearchConditionStrings, "Ablage_Id IN (".$searchConditions["Ablage_Ids"].")");
		}

		if (isset($searchConditions["HasKontext"]))
		{
			if ($searchConditions["HasKontext"] === true)
			{
				array_push($sqlSearchConditionStrings, "Kontext_Id IS NOT NULL");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "Kontext_Id IS NULL");
			}		
		}
		
		if (isset($searchConditions["Kontext_Id"]))
		{
			array_push($sqlSearchConditionStrings, "Kontext_Id = ".$searchConditions["Kontext_Id"]);
		}
		
		if (isset($searchConditions["Kontext_Ids"]))
		{
            array_push($sqlSearchConditionStrings, "Kontext_Id IN (".$searchConditions["Kontext_Ids"].")");
		}
		
		if (isset($searchConditions["HasFundAttribute"]))
		{
			if ($searchConditions["HasFundAttribute"] === true)
			{
				array_push($sqlSearchConditionStrings, "EXISTS (SELECT * FROM ".$this->getTableName()."_".$this->getFundAttributFactory()->getTableName()." WHERE ".$this->getTableName()."_".$this->getFundAttributFactory()->getTableName().".".$this->getTableName()."_Id = ".$this->getTableName().".Id)");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "NOT EXISTS (SELECT * FROM ".$this->getTableName()."_".$this->getFundAttributFactory()->getTableName()." WHERE ".$this->getTableName()."_".$this->getFundAttributFactory()->getTableName().".".$this->getTableName()."_Id = ".$this->getTableName().".Id)");
			}		
		}
		
		if (isset($searchConditions["FundAttribut_Ids"]))
		{
			$fundAttributIds = explode(",", $searchConditions["FundAttribut_Ids"]);

			foreach($fundAttributIds as $fundAttributId)
			{
				if (is_numeric($fundAttributId))
				{
					array_push($sqlSearchConditionStrings, "Id IN (SELECT ".$this->getTableName()."_".$this->getFundAttributFactory()->getTableName().".Fund_Id FROM ".$this->getTableName()."_".$this->getFundAttributFactory()->getTableName()." WHERE ".$this->getTableName()."_".$this->getFundAttributFactory()->getTableName().".".$this->getFundAttributFactory()->getTableName()."_Id = ".$fundAttributId.")");
				}
			}
		}

		if (isset($searchConditions["HasFileName"]))
		{
			if ($searchConditions["HasFileName"] === true)
			{
				array_push($sqlSearchConditionStrings, "FileName IS NOT NULL");
				array_push($sqlSearchConditionStrings, "FileName NOT LIKE ''");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "FileName IS NULL OR FileName LIKE ''");
			}		
		}

		if (isset($searchConditions["ContainsFileName"]))
		{
			array_push($sqlSearchConditionStrings, "FileName LIKE '%".$searchConditions["ContainsFileName"]."%'");
		}

		if (isset($searchConditions["FileName"]))
		{
			array_push($sqlSearchConditionStrings, "FileName LIKE '".$searchConditions["FileName"]."'");
		}
		
		if (isset($searchConditions["Rating"]))
		{
			array_push($sqlSearchConditionStrings, "Rating = ".$searchConditions["Rating"]);
		}
		
		if (isset($searchConditions["MinRating"]))
		{
			array_push($sqlSearchConditionStrings, "Rating >= ".$searchConditions["MinRating"]);
		}

		if (isset($searchConditions["IsChecked"]))
		{
			if ($searchConditions["IsChecked"] === true)
			{
				array_push($sqlSearchConditionStrings, "LastCheckedDate IS NOT NULL");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "LastCheckedDate IS NULL");
			}		
		}
		
		if ($this->getListFactory() instanceof iSqlSearchConditionStringsProvider)
		{
			$sqlSearchConditionStrings = array_merge($sqlSearchConditionStrings, $this->getListFactory()->getSqlSearchConditionStringsBySearchConditions($searchConditions));
		}

		return $sqlSearchConditionStrings;
	}

    public function loadAll()
    {
        return $this->getListFactory()->loadAll();
    }

    protected function fill($dataSet)
    {
        if ($dataSet == null)
        {
            return null;
        }

        $fund = new Fund();
        $fund->setId(intval($dataSet["Id"]));
        $fund->setBezeichnung($dataSet["Bezeichnung"]);

        if (intval($dataSet["Anzahl"]) < 0)
        {
            $fund->setAnzahl(str_replace("-", ">", $dataSet["Anzahl"]));
        }
        else
        {
            $fund->setAnzahl($dataSet["Anzahl"]);
        }

        $fund->setDimension1($dataSet["Dimension1"]);
        $fund->setDimension2($dataSet["Dimension2"]);
        $fund->setDimension3($dataSet["Dimension3"]);
		$fund->setMasse($dataSet["Masse"]);
        $fund->setAblage($this->getAblageFactory()->loadByFund($fund));
        $fund->setKontext($this->getKontextFactory()->loadByFund($fund));
		$fund->setFundAttribute($this->getFundAttributFactory()->loadByFund($fund));
		$fund->setFileName($dataSet["FileName"]);
		$fund->setFolderName($dataSet["FolderName"]);
		$fund->setRating($dataSet["Rating"]);
        $fund->setLastCheckedDate($dataSet["LastCheckedDate"] === null ? null : date(DateTime::ISO8601, strtotime($dataSet["LastCheckedDate"])));

        return $fund;
    }
    #endregion

    #region save
    protected function getSQLStatementToInsert(iNode $element)
    {
        $anzahl = intval(str_replace(">", "-", $element->getAnzahl()));

        return "INSERT INTO ".$this->getTableName()." (Anzahl, Bezeichnung, Dimension1, Dimension2, Dimension3, Masse, Kontext_Id, Ablage_Id, FileName, FolderName, Rating)
        VALUES (".$anzahl.", '".addslashes($element->getBezeichnung())."',
        ".($element->getDimension1() === null ? "NULL" : $element->getDimension1()).",
        ".($element->getDimension2() === null ? "NULL" : $element->getDimension2()).",
        ".($element->getDimension3() === null ? "NULL" : $element->getDimension3()).",
        ".($element->getMasse() === null ? "NULL" : $element->getMasse()).",
        ".($element->getKontext() === null ? "NULL" : $element->getKontext()->getId()).",
		".($element->getAblage() === null ? "NULL" : $element->getAblage()->getId()).",
		".($element->getFileName() === null ? "NULL" : "'".addslashes($element->getFileName())."'").",
		".($element->getFolderName() === null ? "NULL" : "'".addslashes($element->getFolderName())."'").",
		".$element->getRating().",
        ".($element->getLastCheckedDate() === null ? "NULL" : "'".date("Y-m-d H:i:s", $element->getLastCheckedDate())."'").");";
    }

    protected function getSQLStatementToUpdate(iNode $element)
    {
        $anzahl = intval(str_replace(">", "-", $element->getAnzahl()));

        return "UPDATE ".$this->getTableName()."
        SET Anzahl = ".$anzahl.",
        Bezeichnung = '".addslashes($element->getBezeichnung())."',
        Dimension1 = ".($element->getDimension1() === null ? "NULL" : $element->getDimension1()).",
        Dimension2 = ".($element->getDimension2() === null ? "NULL" : $element->getDimension2()).",
        Dimension3 = ".($element->getDimension3() === null ? "NULL" : $element->getDimension3()).",
        Masse = ".($element->getMasse() === null ? "NULL" : $element->getMasse()).",
        Kontext_Id = ".($element->getKontext() === null ? "NULL" : $element->getKontext()->getId()).",
		Ablage_Id = ".($element->getAblage() === null ? "NULL" : $element->getAblage()->getId()).",
		FileName = ".($element->getFileName() === null ? "NULL" : "'".addslashes($element->getFileName())."'").",
		FolderName = ".($element->getFolderName() === null ? "NULL" : "'".addslashes($element->getFolderName())."'").",
		Rating = ".$element->getRating().",
        LastCheckedDate = ".($element->getLastCheckedDate() === null ? "NULL" : "'".date("Y-m-d H:i:s", $element->getLastCheckedDate())."'")."
        WHERE Id = ".$element->getId().";";
    }
    #endregion

    #region convert
    public function convertToInstance($object)
    {
        global $logger;
        $logger->debug("Konvertiere Daten zu Fund");

        if ($object == null)
        {
            $logger->error("Fund ist nicht gesetzt!");
            return null;
        }

        $fund = new Fund();

        if (isset($object["Id"]))
        {
            $fund->setId(intval($object["Id"]));
        }

        if (isset($object["Anzahl"]))
        {
            $fund->setAnzahl(intval($object["Anzahl"]));
        }
        else
        {
            $logger->debug("Anzahl ist nicht gesetzt!");
        }

        if (isset($object["Bezeichnung"]))
        {
            $fund->setBezeichnung($object["Bezeichnung"]);
        }
        else
        {
            $logger->debug("Bezeichnung ist nicht gesetzt!");
        }

        if (isset($object["FundAttribute"]))
        {
            for ($i = 0; $i < count($object["FundAttribute"]); $i++)
            {
                $fund->addFundAttribut($this->getFundAttributFactory()->convertToInstance($object["FundAttribute"][$i]));
            }
        }
        else
        {
            $logger->debug("FundAttribute ist nicht gesetzt!");
        }

        if (isset($object["Dimension1"]) &&
        !empty($object["Dimension1"]))
        {
            $fund->setDimension1(intval($object["Dimension1"]));
        }
        else
        {
            $logger->debug("Dimension1 ist nicht gesetzt!");
        }

        if (isset($object["Dimension2"]) &&
        !empty($object["Dimension2"]))
        {
            $fund->setDimension2(intval($object["Dimension2"]));
        }
        else
        {
            $logger->debug("Dimension2 ist nicht gesetzt!");
        }

        if (isset($object["Dimension3"]) &&
        !empty($object["Dimension3"]))
        {
            $fund->setDimension3(intval($object["Dimension3"]));
        }
        else
        {
            $logger->debug("Dimension3 ist nicht gesetzt!");
        }

        if (isset($object["Masse"]) &&
        !empty($object["Masse"]))
        {
            $fund->setMasse(intval($object["Masse"]));
        }
        else
        {
            $logger->debug("Masse ist nicht gesetzt!");
        }

        if (isset($object["Ablage"]))
        {
            $fund->setAblage($this->getAblageFactory()->convertToInstance($object["Ablage"]));
        }
        else
        {
            $logger->warn("Ablage ist nicht gesetzt!");
        }

        if (isset($object["Kontext"]))
        {
            $fund->setKontext($this->getKontextFactory()->convertToInstance($object["Kontext"]));
        }
        else
        {
            $logger->warn("Kontext ist nicht gesetzt!");
        }

        if (isset($object["FileName"]))
        {
            $fund->setFileName($object["FileName"]);
        }
        else
        {
            $logger->debug("FileName ist nicht gesetzt!");
        }

        if (isset($object["FolderName"]))
        {
            $fund->setFolderName($object["FolderName"]);
        }
        else
        {
            $logger->debug("FolderName ist nicht gesetzt!");
        }

        if (isset($object["Rating"]))
        {
            $fund->setRating($object["Rating"]);
        }
        else
        {
            $logger->debug("Rating ist nicht gesetzt!");
        }

        return $fund;
    }
    #endregion

    #region Ablage
    public function loadByAblage($ablage)
    {
        $funde = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByAblage($ablage));

            if (!$mysqli->errno)
            {
                while ($datensatz = $ergebnis->fetch_assoc())
                {
                    array_push($funde, $this->loadById(intval($datensatz["Id"])));
                }
            }
        }

        $mysqli->close();

        return $funde;
    }

    protected function getSQLStatementToLoadIdsByAblage($ablage)
    {
        return "SELECT Id
        FROM Fund
        WHERE Ablage_Id = ".$ablage->getId().";";
    }

    public function linkAblage($element, $ablage)
    {
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToLinkAblage($element, $ablage));

            if (!$mysqli->errno)
            {
                $element->setAblage($ablage);
            }
        }

        $mysqli->close();

        return $element;
    }

    public function getSQLStatementToLinkAblage($element, $ablage)
    {
        return "UPDATE ".$this->getTableName()."
        SET Ablage_Id = ".$ablage->getId()."
        WHERE Id = ".$element->getId().";";
    }

    public function unlinkAblage($element, $ablage)
    {
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToUnlinkAblage($element, $ablage));

            if (!$mysqli->errno)
            {
                $element->setAblage(null);
            }
        }

        $mysqli->close();

        return $element;
    }

    public function getSQLStatementToUnlinkAblage($element, $ablage)
    {
        return "UPDATE ".$this->getTableName()."
        SET Ablage_Id = NULL
        WHERE Id = ".$element->getId().";";
    }
    #endregion

    #region Kontext
    public function loadByKontext($kontext)
    {
        $funde = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByKontext($kontext));

            if (!$mysqli->errno)
            {
                while ($datensatz = $ergebnis->fetch_assoc())
                {
                    array_push($funde, $this->loadById(intval($datensatz["Id"])));
                }
            }
        }

        $mysqli->close();

        return $funde;
    }

    protected function getSQLStatementToLoadIdsByKontext($kontext)
    {
        return "SELECT Id
        FROM Fund
        WHERE Kontext_Id = ".$kontext->getId().";";
    }

    public function linkKontext($element, $kontext)
    {
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToLinkKontext($element, $kontext));

            if (!$mysqli->errno)
            {
                $element->setKontext($kontext);
            }
        }

        $mysqli->close();

        return $element;
    }

    public function getSQLStatementToLinkKontext($element, $kontext)
    {
        return "UPDATE ".$this->getTableName()."
        SET Kontext_Id = ".$kontext->getId()."
        WHERE Id = ".$element->getId().";";
    }

    public function unlinkKontext($element, $kontext)
    {
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToUnlinkKontext($element, $kontext));

            if (!$mysqli->errno)
            {
                $element->setKontext(null);
            }
        }

        $mysqli->close();

        return $element;
    }

    public function getSQLStatementToUnlinkKontext($element, $kontext)
    {
        return "UPDATE ".$this->getTableName()."
        SET Kontext_Id = NULL
        WHERE Id = ".$element->getId().";";
    }
    #endregion

    #region FundAttribute
    public function loadByFundAttribut($fundAttribut)
    {
        $funde = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByFundAttribut($fundAttribut));

            if (!$mysqli->errno)
            {
                while ($datensatz = $ergebnis->fetch_assoc())
                {
                    array_push($funde, $this->loadById(intval($datensatz["Id"])));
                }
            }
        }

        $mysqli->close();

        return $funde;
    }

    protected function getSQLStatementToLoadIdsByFundAttribut($fundAttribut)
    {
        return "SELECT Fund_Id AS Id
        FROM ".$this->getTableName()."_FundAttribut
        WHERE FundAttribut_Id = ".$fundAttribut->getId().";";
    }

    public function linkFundAttribut($element, $fundAttribut)
    {
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToLinkFundAttribut($element, $fundAttribut));

            if (!$mysqli->errno)
            {
                $element->AddFundAttribut($fundAttribut);
            }
        }

        $mysqli->close();

        return $element;
    }

    public function getSQLStatementToLinkFundAttribut($element, $fundAttribut)
    {
        return "INSERT INTO ".$this->getTableName()."_FundAttribut (Fund_Id, FundAttribut_Id)
        VALUES (".$element->getId().",".$fundAttribut->getId().");";
    }

    public function unlinkFundAttribut($element, $fundAttribut)
    {
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToUnlinkFundAttribut($element, $fundAttribut));

            if (!$mysqli->errno)
            {
                $element->removeFundAttribut($fundAttribut);
            }
        }

        $mysqli->close();

        return $element;
    }

    public function getSQLStatementToUnlinkFundAttribut($element, $fundAttribut)
    {
        return "DELETE
        FROM ".$this->getTableName()."_FundAttribut
        WHERE Fund_Id = ".$element->getId()." AND
        FundAttribut_Id = ".$fundAttribut->getId().";";
    }

    /**
    * Synchronises the Fund's FundAttribute with the given
    * FundAttributen.
    * Returns the updated Fund.
    *
    * @param $fund Fund to synchronise.
    * @param array $fundAttribute FundAttribute to be used as new FundAttribute.
    */
    public function synchroniseFundAttribute($fund, array $fundAttribute)
    {
        $fund = $this->linkNewFundAttribute($fund, $fundAttribute);
        $fund = $this->unlinkObsoleteFundAttribute($fund, $fundAttribute);

        return $fund;
    }

    /**
    * Links FundAttribute that are not in the Fund's
    * FundAttribut list.
    * Returns the updated Fund.
    *
    * @param $fund Fund to be updated with new FundAttributen.
    * @param array $fundAttribute FundAttribute to be used as new FundAttribute.
    */
    protected function linkNewFundAttribute($fund, array $fundAttribute)
    {
        for ($i = 0; $i < count($fundAttribute); $i++)
        {
            if (!$fund->containsFundAttribut($fundAttribute[$i]))
            {
                $fund = $this->linkFundAttribut($fund, $fundAttribute[$i]);
            }
        }

        return $fund;
    }

    /**
    * Unlinks FundAttribute that are in the Fund's
    * FundAttribut list, but not in the given FundAttribute.
    * Returns the updated Fund.
    *
    * @param $fund Fund to be cleaned up from obsolete FundAttributen.
    * @param array $fundAttribute FundAttribute to be used as new FundAttribute.
    */
    protected function unlinkObsoleteFundAttribute($fund, array $fundAttribute)
    {
        for ($i = 0; $i < count($fund->getFundAttribute());)
        {
            $contains = false;

            for ($j = 0; $j < count($fundAttribute); $j++)
            {
                if ($fundAttribute[$j]->getId() == $fund->getFundAttribute()[$i]->getId())
                {
                    $contains = true;
                    break;
                }
            }

            if ($contains)
            {
                $i++;
            }
            else
            {
                $fund = $this->unlinkFundAttribut($fund, $fund->getFundAttribute()[$i]);
            }
        }

        return $fund;
    }

    public function unlinkAllFundAttribute($fund)
    {
        return $this->unlinkObsoleteFundAttribute($fund, array());
    }
    #endregion
    #endregion
}
