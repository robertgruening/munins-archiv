<?php
include_once(__DIR__."/IFundContainer.php");
include_once(__DIR__."/IAblageContainer.php");
include_once(__DIR__."/Kontext.php");
include_once(__DIR__."/Begehungsflaeche.php");
include_once(__DIR__."/Ablage.php");

class Begehung extends Kontext implements iFundContainer, iAblageContainer
{
    public $Ablagen;  
    public $Datum;
    public $Kommentar;
    public $LfDErfassungsJahr;
    public $LfDErfassungsNr;
    public $Funde;
    
    
    public function setParent($parent)
    {
        if (!($parent instanceof Begehungsflaeche))
        {
            return;
        }
    
        $this->Parent = $parent;
    }
    
    public function setChildren($children)
    {
        return;
        //throw new Exception("Begehung can not have a child!");
    }
    
    public function addChild($child)
    {
        return;
        //throw new Exception("Begehung can not have a child!");
    }
    
    public function getAblagen()
    {
        return $this->Ablagen;
    }
    
    public function setAblagen($ablagen)
    {
        $this->Ablagen = $ablagen;
    }
    
    public function addAblage($ablage)
    {
        array_push($this->Ablagen, $ablage);
    }
    
    public function removeAblage($ablage)
    {
        for ($i = 0; $i < count($this->Ablagen); $i++)
        {
            if ($this->Ablagen[$i]->getId() == $ablage->getId())
            {
                array_splice($this->Ablagen, $i, 1);
                break;
            }
        }
    }
    
    public function getDatum()
    {
        return $this->Datum;
    }
    
    public function setDatum($datum)
    {
        $this->Datum = $datum;
    }
    
    public function getKommentar()
    {
        return $this->Kommentar;
    }
    
    public function setKommentar($kommentar)
    {
        $this->Kommentar = $kommentar;
    }
    
    public function getFunde()
    {
        return $this->Funde;
    }
    
    public function setFunde($funde)
    {
        $this->Funde = $funde;
    }
    
    public function addFund($fund)
    {
        array_push($this->Funde, $fund);
    }
    
    public function removeFund($fund)
    {
        for ($i = 0; $i < count($this->Funde); $i++)
        {
            if ($this->Funde[$i]->getId() == $fund->getId())
            {
                array_splice($this->Funde, $i, 1);
                break;
            }
        }
    }
    
    function __construct()
    {
        parent::__construct();
        $this->Ablagen = array();
        $this->Datum = null;
        $this->Kommentar = null;
        $this->Funde = array();
   }
}
