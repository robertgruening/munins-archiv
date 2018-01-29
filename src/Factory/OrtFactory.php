<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/OrtTypFactory.php");
include_once(__DIR__."/ITreeFactory.php");
include_once(__DIR__."/TreeFactory.php");
include_once(__DIR__."/KontextFactory.php");
include_once(__DIR__."/../Model/Ort.php");
include_once(__DIR__."/../Model/IOrtContainer.php");

class OrtFactory extends Factory implements iTreeFactory
{
    #region variables
    private $_treeFactory = null;
    private $_ortsTypFactory = null;
    private $_kontextFactory = null;
    #endregion

    #region properties
    protected function getTreeFactory()
    {
        return $this->_treeFactory;
    }

    protected function getOrtsTypFactory()
    {
        return $this->_ortsTypFactory;
    }
    
    protected function getKontextFactory()
    {
        if ($this->_kontextFactory == null)
        {
            $this->_kontextFactory = new KontextFactory();
        }

        return $this->_kontextFactory;
    }
    #endregion

    #region constructors
    function __construct()
    {
        $this->_treeFactory = new TreeFactory($this);
        $this->_ortsTypFactory = new OrtTypFactory();
    }
    #endregion

    #region methods
    /**
     * Returns the name of the database table.
     */
    public function getTableName()
    {
        return "Ort";
    }

    #region load
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung, Typ_Id
                FROM ".$this->getTableName()."
                WHERE Id = ".$id.";";
    }
    
    protected function fill($dataSet)
    {
        if ($dataSet == null)
        {
            return null;
        }

        $ort = new Ort();
        $ort->setId(intval($dataSet["Id"]));
        $ort->setBezeichnung($dataSet["Bezeichnung"]);
        $ort->setPath($this->getPath($ort));
        $ort->setType($this->getOrtsTypFactory()->loadById(intval($dataSet["Typ_Id"])));
        
        return $ort;
    }
    #endregion

    #region save
    protected function getSQLStatementToInsert(iNode $ort)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung, Typ_Id)
                VALUES ('".$ort->getBezeichnung()."', ".$ort->getType()->getId().");";
    }

    protected function getSQLStatementToUpdate(iNode $ort)
    {
        return "UPDATE ".$this->getTableName()."
                SET Bezeichnung = '".$ort->getBezeichnung()."',
                SET Typ_Id = ".$ort->getType()->getId()."
                WHERE Id = ".$ort->getId().";";
    }
    #endregion
    
    #region convert
    public function convertToInstance($object)
    {
        if ($object == null)
        {
            return null;
        }

        $ort = new Ort();

        if (isset($object["Id"]))
        {
            $ort->setId(intval($object["Id"]));
        }

        $ort->setBezeichnung($object["Bezeichnung"]);
        $ort->setType($this->getOrtsTypFactory()->convertToInstance($object["Type"]));

        if (isset($object["Parent"]))
        {
            $ort->setParent($this->convertToInstance($object["Parent"]));
        }

        if (isset($object["Children"]))
        {
            for ($i = 0; $i < count($object["Children"]); $i++)
            {
                $ort->addChild($this->convertToInstance($object["Children"][$i]));
            }
        }
        
        if (isset($object["Kontexte"]))
        {
            for ($i = 0; $i < count($object["Kontexte"]); $i++)
            {
                $kontext = $this->getKontextFactory()->convertToInstance($object["Kontexte"][$i]);

                if ($kontext instanceof iOrtContainer)
                {
                    $ort->addKontext($kontext);
                }
            }
        }
        
        return $ort;
    }
    #endregion

    #region hierarchy
    #region parent
    public function loadParent(iTreeNode $ort)
    {
        return $this->getTreeFactory()->loadParent($ort);
    }

    public function linkParent(iTreeNode $ort, iTreeNode $parent)
    {
        return $this->getTreeFactory()->linkParent($ort, $parent);
    }
    
    public function unlinkParent(iTreeNode $ort)
    {
        return $this->getTreeFactory()->unlinkParent($ort);
    }

    public function updateParent(iTreeNode $ort, iTreeNode $parent = null)
    {
        return $this->getTreeFactory()->updateParent($ort, $parent);
    }
    #endregion

    #region children
    public function loadChildren(iTreeNode $ort)
    {
        return $this->getTreeFactory()->loadChildren($ort);
    }

    public function linkChild(iTreeNode $ort, iTreeNode $child)
    {
        return $this->getTreeFactory()->linkChild($ort, $child);
    }

    public function unlinkChild(iTreeNode $ort, iTreeNode $child)
    {
        return $this->getTreeFactory()->unlinkChild($ort, $child);
    }

    public function linkChildren(iTreeNode $ort, array $children)
    {
        return $this->getTreeFactory()->linkChildren($ort, $children);
    }

    public function unlinkChildren(iTreeNode $ort, array $children)
    {
        return $this->getTreeFactory()->unlinkChildren($ort, $children);
    }

    public function unlinkAllChildren(iTreeNode $ort)
    {
        return $this->getTreeFactory()->unlinkAllChildren($ort);
    }

    public function synchroniseChildren(iTreeNode $ort, array $children)
    {
        return $this->getTreeFactory()->synchroniseChildren($ort, $children);
    }
    #endregion

    public function getPath(iTreeNode $ort)
    {
        return $this->getTreeFactory()->getPath($ort);
    }
    
    public function loadRoots()
    {
        return $this->getTreeFactory()->loadRoots();
    }
    #endregion
    
    #region Kontext
    public function loadByKontext($kontext)
    {
        $elemente = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByKontext($kontext));	
			
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($elemente, $this->loadById(intval($datensatz["Id"])));
				}
			}
		}
		
		$mysqli->close();
		
		return $elemente;
    }
    
    protected function getSQLStatementToLoadIdsByKontext($kontext)
    {
        return "SELECT Ort_Id AS Id
                FROM Kontext_".$this->getTableName()."
                WHERE Kontext_Id = ".$kontext->getId().";";
    }

    public function loadKontexte(Ort $element)
    {        
        $kontexte = $this->getKontextFactory()->loadByOrt($element);
        $element->setKontexte($kontexte);
        
        return $element;
    }
    #endregion
    #endregion
}
