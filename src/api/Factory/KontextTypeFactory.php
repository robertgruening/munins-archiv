<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/../Model/KontextType.php");

class KontextTypeFactory extends Factory implements iListFactory
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
        return "KontextTyp";
    }

    #region load
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung
        FROM ".$this->getTableName()."
        WHERE Id = ".$id.";";
    }

    public function loadByNodeId($nodeId)
    {
        $element = null;
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToLoadByNodeId($nodeId));

            if (!$mysqli->errno)
            {
                $element = $this->fill($ergebnis->fetch_assoc());
            }
        }

        $mysqli->close();

        return $element;
    }

    protected function getSQLStatementToLoadByNodeId($nodeId)
    {
        return "SELECT ".$this->getTableName().".Id AS Id, ".$this->getTableName().".Bezeichnung AS Bezeichnung
        FROM ".$this->getTableName()." LEFT JOIN Kontext ON ".$this->getTableName().".Id = Kontext.Typ_Id
        WHERE Kontext.Id = ".$nodeId.";";
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

        return $kontextType;
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
