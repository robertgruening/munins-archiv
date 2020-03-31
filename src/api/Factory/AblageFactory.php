<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/AblageTypeFactory.php");
include_once(__DIR__."/ITreeFactory.php");
include_once(__DIR__."/TreeFactory.php");
include_once(__DIR__."/FundFactory.php");
include_once(__DIR__."/../Model/Ablage.php");

class AblageFactory extends Factory implements iTreeFactory
{
    #region variables
    private $_treeFactory = null;
    private $_ablageTypeFactory = null;
    private $_fundFactory = null;
    #endregion

    #region properties
    protected function getTreeFactory()
    {
        return $this->_treeFactory;
    }

    protected function getAblageTypeFactory()
    {
        return $this->_ablageTypeFactory;
    }

    protected function getFundFactory()
    {
        if ($this->_fundFactory == null)
        {
            $this->_fundFactory = new FundFactory();
        }

        return $this->_fundFactory;
    }
    #endregion

    #region constructors
    function __construct()
    {
        $this->_treeFactory = new TreeFactory($this);
        $this->_ablageTypeFactory = new AblageTypeFactory();
    }
    #endregion

    #region methods
    /**
    * Returns the name of the database table.
    */
    public function getTableName()
    {
        return "Ablage";
    }

    #region load
	public function loadByGuid($guid)
	{
		global $logger;
		$logger->debug("Lade Element (".$guid.")");

		$element = null;
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadByGuid($guid));

			if ($mysqli->errno)
			{
				$logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
			}
			else
			{
				$element = $this->fill($ergebnis->fetch_assoc());
			}
		}

		$mysqli->close();

		return $element;
	}

    /**
    * Returns the SQL statement to load ID, Bezeichnung, Ablage type ID and GUID
    * by Ablage GUID.
    *
    * @param $guid GUID of the Ablage to load.
    */
    protected function getSQLStatementToLoadByGuid($guid)
    {
        return "SELECT Id, Bezeichnung, Typ_Id, Guid
        FROM ".$this->getTableName()."
        WHERE Guid = ".$guid.";";
    }

    /**
    * Returns the SQL statement to load ID, Bezeichnung, Ablage type ID and GUID
    * by Ablage ID.
    *
    * @param $id ID of the Ablage to load.
    */
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung, Typ_Id, Guid
        FROM ".$this->getTableName()."
        WHERE Id = ".$id.";";
    }

    /**
    * Creates an Ablage instance and fills
    * the ID, Bezeichnung and GUID by the given
    * dataset.
    *
    * @param $dataset Dataset from Ablage table.
    */
    protected function fill($dataset)
    {
        if ($dataset == null)
        {
            return null;
        }

        global $logger;
        $logger->debug("Fülle Ablage (".intval($dataset["Id"]).") mit Daten");

        $ablage = new Ablage();
        $ablage->setId(intval($dataset["Id"]));
        $ablage->setBezeichnung($dataset["Bezeichnung"]);
        $ablage->setGuid($dataset["Guid"]);
        $ablage->setPath($this->getPath($ablage));
        $ablage->setType($this->getAblageTypeFactory()->loadById(intval($dataset["Typ_Id"])));

        return $ablage;
    }

    public function loadByFund($fund)
    {
        global $logger;
        $logger->debug("Lade Ablage anhand Fund (".$fund->getId().")");

        $ablage = null;
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByFund($fund));

            if ($mysqli->errno)
            {
                $logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
            }
            else
            {
                if ($datensatz = $ergebnis->fetch_assoc())
                {
					if ($datensatz["Id"] != null)
					{
                    	$ablage = $this->loadById(intval($datensatz["Id"]));
					}
                }
            }
        }

        $mysqli->close();

        return $ablage;
    }

    protected function getSQLStatementToLoadIdsByFund($fund)
    {
        return "SELECT Ablage_Id AS Id
        FROM ".$this->getFundFactory()->getTableName()."
        WHERE Id = ".$fund->getId().";";
    }
    #endregion

    #region save
    /**
    * Returns the SQL statement to insert Bezeichnung, Ablage type ID and GUID.
    *
    * @param iNode $ablage Ablage to be inserted.
    */
    protected function getSQLStatementToInsert(iNode $ablage)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung, Typ_Id, Guid)
        VALUES ('".addslashes($ablage->getBezeichnung())."', ".$ablage->getType()->getId().", UUID());";
    }

    /**
    * Returns the SQL statement to update Bezeichnung and Ablage type ID.
    * Note:GUID is not allowed to be changed (updated)!
    *
    * @param iNode $ablage Ablage to be updated.
    */
    protected function getSQLStatementToUpdate(iNode $ablage)
    {
        return "UPDATE ".$this->getTableName()."
        SET Bezeichnung = '".addslashes($ablage->getBezeichnung())."',
        Typ_Id = ".$ablage->getType()->getId()."
        WHERE Id = ".$ablage->getId().";";
    }
    #endregion

    #region convert
    public function convertToInstance($object)
    {
        global $logger;
        $logger->debug("Konvertiere Daten zu Ablage");

        if ($object == null)
        {
            $logger->error("Ablage ist nicht gesetzt!");
            return null;
        }

        $ablage = new Ablage();
        $ablageType = null;

        if (isset($object["Id"]))
        {
            $ablage->setId(intval($object["Id"]));
        }
        else
        {
            $logger->debug("Id ist nicht gesetzt!");
        }

        if (isset($object["Bezeichnung"]))
        {
            $ablage->setBezeichnung($object["Bezeichnung"]);
        }
        else
        {
            $logger->debug("Bezeichnung ist nicht gesetzt!");
        }

        if (isset($object["Type"]))
        {
            $ablageType = $this->getAblageTypeFactory()->convertToInstance($object["Type"]);
        }

        if ($ablageType == null ||
        		$ablageType->getId() == null ||
            $ablageType->getId() == "")
        {
            $logger->warn("Typ ist nicht gesetzt!");
        }
        else
        {
        		$ablage->setType($ablageType);
			}

        if (isset($object["Parent"]))
        {
            $ablage->setParent($this->convertToInstance($object["Parent"]));
        }
        else
        {
				$logger->debug("Parent ist nicht gesetzt!");
        }

        if (isset($object["Children"]))
        {
            for ($i = 0; $i < count($object["Children"]); $i++)
            {
                $ablage->addChild($this->convertToInstance($object["Children"][$i]));
            }
        }

        if (isset($object["Funde"]))
        {
            for ($i = 0; $i < count($object["Funde"]); $i++)
            {
                $ablage->addFund($this->getFundFactory()->convertToInstance($object["Funde"][$i]));
            }
        }

        if (isset($object["Guid"]))
        {
            $ablage->setGuid($object["Guid"]);
        }
        else
        {
            $logger->debug("GUID ist nicht gesetzt!");
        }

        return $ablage;
    }
    #endregion

    #region hierarchy
    #region parent
    public function loadParent(iTreeNode $ablage)
    {
        return $this->getTreeFactory()->loadParent($ablage);
    }

    public function linkParent(iTreeNode $ablage, iTreeNode $parent)
    {
        return $this->getTreeFactory()->linkParent($ablage, $parent);
    }

    public function unlinkParent(iTreeNode $ablage)
    {
        return $this->getTreeFactory()->unlinkParent($ablage);
    }

    public function updateParent(iTreeNode $ablage, iTreeNode $parent = null)
    {
        return $this->getTreeFactory()->updateParent($ablage, $parent);
    }
    #endregion

    #region children
    public function loadChildren(iTreeNode $ablage)
    {
        return $this->getTreeFactory()->loadChildren($ablage);
    }

    public function linkChild(iTreeNode $ablage, iTreeNode $child)
    {
        return $this->getTreeFactory()->linkChild($ablage, $child);
    }

    public function unlinkChild(iTreeNode $ablage, iTreeNode $child)
    {
        return $this->getTreeFactory()->unlinkChild($ablage, $child);
    }

    public function linkChildren(iTreeNode $ablage, array $children)
    {
        return $this->getTreeFactory()->linkChildren($ablage, $children);
    }

    public function unlinkChildren(iTreeNode $ablage, array $children)
    {
        return $this->getTreeFactory()->unlinkChildren($ablage, $children);
    }

    public function unlinkAllChildren(iTreeNode $ablage)
    {
        return $this->getTreeFactory()->unlinkAllChildren($ablage);
    }

    public function synchroniseChildren(iTreeNode $ablage, array $children)
    {
        return $this->getTreeFactory()->synchroniseChildren($ablage, $children);
    }
    #endregion

    public function getPath(iTreeNode $ablage)
    {
        return $this->getTreeFactory()->getPath($ablage);
    }

    public function loadRoots()
    {
        return $this->getTreeFactory()->loadRoots();
    }

    public static function isNodeInCircleCondition(iTreeNode $node)
    {
        return TreeFactory::isNodeInCircleCondition($node);
    }
    #endregion

    #region Kontext
    public function loadByKontext($kontext)
    {
        global $logger;
        $logger->debug("Lade Ablage anhand Kontext (".$kontext->getId().")");

        $elemente = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByKontext($kontext));

            if ($mysqli->errno)
            {
                $logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
            }
            else
            {
                while ($datensatz = $ergebnis->fetch_assoc())
                {
					if ($datensatz["Id"] != null)
					{
                    	array_push($elemente, $this->loadById(intval($datensatz["Id"])));
					}
                }
            }
        }

        $mysqli->close();

        return $elemente;
    }

    protected function getSQLStatementToLoadIdsByKontext($kontext)
    {
        return "SELECT DISTINCT Ablage_Id AS Id
        FROM Fund
        WHERE Kontext_Id = ".$kontext->getId().";";
    }
    #endregion

    #region Fund
    public function loadFunde(iFundContainer $ablage)
    {
        $ablage->setFunde($this->getFundFactory()->loadByAblage($ablage));

        return $ablage;
    }

    public function linkFund(iFundContainer $ablage, iNode $fund)
    {
        $ablage->addFund($this->getFundFactory()->linkAblage($fund, $ablage));

        return $ablage;
    }

    public function linkFunde(iFundContainer $ablage, array $funde)
    {
        for ($i = 0; $i < count($funde); $i++)
        {
            $ablage = $this->linkFund($ablage, $funde[$i]);
        }

        return $ablage;
    }

    public function unlinkFund(iFundContainer $ablage, iNode $fund)
    {
        $ablage->removeFund($this->getFundFactory()->unlinkAblage($fund, $ablage));

        return $ablage;
    }

    public function unlinkFunde(iFundContainer $ablage, array $funde)
    {
        for ($i = 0; $i < count($funde); $i++)
        {
            $this->unlinkFund($ablage, $funde[$i]);
        }

        return $ablage;
    }

    /**
    * Synchronises the Ablage's Funde with the given
    * Funden.
    * Returns the updated Ablage.
    *
    * @param iFundContainer $ablage Ablage to synchronise.
    * @param array $funde Funde to be used as new Funde.
    */
    public function synchroniseFunde(iFundContainer $ablage, array $funde)
    {
        $ablage = $this->linkNewFunde($ablage, $funde);
        $ablage = $this->unlinkObsoleteFunde($ablage, $funde);

        return $ablage;
    }

    /**
    * Links Funde that are not in the Ablage's
    * Fund list.
    * Returns the updated Ablage.
    *
    * @param iFundContainer $ablage Ablage to be updated with new Funden.
    * @param iNode $funde Funde to be used as new Funde.
    */
    protected function linkNewFunde(iFundContainer $ablage, array $funde)
    {
        for ($i = 0; $i < count($funde); $i++)
        {
            if (!$ablage->containsFund($funde[$i]))
            {
                $ablage = $this->linkFund($ablage, $funde[$i]);
            }
        }

        return $ablage;
    }

    /**
    * Unlinks Funde that are in the Ablage's
    * Fund list, but not in the given Funden.
    * Returns the updated Ablage.
    *
    * @param iFundContainer $ablage Ablage to be cleaned up from obsolete Funden.
    * @param array $funde Funde to be used as new Funde.
    */
    protected function unlinkObsoleteFunde(iFundContainer $ablage, array $funde)
    {
        for ($i = 0; $i < count($ablage->getFunde());)
        {
            $contains = false;

            for ($j = 0; $j < count($funde); $j++)
            {
                if ($funde[$j]->getId() == $ablage->getFunde()[$i]->getId())
                {
                    $contains = true;
                    break;
                }
            }

            if ($contains)
            {
                $i++;
            }
            else
            {
                $ablage = $this->unlinkFund($ablage, $ablage->getFunde()[$i]);
            }
        }

        return $ablage;
    }
    #endregion
    #endregion
}
