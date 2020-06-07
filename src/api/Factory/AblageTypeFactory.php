<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/ISqlSearchConditionStringsProvider.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/AblageFactory.php");
include_once(__DIR__."/../Model/AblageType.php");

class AblageTypeFactory extends Factory implements iListFactory
{
    #region variables
    private $_listFactory = null;
    private $_ablageFactory = null;
    #endregion

    #region properties
    protected function getListFactory()
    {
        return $this->_listFactory;
    }

	protected function getAblageFactory()
	{
		if ($this->_ablageFactory == null)
		{
			$this->_ablageFactory = new AblageFactory();
		}

		return $this->_ablageFactory;
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
        // ToDo: Rename
        return "AblageTyp";
    }

    #region load
	/**
	* Returns the SQL SELECT statement to load Id, Bezeichnung and CountOfAblagen as string.
	*/
	protected function getSqlStatementToLoad()
	{
		return "SELECT Id, Bezeichnung, (SELECT COUNT(*) FROM ".$this->getAblageFactory()->getTableName()." WHERE ".$this->getAblageFactory()->getTableName().".Typ_Id = ".$this->getTableName().".Id) AS CountOfAblagen
			FROM ".$this->getTableName();
	}
    
	/**
	* Returns the SQL statement search conditions as string by the given search conditions.
	* Search condition keys are: Id, Bezeichnung and IsUsed.
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

		if (isset($searchConditions["IsUsed"]))
		{
			if ($searchConditions["IsUsed"] === true)
			{
				array_push($sqlSearchConditionStrings, "EXISTS (SELECT * FROM ".$this->getAblageFactory()->getTableName()." AS reference WHERE reference.Typ_Id = ".$this->getTableName().".Id)");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "NOT EXISTS (SELECT * FROM ".$this->getAblageFactory()->getTableName()." AS reference WHERE reference.Typ_Id = ".$this->getTableName().".Id)");
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

    protected function fill($dataset)
    {
        if ($dataset == null)
        {
            return null;
        }

        global $logger;
        $logger->debug("Fülle Ablagetyp (".intval($dataset["Id"]).") mit Daten");

        $ablageType = new AblageType();
        $ablageType->setId(intval($dataset["Id"]));
        $ablageType->setBezeichnung($dataset["Bezeichnung"]);
        $ablageType->setCountOfAblagen(intval($dataset["CountOfAblagen"]));

        return $ablageType;
    }
    #endregion

    #region save
    /**
    * Returns the SQL statement to insert Bezeichnung
    * of the given AblageType.
    *
    * @param iNode $element AblageType to insert.
    */
    protected function getSQLStatementToInsert(iNode $element)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung)
        VALUES ('".addslashes($element->getBezeichnung())."');";
    }

    /**
    * Returns the SQL statement to update Bezeichnung
    * of the given AblageType.
    *
    * @param iNode $element AblageType to update.
    */
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
        $logger->debug("Konvertiere Daten zu Ablagetyp");

        if ($object == null)
        {
            $logger->error("Ablagetyp ist nicht gesetzt!");
            return null;
        }

        $ablageType = new AblageType();

        if (isset($object["Id"]))
        {
            $ablageType->setId(intval($object["Id"]));
        }
        else
        {
            $logger->debug("Id ist nicht gesetzt!");
        }

        if (isset($object["Bezeichnung"]))
        {
            $ablageType->setBezeichnung($object["Bezeichnung"]);
        }
        else
        {
            $logger->debug("Bezeichnung ist nicht gesetzt!");
        }

        if (isset($object["CountOfAblagen"]))
        {
            $ablageType->setCountOfAblagen(intval($object["CountOfAblagen"]));
        }
        else
        {
            $logger->debug("Anzahl der Ablagen zu diesem Typ ist nicht gesetzt!");
        }


        return $ablageType;
    }
    #endregion
    #endregion
}
