<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/ISqlSearchConditionStringsProvider.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/KontextFactory.php");
include_once(__DIR__."/../Model/LfdNummer.php");

class LfdNummerFactory extends Factory implements iListFactory
{
    #region variables
    private $_listFactory = null;
    private $_kontextFactory = null;
    #endregion

    #region properties
    protected function getListFactory()
    {
        return $this->_listFactory;
    }

    protected function getKontextFactory()
    {
        if ($this->_kontextFactory == null)
        {
            $this->_kontextFactory = new KontextFactory();
        }

        return $this->_kontextFactory;
    }
    #endregion

    #region constructors
    function __construct()
    {
        $this->_listFactory = new ListFactory($this);
    }
    #endregion

    #region methods
    /**
     * Returns the name of the database table.
     */
    public function getTableName()
    {
        return "LfdNummer";
    }

    #region load
	/**
	* Returns the SQL SELECT statement to load Id, Bezeichnung and CountOfKontexte as string.
	*/
	protected function getSqlStatementToLoad()
	{
		return "SELECT Id, Bezeichnung, (SELECT COUNT(*) FROM ".$this->getKontextFactory()->getTableName()."_".$this->getTableName()." WHERE ".$this->getKontextFactory()->getTableName()."_".$this->getTableName().".".$this->getTableName()."_Id = ".$this->getTableName().".Id) AS CountOfKontexte
			FROM ".$this->getTableName();
	}

	/**
	* Returns the SQL statement search conditions as string by the given search conditions.
	* Search condition keys are: Id, ContainsBezeichnung, Bezeichnung, HasKontexte, Kontext_Id and IsUsed.
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
		
		if (isset($searchConditions["HasKontexte"]))
		{
			if ($searchConditions["HasKontexte"] === true)
			{
				array_push($sqlSearchConditionStrings, "EXISTS (SELECT * FROM ".$this->getKontextFactory()->getTableName()."_".$this->getTableName()." WHERE ".$this->getKontextFactory()->getTableName()."_".$this->getTableName().".".$this->getTableName()."_Id = ".$this->getTableName().".Id)");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "NOT EXISTS (SELECT * FROM ".$this->getKontextFactory()->getTableName()."_".$this->getTableName()." WHERE ".$this->getKontextFactory()->getTableName()."_".$this->getTableName().".".$this->getTableName()."_Id = ".$this->getTableName().".Id)");
			}
		}
	
		if (isset($searchConditions["Kontext_Id"]))
		{
			array_push($sqlSearchConditionStrings, "Id IN (SELECT ".$this->getTableName()."_Id FROM ".$this->getKontextFactory()->getTableName()."_".$this->getTableName()." WHERE ".$this->getKontextFactory()->getTableName()."_".$this->getTableName().".".$this->getKontextFactory()->getTableName()."_Id = ".$searchConditions["Kontext_Id"].")");
		}
	
		if (isset($searchConditions["IsUsed"]))
		{
			if ($searchConditions["IsUsed"] === true)
			{
				array_push($sqlSearchConditionStrings, "EXISTS (SELECT * FROM ".$this->getKontextFactory()->getTableName()."_".$this->getTableName()." WHERE ".$this->getKontextFactory()->getTableName()."_".$this->getTableName().".".$this->getTableName()."_Id = ".$this->getTableName().".Id)");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "NOT EXISTS (SELECT * FROM ".$this->getKontextFactory()->getTableName()."_".$this->getTableName()." WHERE ".$this->getKontextFactory()->getTableName()."_".$this->getTableName().".".$this->getTableName()."_Id = ".$this->getTableName().".Id)");
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

        $lfdNummer = new LfdNummer();
        $lfdNummer->setId(intval($dataSet["Id"]));
        $lfdNummer->setBezeichnung($dataSet["Bezeichnung"]);
        $lfdNummer->setCountOfKontexte(intval($dataSet["CountOfKontexte"]));

        return $lfdNummer;
    }
    #endregion

    #region save
    protected function getSQLStatementToInsert(iNode $element)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung)
                VALUES ('".addslashes($element->getBezeichnung())."');";
    }

    protected function getSQLStatementToUpdate(iNode $element)
    {
        return "UPDATE ".$this->getTableName()."
                SET Bezeichnung = '".addslashes($element->getBezeichnung())."'
                WHERE Id = ".$element->getId().";";
    }
    #endregion

    #region convert
    public function convertToInstance($object)
    {
        global $logger;
        $logger->debug("Konvertiere Daten zu LfD-Nummer");

        if ($object == null)
        {
            $logger->error("LfD-Nummer ist nicht gesetzt!");
            return null;
        }

        $lfdNummer = new LfdNummer();

        if (isset($object["Id"]))
        {
            $lfdNummer->setId(intval($object["Id"]));
        }
        else
        {
            $logger->debug("Id ist nicht gesetzt!");
        }

        if (isset($object["Bezeichnung"]))
        {
            $lfdNummer->setBezeichnung($object["Bezeichnung"]);
        }
        else
        {
            $logger->debug("Bezeichnung ist nicht gesetzt!");
        }

        if (isset($object["CountOfKontexte"]))
        {
            $lfdNummer->setCountOfKontexte(intval($object["CountOfKontexte"]));
        }

        return $lfdNummer;
    }
    #endregion

    #region Kontext
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
        return "SELECT LfdNummer_Id AS Id
                FROM Kontext_".$this->getTableName()."
                WHERE Kontext_Id = ".$kontext->getId().";";
    }
    #endregion
    #endregion
}
