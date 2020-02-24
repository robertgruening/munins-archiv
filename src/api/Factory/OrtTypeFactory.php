<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/../Model/OrtType.php");

class OrtTypeFactory extends Factory implements iListFactory
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
        return "OrtTyp";
    }

    #region load
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT
        Id, Bezeichnung, (
            SELECT
            COUNT(*)
            FROM
            Ort
            WHERE
            Typ_Id = ".$id."
        ) AS CountOfOrten
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

        $ortType = new OrtType();
        $ortType->setId(intval($dataset["Id"]));
        $ortType->setBezeichnung($dataset["Bezeichnung"]);
        $ortType->setCountOfOrten(intval($dataset["CountOfOrten"]));

        return $ortType;
    }
    #endregion

    #region save
    protected function getSQLStatementToInsert(iNode $element)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung)
        VALUES ('".$element->getBezeichnung()."');";
    }

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
