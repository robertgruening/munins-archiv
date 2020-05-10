<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/ISqlSearchConditionStringsProvider.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/FundAttributFactory.php");
include_once(__DIR__."/../Model/FundAttributType.php");

class FundAttributTypeFactory extends Factory implements iListFactory
{
    #region variables
    private $_listFactory = null;
    private $_fundAttributFactory = null;
    #endregion

    #region properties
    protected function getListFactory()
    {
        return $this->_listFactory;
    }

	protected function getFundAttributFactory()
	{
		if ($this->_fundAttributFactory == null)
		{
			$this->_fundAttributFactory = new FundAttributFactory();
		}

		return $this->_fundAttributFactory;
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
        return "FundAttributTyp";
    }

    #region load
	/**
	* Returns the SQL SELECT statement to load Id, Bezeichnung and CountOfFundAttributen as string.
	*/
	protected function getSqlStatementToLoad()
	{
		return "SELECT Id, Bezeichnung, (SELECT COUNT(*) FROM ".$this->getFundAttributFactory()->getTableName()." WHERE ".$this->getFundAttributFactory()->getTableName().".Typ_Id = ".$this->getTableName().".Id) AS CountOfFundAttributen
			FROM ".$this->getTableName();
	}
    
	/**
	* Returns the SQL statement search conditions as string by the given search conditions.
	* Search condition keys are: Id, ContainsBezeichnung, Bezeichnung, IsUsed and TypedNode_Id.
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
				array_push($sqlSearchConditionStrings, "EXISTS (SELECT * FROM ".$this->getFundAttributFactory()->getTableName()." AS reference WHERE reference.Typ_Id = ".$this->getTableName().".Id)");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "NOT EXISTS (SELECT * FROM ".$this->getFundAttributFactory()->getTableName()." AS reference WHERE reference.Typ_Id = ".$this->getTableName().".Id)");
			}
		}

		if (isset($searchConditions["TypedNode_Id"]))
		{
			array_push($searchConditions, "Id = (SELECT Typ_Id FROM ".$this->getFundAttributFactory()->getTableName()." WHERE Id = ".$searchConditions["TypedNode_Id"].")");
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

        $fundAttributType = new FundAttributType();
        $fundAttributType->setId(intval($dataset["Id"]));
        $fundAttributType->setBezeichnung($dataset["Bezeichnung"]);
        $fundAttributType->setCountOfFundAttributen(intval($dataset["CountOfFundAttributen"]));

        return $fundAttributType;
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
        $logger->debug("Konvertiere Daten zu Fundattributtyp");

        if ($object == null)
        {
            $logger->error("Fundattributtyp ist nicht gesetzt!");
            return null;
        }

        $fundAttributType = new FundAttributType();

        if (isset($object["Id"]))
        {
            $fundAttributType->setId(intval($object["Id"]));
        }
        else
        {
            $logger->debug("Id ist nicht gesetzt!");
        }

        if (isset($object["Bezeichnung"]))
        {
            $fundAttributType->setBezeichnung($object["Bezeichnung"]);
        }
        else
        {
            $logger->debug("Bezeichnung ist nicht gesetzt!");
        }

        if (isset($object["CountOfFundAttributen"]))
        {
            $fundAttributType->setCountOfFundAttributen(intval($object["CountOfFundAttributen"]));
        }
        else
        {
            $logger->debug("Anzahl der Fundattribute zu diesem Typ ist nicht gesetzt!");
        }

        return $fundAttributType;
    }
    #endregion
    #endregion
}