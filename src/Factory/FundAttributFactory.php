<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/FundAttributTypeFactory.php");
include_once(__DIR__."/ITreeFactory.php");
include_once(__DIR__."/TreeFactory.php");
include_once(__DIR__."/FundFactory.php");
include_once(__DIR__."/../Model/FundAttribut.php");

class FundAttributFactory extends Factory implements iTreeFactory
{
    #region variables
    private $_treeFactory = null;
    private $_fundAttributTypeFactory = null;
    #endregion

    #region properties
    protected function getTreeFactory()
    {
        return $this->_treeFactory;
    }

    protected function getFundAttributTypeFactory()
    {
        return $this->_fundAttributTypeFactory;
    }
    #endregion

    #region constructors
    function __construct()
    {
        $this->_treeFactory = new TreeFactory($this);
        $this->_fundAttributTypeFactory = new FundAttributTypeFactory();
    }
    #endregion

    #region methods
    /**
     * Returns the name of the database table.
     */
    public function getTableName()
    {
        return "FundAttribut";
    }

    #region load
    /**
     * Returns the SQL statement to load ID, Bezeichnung, Fundattribut type ID and count of Funde
     * by Fundattribut ID.
     * 
     * @param $id ID of the Fundattribut to load.
     */
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung, Typ_Id, COUNT(*) AS CountOfFunde
                FROM FundAttribut RIGHT JOIN Fund_FundAttribut ON FundAttribut.Id = Fund_FundAttribut.FundAttribut_Id
                WHERE Id = ".$id.";";
    }
    
    /**
     * Creates an Fundattribut instance and fills
     * the ID, Bezeichnung, Fundattribut type and 
     * count of Funde by the given dataset.
     * 
     * @param $dataSet Dataset from Fundattribut table.
     */
    protected function fill($dataSet)
    {
        if ($dataSet == null)
        {
            return null;
        }

        $fundAttribut = new FundAttribut();
        $fundAttribut->setId(intval($dataSet["Id"]));
        $fundAttribut->setBezeichnung($dataSet["Bezeichnung"]);
        $fundAttribut->setPath($this->getPath($fundAttribut));
        $fundAttribut->setType($this->getFundAttributTypeFactory()->loadById(intval($dataSet["Typ_Id"])));
        $fundAttribut->setCountOfFunde(intval($dataSet["CountOfFunde"]));
        
        return $fundAttribut;
    }

    public function loadByFund($fund)
    {
        $fundAttribute = array();
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
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($fundAttribute, $this->loadById(intval($datensatz["Id"])));
				}
			}
		}
		
		$mysqli->close();
		
		return $fundAttribute;
    }
    
    protected function getSQLStatementToLoadIdsByFund($fund)
    {
        return "SELECT FundAttribut_Id AS Id
                FROM Fund_FundAttribut
                WHERE Fund_Id = ".$fund->getId().";";
    }
    #endregion

    #region save
    /**
     * Returns the SQL statement to insert Bezeichnung and Fundattribut type ID.
     * 
     * @param iNode $element Fundattribut to be inserted.
     */
    protected function getSQLStatementToInsert(iNode $element)
    {        
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung, Typ_Id)
                VALUES ('".$element->getBezeichnung()."', ".$element->getType()->getId().");";
    }
    
    /**
     * Returns the SQL statement to update Bezeichnung and Fundattribut type ID.
     * 
     * @param iNode $element Fundattribut to be updated.
     */
    protected function getSQLStatementToUpdate(iNode $element)
    {
        return "UPDATE ".$this->getTableName()."
                SET Bezeichnung = '".$element->getBezeichnung()."',
                    Typ_Id = ".$element->getType()->getId()."
                WHERE Id = ".$element->getId().";";
    }
    #endregion
    
    #region convert
    public function convertToInstance($object)
    {
        global $logger;
        $logger->debug("Konvertiere Daten zu Fundattribut");

        if ($object == null)
        {
            $logger->error("Fundattribut ist nicht gesetzt!");
            return null;
        }

        $fundAttribut = new FundAttribut();

        if (isset($object["Id"]))
        {
            $fundAttribut->setId(intval($object["Id"]));
        }
        else
        {
            $logger->debug("Id ist nicht gesetzt!");
        }

        if (isset($object["Bezeichnung"]))
        {
            $fundAttribut->setBezeichnung($object["Bezeichnung"]);
        }
        else
        {
            $logger->debug("Bezeichnung ist nicht gesetzt!");
        }

        if (isset($object["Type"]))
        {
            $fundAttribut->setType($this->getFundAttributTypeFactory()->convertToInstance($object["Type"]));
        }
        else
        {
            $logger->warn("Typ ist nicht gesetzt!");
        }

        if (isset($object["Parent"]))
        {
            $fundAttribut->setParent($this->convertToInstance($object["Parent"]));
        }

        if (isset($object["Children"]))
        {
            for ($i = 0; $i < count($object["Children"]); $i++)
            {
                $fundAttribut->addChild($this->convertToInstance($object["Children"][$i]));
            }
        }

        if (isset($object["CountOfFunde"]))
        {
            $fundAttribut->setCountOfFunde(intval($object["CountOfFunde"]));
        }
        
        return $fundAttribut;
    }
    #endregion

    #region hierarchy
    #region parent
    public function loadParent(iTreeNode $fundAttribut)
    {
        return $this->getTreeFactory()->loadParent($fundAttribut);
    }

    public function linkParent(iTreeNode $fundAttribut, iTreeNode $parent)
    {
        return $this->getTreeFactory()->linkParent($fundAttribut, $parent);
    }
    
    public function unlinkParent(iTreeNode $fundAttribut)
    {
        return $this->getTreeFactory()->unlinkParent($fundAttribut);
    }

    public function updateParent(iTreeNode $fundAttribut, iTreeNode $parent = null)
    {
        return $this->getTreeFactory()->updateParent($fundAttribut, $parent);
    }
    #endregion

    #region children
    public function loadChildren(iTreeNode $fundAttribut)
    {
        return $this->getTreeFactory()->loadChildren($fundAttribut);
    }

    public function linkChild(iTreeNode $fundAttribut, iTreeNode $child)
    {
        return $this->getTreeFactory()->linkChild($fundAttribut, $child);
    }

    public function unlinkChild(iTreeNode $fundAttribut, iTreeNode $child)
    {
        return $this->getTreeFactory()->unlinkChild($fundAttribut, $child);
    }

    public function linkChildren(iTreeNode $fundAttribut, array $children)
    {
        return $this->getTreeFactory()->linkChildren($fundAttribut, $children);
    }

    public function unlinkChildren(iTreeNode $fundAttribut, array $children)
    {
        return $this->getTreeFactory()->unlinkChildren($fundAttribut, $children);
    }

    public function unlinkAllChildren(iTreeNode $fundAttribut)
    {
        return $this->getTreeFactory()->unlinkAllChildren($fundAttribut);
    }

    public function synchroniseChildren(iTreeNode $fundAttribut, array $children)
    {
        return $this->getTreeFactory()->synchroniseChildren($fundAttribut, $children);
    }
    #endregion

    public function getPath(iTreeNode $fundAttribut)
    {
        return $this->getTreeFactory()->getPath($fundAttribut);
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
    #endregion
}
