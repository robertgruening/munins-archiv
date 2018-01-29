<?php
include_once(__DIR__."/IOrtContainer.php");
include_once(__DIR__."/Kontext.php");
include_once(__DIR__."/Fundstelle.php");
include_once(__DIR__."/Begehung.php");
include_once(__DIR__."/Ort.php");

class Begehungsflaeche extends Kontext implements iOrtContainer
{
    #region variables
    public $Orte;
    #endregion
    
    #region properties
    public function setParent($parent)
    {
        if (!($parent instanceof Fundstelle))
        {
            return;
        }
    
        $this->Parent = $parent;
    }
    
    public function setChildren($children)
    {
        for ($i = 0; $i < count($children); $i++)
        {
            if (!($children[$i] instanceof Begehung))
            {
                throw new Exception("Child is not of type \"Begehung\"!");
            }
        }
    
        $this->Children = $children;
    }
    
    public function addChild($child)
    {
        if (!($child instanceof Begehung))
        {
            throw new Exception("Child is not of type \"Begehung\"!");
        }
        
        array_push($this->Children, $child);
    }
    
    public function getOrte()
    {
        return $this->Orte;
    }
    
    public function setOrte($orte)
    {
        $this->Orte = $orte;
    }
    
    public function addOrt($ort)
    {
        array_push($this->Orte, $ort);
    }
    
    public function removeOrt($ort)
    {
        for ($i = 0; $i < count($this->Orte); $i++)
        {
            if ($this->Orte[$i]->getId() == $ort->getId())
            {
                array_splice($this->Orte, $i, 1);
                break;
            }
        }
    }
    #endregion
    
    #region constructors
    function __construct()
    {
       parent::__construct();
       $this->Orte = array();
    }
    #endregion
}
