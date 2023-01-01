<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/ISqlSearchConditionStringsProvider.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/OrtFactory.php");
include_once(__DIR__."/../Model/OrtType.php");

class OrtTypeFactory extends Factory implements iListFactory
{
    #region variables
    private $_listFactory = null;
    private $_ortFactory = null;
    #endregion

    #region properties
    protected function getListFactory()
    {
        return $this->_listFactory;
    }
    
    protected function getOrtFactory()
    {
        if ($this->_ortFactory == null)
        {
            $this->_ortFactory = new OrtFactory();
        }

        return $this->_ortFactory;
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
        return "OrtTyp";
    }

    #region load
    /**
     * Returns the SQL SELECT statement to load Id, Bezeichnung and CountOfOrten as string.
     */
    protected function getSqlStatementToLoad()
	{
		return "SELECT Id, Bezeichnung, (SELECT COUNT(*) FROM ".$this->getOrtFactory()->getTableName()." WHERE ".$this->getOrtFactory()->getTableName().".Typ_Id = ".$this->getTableName().".Id) AS CountOfOrten
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
				array_push($sqlSearchConditionStrings, "EXISTS (SELECT * FROM ".$this->getOrtFactory()->getTableName()." AS reference WHERE reference.Typ_Id = ".$this->getTableName().".Id)");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "NOT EXISTS (SELECT * FROM ".$this->getOrtFactory()->getTableName()." AS reference WHERE reference.Typ_Id = ".$this->getTableName().".Id)");
			}
		}

		if (isset($searchConditions["TypedNode_Id"]))
		{
			array_push($searchConditions, "Id = (SELECT Typ_Id FROM ".$this->getOrtFactory()->getTableName()." WHERE Id = ".$searchConditions["TypedNode_Id"].")");
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
        $logger->debug("Fülle Ortstyp (".intval($dataset["Id"]).") mit Daten");

        $ortType = new OrtType();
        $ortType->setId(intval($dataset["Id"]));
        $ortType->setBezeichnung($dataset["Bezeichnung"]);
        $ortType->setCountOfOrten(intval($dataset["CountOfOrten"]));

        return $ortType;
    }
    #endregion

    #region save
    /**
    * Returns the SQL statement to insert Bezeichnung
    * of the given OrtType.
    *
    * @param iNode $element OrtType to insert.
    */
    protected function getSQLStatementToInsert(iNode $element)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung)
        VALUES ('".addslashes($element->getBezeichnung())."');";
    }

    /**
    * Returns the SQL statement to update Bezeichnung
    * of the given OrtType.
    *
    * @param iNode $element OrtType to update.
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
        $logger->debug("Konvertiere Daten zu Ortstyp");

        if ($object == null)
        {
            $logger->error("Ortstyp ist nicht gesetzt!");
            return null;
        }

        $ortType = new OrtType();

        if (isset($object["Id"]))
        {
            $ortType->setId(intval($object["Id"]));
        }
        else
        {
            $logger->debug("Id ist nicht gesetzt!");
        }

        if (isset($object["Bezeichnung"]))
        {
            $ortType->setBezeichnung($object["Bezeichnung"]);
        }
        else
        {
            $logger->debug("Bezeichnung ist nicht gesetzt!");
        }

        if (isset($object["CountOfOrten"]))
        {
            $ortType->setCountOfOrten(intval($object["CountOfOrten"]));
        }
        else
        {
            $logger->debug("Anzahl der Ort zu diesem Typ ist nicht gesetzt!");
        }

        return $ortType;
    }
    #endregion
    #endregion
}
