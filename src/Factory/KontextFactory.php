<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/KontextTypFactory.php");
include_once(__DIR__."/ITreeFactory.php");
include_once(__DIR__."/TreeFactory.php");
include_once(__DIR__."/FundFactory.php");
include_once(__DIR__."/AblageFactory.php");
include_once(__DIR__."/OrtFactory.php");
include_once(__DIR__."/LfdNummerFactory.php");
include_once(__DIR__."/../Model/Kontext.php");
include_once(__DIR__."/../Model/Fundstelle.php");
include_once(__DIR__."/../Model/Begehungsflaeche.php");
include_once(__DIR__."/../Model/Begehung.php");

class KontextFactory extends Factory implements iTreeFactory
{
    #region variables
    private $_treeFactory = null;
    private $_kontextTypFactory = null;
    private $_fundFactory = null;
    private $_ortFactory = null;
    private $_ablageFactory = null;
    private $_lfdNummernFactory = null;
    #endregion

    #region properties
    protected function getTreeFactory()
    {
        return $this->_treeFactory;
    }

    protected function getKontextTypFactory()
    {
        return $this->_kontextTypFactory;
    }
    
    protected function getFundFactory()
    {
        if ($this->_fundFactory == null)
        {
            $this->_fundFactory = new FundFactory();
        }

        return $this->_fundFactory;
    }
    
    protected function getOrtFactory()
    {
        if ($this->_ortFactory == null)
        {
            $this->_ortFactory = new OrtFactory();
        }

        return $this->_ortFactory;
    }
    
    protected function getAblageFactory()
    {
        if ($this->_ablageFactory == null)
        {
            $this->_ablageFactory = new AblageFactory();
        }

        return $this->_ablageFactory;
    }
    
    protected function getLfdNummernFactory()
    {
        if ($this->_lfdNummernFactory == null)
        {
            $this->_lfdNummernFactory = new LfdNummernFactory();
        }

        return $this->_lfdNummernFactory;
    }
    #endregion

    #region constructors
    function __construct()
    {
        $this->_treeFactory = new TreeFactory($this);
        $this->_kontextTypFactory = new KontextTypFactory();
    }
    #endregion

    #region methods
    /**
     * Returns the name of the database table.
     */
    public function getTableName()
    {
        return "Kontext";
    }

    #region load
    protected function getSQLStatementToLoadById($id)
    {    
        $kontextTyp = $this->getKontextTypFactory()->loadByNodeId($id);

        if ($kontextTyp == null)
        {        
            return "SELECT Id, Bezeichnung, Typ_Id
                FROM ".$this->getTableName()."
                WHERE Id = ".$id.";";
        }
        
        switch ($kontextTyp->getBezeichnung())
        {
            case "Fundstelle":
            {
                return "SELECT Id, Bezeichnung, Typ_Id
                        FROM ".$this->getTableName()."
                        WHERE Id = ".$id.";";
            }
            case "Begehungsfläche":
            {
                return "SELECT Id, Bezeichnung, Typ_Id
                        FROM ".$this->getTableName()."
                        WHERE Id = ".$id.";";
            }
            case "Begehung":
            {
                return "SELECT Kontext.Id AS Id, Bezeichnung, Typ_Id, Datum, Kommentar
                        FROM ".$this->getTableName()." LEFT JOIN Begehung ON Kontext.Id = Begehung.Id
                        WHERE Kontext.Id = ".$id.";";
            }
        }
        
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

        $kontextTyp = $this->getKontextTypFactory()->loadById(intval($dataSet["Typ_Id"]));
                
        $kontext = null;    
        
        switch ($kontextTyp->getBezeichnung())
        {
            case "Fundstelle":
            {
                $kontext = new Fundstelle();
                break;
            }
            case "Begehungsfläche":
            {
                $kontext = new Begehungsflaeche();
                break;
            }
            case "Begehung":
            {
                $kontext = new Begehung();
                break;
            }
        }
        
        $kontext->setId(intval($dataSet["Id"]));
        $kontext->setBezeichnung($dataSet["Bezeichnung"]);
        $kontext->setPath($this->getPath($kontext));
        $kontext->setType($kontextTyp);
        
        if ($kontext instanceof Begehung)        
        {
            $kontext->setDatum($dataSet["Datum"]);
            $kontext->setKommentar($dataSet["Kommentar"]);
        }
        
        return $kontext;
    }
    
    public function loadByFund($fund)
    {
        $kontexte = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
        
        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByFund($fund));	
            
            if (!$mysqli->errno)
            {
                while ($datensatz = $ergebnis->fetch_assoc())
                {
                    array_push($kontexte, $this->loadById(intval($datensatz["Id"])));
                }
            }
        }
        
        $mysqli->close();
        
        return $kontexte;
    }
    
    protected function getSQLStatementToLoadIdsByFund($fund)
    {
        return "SELECT Kontext_Id AS Id
                FROM ".$this->getFundFactory()->getTableName()."
                WHERE Id = ".$fund->getId().";";
    }
    #endregion

    #region save
    protected function getSQLStatementToInsert(iNode $kontext)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung, Typ_Id)
                VALUES ('".$kontext->getBezeichnung()."', ".$kontext->getType()->getId().");";
    }

    protected function getSQLStatementToUpdate(iNode $kontext)
    {
        return "UPDATE ".$this->getTableName()."
                SET Bezeichnung = '".$kontext->getBezeichnung()."',
                SET Typ_Id = ".$kontext->getType()->getId()."
                WHERE Id = ".$kontext->getId().";";
    }
    #endregion

    #region convert
    public function convertToInstance($object)
    {
        if ($object == null ||
            !isset($object["Type"]))
        {
            return null;
        }

        $kontextTyp = $this->getKontextTypFactory()->convertToInstance($object["Type"]);
        $kontext = null;        

        switch ($kontextTyp->getBezeichnung())
        {
            case "Fundstelle" : 
            {
                $kontext = new Fundstelle();
                break;
            }
            case "Begehungsfläche" : 
            {
                $kontext = new Begehungsflaeche();
                break;
            }
            case "Begehung" : 
            {
                $kontext = new Begehung();
                break;
            }
            default :
            {
                return null;
                // throw new Exception("Unbekannter Kontexttyp!");
            }
        }

        if (isset($object["Id"]))
        {
            $kontext->setId(intval($object["Id"]));
        }

        $kontext->setBezeichnung($object["Bezeichnung"]);
        $kontext->setType($kontextTyp);

        if (isset($object["Parent"]))
        {
            $kontext->setParent($this->convertToInstance($object["Parent"]));
        }

        if (isset($object["Children"]))
        {
            for ($i = 0; $i < count($object["Children"]); $i++)
            {
                $kontext->addChild($this->convertToInstance($object["Children"][$i]));
            }
        }

        if (isset($object["Funde"]))
        {
            for ($i = 0; $i < count($object["Funde"]); $i++)
            {
                $kontext->addFund($this->getFundFactory()->convertToInstance($object["Funde"][$i]));
            }
        }
        
        return $kontext;
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
    #endregion

    #region Fund
    public function loadFunde($element)
    {
        if (!($element instanceof iFundContainer))
        {
            return $element;
        }
        
        $funde = $this->getFundFactory()->loadByKontext($element);
        $element->setFunde($funde);
        
        return $element;
    }
    #endregion

    #region Ablage
    public function loadAblagen($element)
    {
        if (!($element instanceof iAblageContainer))
        {
            return $element;
        }
        
        $ablagen = $this->getAblageFactory()->loadByKontext($element);
        $element->setAblagen($ablagen);
        
        return $element;
    }
    #endregion

    #region Ort    
    public function loadByOrt($ort)
    {
        $kontexte = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
        
        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByOrt($ort));	
            
            if (!$mysqli->errno)
            {
                while ($datensatz = $ergebnis->fetch_assoc())
                {
                    array_push($kontexte, $this->loadById(intval($datensatz["Id"])));
                }
            }
        }
        
        $mysqli->close();
        
        return $kontexte;
    }
    
    protected function getSQLStatementToLoadIdsByOrt($ort)
    {
        return "SELECT Kontext_Id AS Id
                FROM ".$this->getFundFactory()->getTableName()."_Ort
                WHERE Ort_Id = ".$ort->getId().";";
    }

    public function loadOrte($element)
    {
        if (!($element instanceof iOrtContainer))
        {
            return $element;
        }
        
        $orte = $this->getOrtFactory()->loadByKontext($element);
        $element->setOrte($orte);
        
        return $element;
    }
    #endregion
    
    #region LfdNummer
    public function loadByLfdNummer($lfdNummer)
    {
        $kontexte = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByLfdNummer($lfdNummer));	
			
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($kontexte, $this->loadById(intval($datensatz["Id"])));
				}
			}
		}
		
		$mysqli->close();
		
		return $kontexte;
    }
    
    protected function getSQLStatementToLoadIdsByLfdNummer($lfdNummer)
    {
        return "SELECT Kontext_Id AS Id
                FROM ".$this->getTableName()."_LfdNummer
                WHERE LfdNummer_Id = ".$lfdNummer->getId().";";
    }

    public function loadLfdNummern($element)
    {        
        $lfdNummern = $this->getLfdNummernFactory()->loadByKontext($element);
        $element->setLfdNummern($lfdNummern);
        
        return $element;
    }
    #endregion
    #endregion
}
