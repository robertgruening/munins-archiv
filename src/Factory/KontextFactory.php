<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/KontextTypFactory.php");
include_once(__DIR__."/ITreeFactory.php");
include_once(__DIR__."/TreeFactory.php");
include_once(__DIR__."/FundFactory.php");
include_once(__DIR__."/AblageFactory.php");
include_once(__DIR__."/OrtFactory.php");
include_once(__DIR__."/../Model/Kontext.php");
include_once(__DIR__."/../Model/Fundstelle.php");
include_once(__DIR__."/../Model/Begehungsflaeche.php");
include_once(__DIR__."/../Model/Begehung.php");

class KontextFactory extends Factory implements iTreeFactory
{
    protected function getSQLStatementToLoadById($id)
    {    
        $kontextTypFactory = new KontextTypFactory();
        $kontextTyp = $kontextTypFactory->loadByNodeId($id);
        
        switch ($kontextTyp->getBezeichnung())
        {
            case "Fundstelle":
            {
                return "SELECT Id, Bezeichnung, Typ_Id
                        FROM ".$this->getTableName()."
                        WHERE Id = ".$id;
            }
            case "Begehungsflaeche":
            {
                return "SELECT Id, Bezeichnung, Typ_Id
                        FROM ".$this->getTableName()."
                        WHERE Id = ".$id;
            }
            case "Begehung":
            {
                return "SELECT Kontext.Id AS Id, Bezeichnung, Typ_Id, Datum, Kommentar, LfDErfassungsJahr, LfDErfassungsNr
                        FROM ".$this->getTableName()." LEFT JOIN Begehung ON Kontext.Id = Begehung.Id
                        WHERE Kontext.Id = ".$id;
            }
        }
        
        return "SELECT Id, Bezeichnung, Typ_Id
                FROM ".$this->getTableName()."
                WHERE Id = ".$id;
    }
    
    protected function fill($dataSet)
    {
        $kontextTypFactory = new KontextTypFactory();
        $kontextTyp = $kontextTypFactory->loadById(intval($dataSet["Typ_Id"]));
                
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
            $kontext->setLfDErfassungsJahr(intval($dataSet["LfDErfassungsJahr"]));
            $kontext->setLfDErfassungsNr(intval($dataSet["LfDErfassungsNr"]));
        }
        
        return $kontext;
    }
    
    public function loadParent($element)
    {
        $treeFactory = new TreeFactory($this);
        $parent = $treeFactory->loadParent($element);
        $element->setParent($parent);
        
        return $element;
    }

    public function loadChildren($element)
    {
        $treeFactory = new TreeFactory($this);
        $children = $treeFactory->loadChildren($element);
        $element->setChildren($children);
        
        return $element;
    }

    public function getPath($element)
    {
        $treeFactory = new TreeFactory($this);
        
        return $treeFactory->getPath($element);
    }

    public function loadFunde($element)
    {
        if (!($element instanceof iFundContainer))
        {
            return $element;
        }
        
        $fundFactory = new FundFactory();
        $funde = $fundFactory->loadByKontext($element);
        $element->setFunde($funde);
        
        return $element;
    }

    public function loadAblagen($element)
    {
        if (!($element instanceof iAblageContainer))
        {
            return $element;
        }
        
        $ablageFactory = new AblageFactory();
        $ablagen = $ablageFactory->loadByKontext($element);
        $element->setAblagen($ablagen);
        
        return $element;
    }

    public function loadOrte($element)
    {
        if (!($element instanceof iOrtContainer))
        {
            return $element;
        }
        
        $ortFactory = new OrtFactory();
        $orte = $ortFactory->loadByKontext($element);
        $element->setOrte($orte);
        
        return $element;
    }
    
    public function loadRoots()
    {
        $treeFactory = new TreeFactory($this);
        
        return $treeFactory->loadRoots();
    }
    
    public function getTableName()
    {
        return "Kontext";
    }
}
