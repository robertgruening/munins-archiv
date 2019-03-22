<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/../Model/AblageType.php");

class AblageTypeFactory extends Factory implements iListFactory
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
        return "AblageTyp";
    }

    #region load
    /**
     * Returns the SQL statement to load ID and Bezeichnung
     * by AblageType ID.
     * 
     * @param $id ID of the AblageType to load.
     */
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT
                    Id, Bezeichnung, (
                        SELECT
                            COUNT(*)
                        FROM
                            Ablage
                        WHERE
                            Typ_Id = ".$id."
                    ) AS CountOfAblagen
                FROM
                    ".$this->getTableName()."
                WHERE
                    Id = ".$id.";";
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
                VALUES ('".$element->getBezeichnung()."');";
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
                SET Bezeichnung = '".$element->getBezeichnung()."'
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

        
        return $ablageType;
    }
    #endregion
    #endregion
}
