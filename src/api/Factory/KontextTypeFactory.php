<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/ISqlSearchConditionStringsProvider.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/KontextFactory.php");
include_once(__DIR__."/../Model/KontextType.php");

class KontextTypeFactory extends Factory implements iListFactory
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
		if ($this->$_kontextFactory == null)
		{
			$this->$_kontextFactory = new KontextFactory();
		}

		return $this->$_kontextFactory;
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
        return "KontextTyp";
    }

    #region load
	/**
	* Returns the SQL SELECT statement to load Id, Bezeichnung and CountOfKontexte as string.
	*/
	protected function getSqlStatementToLoad()
	{
		return "SELECT Id, Bezeichnung, (SELECT COUNT(*) FROM ".$this->getKontextFactory()->getTableName()." WHERE ".$this->getKontextFactory()->getTableName().".Typ_Id = ".$this->getTableName().".Id) AS CountOfKontexte
			FROM ".$this->getTableName();
	}
    
	/**
	* Returns the SQL statement search conditions as string by the given search conditions.
	* Search condition keys are: Id, Bezeichnung, IsUsed and TypedNode_Id.
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
				array_push($sqlSearchConditionStrings, "EXISTS (SELECT * FROM ".$this->getKontextFactory()->getTableName()." AS reference WHERE reference.Typ_Id = ".$this->getTableName().".Id)");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "NOT EXISTS (SELECT * FROM ".$this->getKontextFactory()->getTableName()." AS reference WHERE reference.Typ_Id = ".$this->getTableName().".Id)");
			}
		}

		if (isset($searchConditions["TypedNode_Id"]))
		{
			array_push($searchConditions, "Id = (SELECT Typ_Id FROM ".$this->getKontextFactory()-getTableName()." WHERE Id = ".$searchConditions["Ablage_Id"].")");
		}

		if ($this->getListFactory() instanceof iSqlSearchConditionStringsProvider)
		{
			$sqlSearchConditionStrings = array_merge($sqlSearchConditionStrings, $this->getListFactory()->getSqlSearchConditionStringsBySearchConditions($searchConditions));
		}

		return $sqlSearchConditionStrings;
	}

	public function loadByNodeId($nodeId)
	{
		$searchConditions = array();
		$searchConditions["TypedNode_Id"] = $nodeId;
		
		$elements = $this->loadBySearchConditions($searchConditions);
		
		if ($elements == null ||
			count($elements) == 0)
		{
			return null;
		}

		return $elements[0];
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

        $kontextType = new KontextType();
        $kontextType->setId(intval($dataSet["Id"]));
        $kontextType->setBezeichnung($dataSet["Bezeichnung"]);
		// Note: setCountOfKontexte() not implemented
        //$kontextType->setCountOfKontexte($dataSet["CountOfKontexte"]);

        return $kontextType;
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
        $logger->debug("Konvertiere Daten zu Kontexttyp");

        if ($object == null)
        {
            $logger->error("Kontexttyp ist nicht gesetzt!");
            return null;
        }

        $kontextType = new KontextType();

        if (isset($object["Id"]))
        {
            $kontextType->setId(intval($object["Id"]));
        }
        else
        {
            $logger->debug("Id ist nicht gesetzt!");
        }

        if (isset($object["Bezeichnung"]))
        {
            $kontextType->setBezeichnung($object["Bezeichnung"]);
        }
        else
        {
            $logger->debug("Bezeichnung ist nicht gesetzt!");
        }

        if (isset($object["CountOfKontexte"]))
        {
            $kontextType->setCountOfKontexte(intval($object["CountOfKontexte"]));
        }
        else
        {
            $logger->debug("Anzahl der Kontexte zu diesem Typ ist nicht gesetzt!");
        }

        return $kontextType;
    }
    #endregion
    #endregion
}
