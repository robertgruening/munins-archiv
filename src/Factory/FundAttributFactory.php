<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/FundAttributTypFactory.php");
include_once(__DIR__."/ITreeFactory.php");
include_once(__DIR__."/TreeFactory.php");
include_once(__DIR__."/FundFactory.php");
include_once(__DIR__."/../Model/FundAttribut.php");

class FundAttributFactory extends Factory implements iTreeFactory
{
    #region variables
    private $_treeFactory = null;
    private $_fundAttributTypFactory = null;
    private $_fundFactory = null;
    #endregion

    #region properties
    protected function getTreeFactory()
    {
        return $this->_treeFactory;
    }

    protected function getFundAttributTypFactory()
    {
        return $this->_fundAttributTypFactory;
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
        $this->_fundAttributTypFactory = new FundAttributTypFactory();
    }
    #endregion

    /**
     * Returns the name of the database table.
     */
    public function getTableName()
    {
        return "FundAttribut";
    }

    #region load
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung, Typ_Id
                FROM FundAttribut
                WHERE Id = ".$id.";";
    }

    public function loadByFund($fund)
    {
        $fundAttribute = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByFund($fund));	
			
			if (!$mysqli->errno)
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
        $fundAttribut->setType($this->getFundAttributTypFactory()->loadById(intval($dataSet["Typ_Id"])));
        
        return $fundAttribut;
    }
    #endregion

    #region save
    protected function getSQLStatementToInsert(iNode $element)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung, Typ_Id)
                VALUES ('".$element->getBezeichnung()."', ".$element->getType()->getId().");";
    }

    protected function getSQLStatementToUpdate(iNode $element)
    {
        return "UPDATE ".$this->getTableName()."
                SET Bezeichnung = '".$element->getBezeichnung()."',
                SET Typ_Id = ".$element->getType()->getId()."
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

        $fundAttribut = new FundAttribut();

        if (isset($object["Id"]))
        {
            $fundAttribut->setId(intval($object["Id"]));
        }

        $fundAttribut->setBezeichnung($object["Bezeichnung"]);
        $fundAttribut->setType($this->getFundAttributTypFactory()->convertToInstance($object["Type"]));

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

        // Review: convert Funde
        
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
    #endregion

    #region Funde
    public function loadFunde(FundAttribut $element)
    {        
        $funde = $this->getFundFactory()->loadByFundAttribut($element);
        $element->setFunde($funde);
        
        return $element;
    }
    #endregion
}
