<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/../Model/FundAttributType.php");

class FundAttributTypeFactory extends Factory implements iListFactory
{
    #region variables
    private $_listFactory = null;
    #endregion

    #region properties
    protected function getListFactory()
    {
        return $this->_listFactory;
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
	* Returns the SQL SELECT statement to load ID, Bezeichnung and count of referenced Fundattribute as string.
	*/
	protected function getSqlStatementToLoad()
	{
		return "SELECT
			Id, Bezeichnung, (
				SELECT
				COUNT(*)
				FROM
				FundAttribut
				WHERE
				Typ_Id = ".$id."
			) AS CountOfFundAttributen
			FROM
			".$this->getTableName();
	}
    
	/**
	* Returns the SQL statement search conditions as string by the given search conditions.
	* Search condition keys are: Id and Bezeichnung.
	*
	* @param $searchConditions Array of search conditions (key, value) to be translated into SQL WHERE conditions.
	*/
	protected function getSqlSearchConditionStrings($searchConditions)
	{
		if ($searchConditions == null ||
			count($searchConditions) == 0)
		{
			return $sqlStatement;
		}
        
		$sqlSearchConditionStrings = array();
		
		if (isset($searchConditions["Id"]))
		{
			array_push($sqlSearchConditionStrings, "Id = ".$searchConditions["Id"]);
		}
        
		if (isset($searchConditions["Bezeichnung"]))
		{
			array_push($sqlSearchConditionStrings, "Bezeichnung LIKE '%".$searchConditions["Bezeichnung"]."%'");
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
