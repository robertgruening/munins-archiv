<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/../Model/AblageTyp.php");

class AblageTypFactory extends Factory implements iListFactory
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
        return "AblageTyp";
    }

    #region load
    /**
     * Returns the SQL statement to load ID and Bezeichnung
     * by AblageTyp ID.
     * 
     * @param $id ID of the AblageTyp to load.
     */
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung
                FROM ".$this->getTableName()."
                WHERE Id = ".$id.";";
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

        $ablageTyp = new AblageTyp();
        $ablageTyp->setId(intval($dataset["Id"]));
        $ablageTyp->setBezeichnung($dataset["Bezeichnung"]);
        
        return $ablageTyp;
    }
    #endregion
    
    #region save
    /**
     * Returns the SQL statement to insert Bezeichnung
     * of the given AblageTyp.
     * 
     * @param iNode $element AblageTyp to insert.
     */
    protected function getSQLStatementToInsert(iNode $element)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung)
                VALUES ('".$element->getBezeichnung()."');";
    }
    
    /**
     * Returns the SQL statement to update Bezeichnung
     * of the given AblageTyp.
     * 
     * @param iNode $element AblageTyp to update.
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
        if ($object == null)
        {
            return null;
        }

        $ablageTyp = new AblageTyp();

        if (isset($object["Id"]))
        {
            $ablageTyp->setId(intval($object["Id"]));
        }

        $ablageTyp->setBezeichnung($object["Bezeichnung"]);
        
        return $ablageTyp;
    }
    #endregion
    #endregion
}
